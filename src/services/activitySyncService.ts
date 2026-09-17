import { SupportTicket, ActivityRecord, KnowledgeArticle, Collaborator, Sector, Priority } from '../types';
import { TICKETS_DATA, SMART_SPREADSHEET_DATA } from '../data/mockData';
import { INITIAL_FORM_SUBMISSIONS } from '../data/formSubmissions';
import { KNOWLEDGE_BASE_DATA } from '../data/knowledgeBase';
import { FormSubmissionRecord } from '../utils/excelExport';

const STORAGE_KEYS = {
  TICKETS: 'bycomp_tickets_v1',
  ACTIVITIES: 'bycomp_activities_v1',
  SUBMISSIONS: 'bycomp_form_submissions_v1',
  KNOWLEDGE_BASE: 'bycomp_knowledge_base_v1'
};

type Listener = () => void;

class ActivitySyncService {
  private tickets: SupportTicket[] = [];
  private activities: ActivityRecord[] = [];
  private submissions: FormSubmissionRecord[] = [];
  private knowledgeBase: KnowledgeArticle[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initData();
  }

  private initData() {
    // 1. Tickets
    try {
      const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (storedTickets) {
        this.tickets = JSON.parse(storedTickets);
      } else {
        this.tickets = [...TICKETS_DATA].map(t => ({
          ...t,
          assignedTo: t.status === 'Em atendimento' ? 'Victor Estevão' : undefined,
          history: [
            {
              timestamp: '16/09/2026 08:30',
              action: 'Chamado aberto no sistema',
              user: 'Sistema Help Desk',
              details: `Triagem automática inicial com SLA de ${t.openTime}.`
            }
          ]
        }));
        this.saveTickets();
      }
    } catch {
      this.tickets = [...TICKETS_DATA];
    }

    // 2. Activities (Base de Atividades / Smart Spreadsheet)
    try {
      const storedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (storedActivities) {
        this.activities = JSON.parse(storedActivities);
      } else {
        this.activities = [...SMART_SPREADSHEET_DATA];
        this.saveActivities();
      }
    } catch {
      this.activities = [...SMART_SPREADSHEET_DATA];
    }

    // 3. Form Submissions (Formulários & Banco)
    try {
      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (storedSubmissions) {
        this.submissions = JSON.parse(storedSubmissions);
      } else {
        this.submissions = [...INITIAL_FORM_SUBMISSIONS];
        this.saveSubmissions();
      }
    } catch {
      this.submissions = [...INITIAL_FORM_SUBMISSIONS];
    }

    // 4. Knowledge Base (Fase 6)
    try {
      const storedKB = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      if (storedKB) {
        this.knowledgeBase = JSON.parse(storedKB);
      } else {
        this.knowledgeBase = [...KNOWLEDGE_BASE_DATA];
        this.saveKB();
      }
    } catch {
      this.knowledgeBase = [...KNOWLEDGE_BASE_DATA];
    }
  }

