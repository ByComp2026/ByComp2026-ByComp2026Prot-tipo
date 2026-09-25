import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, sanitizeFirestoreDoc } from './firebase';
import { SupportTicket, Priority } from '../types';

export interface TicketValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTicketData(ticket: Partial<SupportTicket>): TicketValidationResult {
  const errors: string[] = [];
  const title = ticket.subject || ticket.title;
  const requester = ticket.client || ticket.requester;

  if (!title || title.trim().length < 4) {
    errors.push('O título ou assunto do chamado deve conter pelo menos 4 caracteres.');
  }

  if (!ticket.sector || (typeof ticket.sector === 'string' && ticket.sector.trim().length === 0)) {
    errors.push('Selecione o setor de destino responsável pelo chamado.');
  }

  if (!ticket.priority) {
    errors.push('Defina a prioridade do chamado (Baixa, Média, Alta, Urgente ou Crítica).');
  }

  if (!requester || requester.trim().length < 2) {
    errors.push('Identificação do solicitante / cliente é obrigatória.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

class TicketService {
  // Listen to tickets in real-time from Firebase Firestore
  // All old mock tickets removed as requested by user; now 100% Firestore backed
  public subscribeTickets(callback: (tickets: SupportTicket[]) => void): () => void {
    const ticketsCol = collection(db, 'tickets');
    const q = query(ticketsCol, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const tickets: SupportTicket[] = [];
        snapshot.forEach((d) => {
          tickets.push(d.data() as SupportTicket);
        });
        callback(tickets);
      },
      (error) => {
        // Fallback to unordered if index is pending
        console.warn('Ordered tickets query failed, fallback to collection:', error);
        return onSnapshot(ticketsCol, (fallbackSnap) => {
          const fallbackTickets: SupportTicket[] = [];
          fallbackSnap.forEach((d) => fallbackTickets.push(d.data() as SupportTicket));
          callback(fallbackTickets);
        });
      }
    );
  }

  // Create ticket with strict Firestore validation and sanitization
  public async createTicket(
    data: Omit<SupportTicket, 'id' | 'openTime'> & { openTime?: string }
  ): Promise<SupportTicket> {
    const validation = validateTicketData(data);
    if (!validation.valid) {
      throw new Error(`Validação do chamado falhou: ${validation.errors.join(' | ')}`);
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `CHM-${year}-${randomSuffix}`;
    const nowISO = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('pt-BR');
    const formattedTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Calculate SLA target
    let slaTarget = '4h';
    if (data.priority === 'Crítica') slaTarget = '1h';
    else if (data.priority === 'Alta') slaTarget = '2h';
    else if (data.priority === 'Baixa') slaTarget = '8h';

    const title = (data.subject || data.title || '').trim();
    const client = (data.client || data.requester || '').trim();

    const newTicket: SupportTicket = {
      id: ticketId,
      title,
      subject: title,
      client,
      requester: client,
      description: data.description || '',
      category: data.category || data.serviceType || 'Suporte Técnico',
      serviceType: data.serviceType || data.category || 'Suporte Técnico',
      sector: data.sector,
      priority: data.priority,
      status: data.status || 'Aberto',
      requesterEmail: data.requesterEmail || data.contactEmail || 'colaborador@bycomp.com.br',
      contactEmail: data.contactEmail || data.requesterEmail || 'colaborador@bycomp.com.br',
      assignedTo: data.assignedTo || '',
      assignedAvatar: data.assignedAvatar || '',
      openTime: data.openTime || `${formattedDate} às ${formattedTime}`,
      sla: slaTarget,
      tags: data.tags || [data.sector, data.priority],
      history: data.history || [
        {
          timestamp: `${formattedDate} ${formattedTime}`,
          action: 'Chamado aberto e registrado no Firebase Firestore',
          user: client || 'Solicitante',
          details: `Ticket validado pelo banco de dados com prioridade ${data.priority} e SLA de ${slaTarget}.`
        }
      ],
      createdAt: nowISO,
      updatedAt: nowISO
    };

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      // Clean undefined properties before writing to Firestore
      const sanitizedDoc = sanitizeFirestoreDoc(newTicket);
      await setDoc(ticketRef, sanitizedDoc);
      console.log('Ticket successfully created and validated in Firebase Firestore:', ticketId);
      return newTicket;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `tickets/${ticketId}`);
      throw error;
    }
  }

  // Update Ticket in Firestore
  public async updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<void> {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const sanitizedUpdates = sanitizeFirestoreDoc({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      await setDoc(ticketRef, sanitizedUpdates, { merge: true });
      console.log('Ticket updated in Firestore:', ticketId);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  }

  // Transfer Ticket
  public async transferTicket(
    ticketId: string,
    targetSector: string,
    reason: string,
    transferredBy: string,
    newAssignee?: string
  ): Promise<void> {
    const formattedDate = new Date().toLocaleDateString('pt-BR');
    const formattedTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const snap = await getDocs(collection(db, 'tickets'));
      let currentTicket: SupportTicket | null = null;
      snap.forEach((d) => {
        if (d.id === ticketId) currentTicket = d.data() as SupportTicket;
      });

      const history = currentTicket?.history || [];
      history.push({
        timestamp: `${formattedDate} ${formattedTime}`,
        action: `Chamado transferido para o setor ${targetSector}`,
        user: transferredBy,
        details: `Motivo: ${reason}. Novo responsável: ${newAssignee || 'Fila do setor'}.`
      });

      const sanitizedPayload = sanitizeFirestoreDoc({
        sector: targetSector,
        status: 'Transferido',
        assignedTo: newAssignee || '',
        history,
        updatedAt: new Date().toISOString()
      });

      await setDoc(ticketRef, sanitizedPayload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  }

  // Finalize Ticket
  public async finalizeTicket(
    ticketId: string,
    resolution: string,
    resolvedBy: string,
    timeSpent?: string
  ): Promise<void> {
    const formattedDate = new Date().toLocaleDateString('pt-BR');
    const formattedTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const snap = await getDocs(collection(db, 'tickets'));
      let currentTicket: SupportTicket | null = null;
      snap.forEach((d) => {
        if (d.id === ticketId) currentTicket = d.data() as SupportTicket;
      });

      const history = currentTicket?.history || [];
      history.push({
        timestamp: `${formattedDate} ${formattedTime}`,
        action: 'Chamado finalizado e resolvido com sucesso',
        user: resolvedBy,
        details: `Solução aplicada: ${resolution}${timeSpent ? ` (Tempo: ${timeSpent})` : ''}`
      });

      const sanitizedPayload = sanitizeFirestoreDoc({
        status: 'Resolvido',
        resolutionSummary: resolution,
        resolution,
        resolvedBy,
        resolutionTimeSpent: timeSpent || '',
        closedAt: `${formattedDate} às ${formattedTime}`,
        resolvedAt: new Date().toISOString(),
        history,
        updatedAt: new Date().toISOString()
      });

      await setDoc(ticketRef, sanitizedPayload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  }

  // Delete ticket
  public async deleteTicket(ticketId: string): Promise<void> {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await deleteDoc(ticketRef);
      console.log('Ticket deleted from Firestore:', ticketId);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tickets/${ticketId}`);
    }
  }

  // Clear all tickets (used for clean slate setup requested by user)
  public async clearAllTickets(): Promise<void> {
    try {
      const ticketsCol = collection(db, 'tickets');
      const snap = await getDocs(ticketsCol);
      const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      console.log('All previous tickets cleared from Firestore as requested.');
    } catch (error) {
      console.warn('Error clearing tickets:', error);
    }
  }
}

export const ticketService = new TicketService();