  private saveTickets() {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(this.tickets));
    } catch (e) {
      console.warn('Could not save tickets to localStorage', e);
    }
  }

  private saveActivities() {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(this.activities));
    } catch (e) {
      console.warn('Could not save activities to localStorage', e);
    }
  }

  private saveSubmissions() {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(this.submissions));
    } catch (e) {
      console.warn('Could not save submissions to localStorage', e);
    }
  }

  private saveKB() {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(this.knowledgeBase));
    } catch (e) {
      console.warn('Could not save KB to localStorage', e);
    }
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error in listener', e);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- TICKETS API ---
  public getTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public takeTicket(ticketId: string, currentUser: Collaborator): SupportTicket {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Chamado ${ticketId} não encontrado.`);

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('pt-BR');

    ticket.status = 'Em atendimento';
    ticket.assignedTo = currentUser.name;
    ticket.assignedAvatar = currentUser.avatar;

    const newHistoryItem = {
      timestamp: `${dateStr} ${nowStr}`,
      action: 'Chamado assumido',
      user: currentUser.name,
      userSector: currentUser.sector,
      details: `Atribuído diretamente a ${currentUser.name} (${currentUser.sector}). Status alterado para Em atendimento.`
    };

    ticket.history = [newHistoryItem, ...(ticket.history || [])];

    this.saveTickets();
    this.notify();
    return ticket;
  }

  public transferTicket(params: {
    ticketId: string;
    targetSector: Sector;
    targetCollaboratorName?: string;
    observation?: string;
    currentUser: Collaborator;
  }): SupportTicket {
    const ticket = this.tickets.find(t => t.id === params.ticketId);
    if (!ticket) throw new Error(`Chamado ${params.ticketId} não encontrado.`);

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const oldSector = ticket.sector;
    const oldAssignee = ticket.assignedTo || 'Fila Geral';

    ticket.sector = params.targetSector;
    ticket.assignedTo = params.targetCollaboratorName ? params.targetCollaboratorName : undefined;
    ticket.assignedAvatar = undefined;
    if (ticket.status === 'Resolvido') {
      ticket.status = 'Em atendimento';
    }

    const destinationLabel = params.targetCollaboratorName
      ? `${params.targetCollaboratorName} (Grupo: ${params.targetSector})`
      : `Fila Geral do Grupo ${params.targetSector}`;

    const newHistoryItem = {
      timestamp: `${dateStr} ${nowStr}`,
      action: 'Transferência de chamado',
      user: params.currentUser.name,
      userSector: params.currentUser.sector,
      details: `Transferido de [${oldSector} / ${oldAssignee}] para [${destinationLabel}]. Motivo: ${params.observation || 'Encaminhamento técnico entre setores'}.`
    };

    ticket.history = [newHistoryItem, ...(ticket.history || [])];

    this.saveTickets();
    this.notify();
    return ticket;
  }

  /**
   * Finalize Ticket using Knowledge Base (Fases 5 e 6):
   * Automatically creates:
   * 1. Ticket status = 'Resolvido' with serviceType, resolutionSummary, resolvedBy, resolvedSector, resolvedAt.
   * 2. Activity in Smart Spreadsheet (Base de Atividades) with collaborator and sector.
   * 3. Form Submission in FormsView ("Registro de atividade") with all details.
   * 4. Updates Knowledge Base usage count or adds new article if requested.
   */
  public finalizeTicket(params: {
    ticketId: string;
    currentUser: Collaborator;
    serviceType: string;
    resolutionSummary: string;
    timeSpent: string;
    kbArticleId?: string;
    observation?: string;
    saveToKb?: boolean;
    newKbTitle?: string;
  }): {
    ticket: SupportTicket;
    activity: ActivityRecord;
    submission: FormSubmissionRecord;
  } {
    const ticket = this.tickets.find(t => t.id === params.ticketId);
    if (!ticket) throw new Error(`Chamado ${params.ticketId} não encontrado.`);

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const isoDate = now.toISOString().slice(0, 10);

    // 1. Update Ticket
    ticket.status = 'Resolvido';
    ticket.resolvedAt = `${dateStr} ${timeStr}`;
    ticket.resolvedBy = params.currentUser.name;
    ticket.resolvedSector = params.currentUser.sector;
    ticket.serviceType = params.serviceType;
    ticket.resolutionSummary = params.resolutionSummary;
    ticket.resolutionTimeSpent = params.timeSpent || '00h 45m';
    ticket.knowledgeBaseId = params.kbArticleId;

    const historyItem = {
      timestamp: `${dateStr} ${timeStr}`,
      action: 'Chamado finalizado',
      user: params.currentUser.name,
      userSector: params.currentUser.sector,
      details: `Encerrado com o tipo de serviço "${params.serviceType}". Resumo da solução: ${params.resolutionSummary}. Tempo gasto: ${params.timeSpent || '00h 45m'}. Vinculado ao Registro de Atividades.`
    };
    ticket.history = [historyItem, ...(ticket.history || [])];

    // 2. Increment KB article usage or create new
    if (params.kbArticleId) {
      const kbArticle = this.knowledgeBase.find(k => k.id === params.kbArticleId);
      if (kbArticle) {
        kbArticle.usefulCount = (kbArticle.usefulCount || 0) + 1;
        kbArticle.lastUpdated = dateStr;
      }
    } else if (params.saveToKb && params.newKbTitle) {
      const newArticle: KnowledgeArticle = {
        id: `KB-AUTO-${Date.now().toString().slice(-4)}`,
        code: `RESOLV-${params.currentUser.sector.toUpperCase().slice(0, 3)}-${String(this.knowledgeBase.length + 1).padStart(2, '0')}`,
        title: params.newKbTitle,
        sector: params.currentUser.sector,
        serviceType: params.serviceType,
        category: 'Aplicações & APIs',
        summarySolution: params.resolutionSummary,
        detailedProcedure: [
          `Identificado chamado técnico para cliente ${ticket.client}: ${ticket.subject}.`,
          `Execução do procedimento técnico: ${params.resolutionSummary}.`,
          `Validação funcional com tempo de resolução de ${params.timeSpent || '00h 45m'}.`
        ],
        estimatedResolutionMinutes: 45,
        tags: [params.serviceType.toLowerCase(), ticket.client.toLowerCase(), 'resolvido'],
        usefulCount: 1,
        lastUpdated: dateStr,
        author: params.currentUser.name
      };
      this.knowledgeBase.unshift(newArticle);
      ticket.knowledgeBaseId = newArticle.id;
    }

    // 3. Create Activity for Smart Spreadsheet (Base de Atividades)
    const cleanTicketNum = ticket.id.replace(/[^0-9]/g, '') || String(Date.now()).slice(-4);
    const newActivity: ActivityRecord = {
      id: `act-tk-${cleanTicketNum}`,
      date: dateStr,
      time: timeStr,
      collaborator: params.currentUser.name,
      sector: params.currentUser.sector,
      activity: `[Chamado ${ticket.id}] ${ticket.subject} — ${params.serviceType}`,
      priority: ticket.priority,
      status: 'Concluído',
      timeSpent: params.timeSpent || '00h 45m',
      observation: `Solução: ${params.resolutionSummary}. Cliente: ${ticket.client}. Finalizado via Help Desk (Fases 5 e 6).`,
      attachment: `laudo-resolucao-${cleanTicketNum}.pdf`
    };

    // Insert at beginning of activities
    this.activities = [newActivity, ...this.activities];

    // 4. Create Form Submission for FormsView ("Registro de atividade" - form-1)
    const newSubmission: FormSubmissionRecord = {
      id: `REG-TK-${cleanTicketNum}`,
      formId: 'form-1',
      formTitle: 'Registro de atividade',
      submittedAt: `${dateStr} ${timeStr}`,
      submittedBy: `${params.currentUser.name} (${params.currentUser.sector})`,
      status: 'Aprovado',
      values: {
        f_colab: `${params.currentUser.name} (${params.currentUser.sector})`,
        f_setor: params.currentUser.sector,
        f_data: isoDate,
        f_titulo: `[Chamado ${ticket.id}] ${ticket.subject} — ${params.serviceType}`,
        f_desc: `Solução: ${params.resolutionSummary}. Atendimento concluído com sucesso para o cliente ${ticket.client}.`,
        f_prioridade: ticket.priority,
        f_tempo: params.timeSpent || '00h 45m',
        f_obs: `Atendimento técnico finalizado no Help Desk. Base de Conhecimento vinculada: ${params.kbArticleId || 'Registro Direto'}.`
      }
    };

    this.submissions = [newSubmission, ...this.submissions];

    // Save everything
    this.saveTickets();
    this.saveActivities();
    this.saveSubmissions();
    this.saveKB();

    this.notify();

    return {
      ticket,
      activity: newActivity,
      submission: newSubmission
    };
  }

  // --- ACTIVITIES API ---
  public getActivities(): ActivityRecord[] {
    return [...this.activities];
  }

  public addActivity(activity: ActivityRecord) {
    this.activities = [activity, ...this.activities];
    this.saveActivities();
    this.notify();
  }

  // --- SUBMISSIONS API ---
  public getSubmissions(): FormSubmissionRecord[] {
    return [...this.submissions];
  }

  public addSubmission(submission: FormSubmissionRecord) {
    this.submissions = [submission, ...this.submissions];
    this.saveSubmissions();
    this.notify();
  }

  // --- KNOWLEDGE BASE API ---
  public getKnowledgeBase(): KnowledgeArticle[] {
    return [...this.knowledgeBase];
  }

  public addKnowledgeArticle(article: KnowledgeArticle) {
    this.knowledgeBase = [article, ...this.knowledgeBase];
    this.saveKB();
    this.notify();
  }

  // Reset to initial mock data if needed
  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.KNOWLEDGE_BASE);
    this.initData();
    this.notify();
  }
}

export const activitySyncService = new ActivitySyncService();
