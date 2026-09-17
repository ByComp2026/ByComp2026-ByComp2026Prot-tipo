import React, { useState, useEffect, useMemo } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  BookOpen,
  FileSpreadsheet,
  Layers,
  User,
  ExternalLink,
  Check,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { SupportTicket, Sector, Collaborator, ViewScreen } from '../../types';
import { SECTORS, ALL_COLLABORATORS, CURRENT_USER } from '../../data/mockData';
import { activitySyncService } from '../../services/activitySyncService';
import { TicketTransferModal } from './helpdesk/TicketTransferModal';
import { TicketFinalizeModal } from './helpdesk/TicketFinalizeModal';
import { KnowledgeBaseExplorer } from './helpdesk/KnowledgeBaseExplorer';
import { TicketDetailsModal } from './helpdesk/TicketDetailsModal';
import { LinkedActivitiesTab } from './helpdesk/LinkedActivitiesTab';

interface TicketsViewProps {
  currentUser?: Collaborator;
  onNavigate?: (screen: ViewScreen) => void;
  onSwitchUser?: (user: Collaborator) => void;
}

// Normalizer to guarantee consistent sector matching across variations
export const normalizeSector = (sector: string = ''): string => {
  const s = sector.trim().toLowerCase();
  if (s === 'n1' || s === 'suporte n1') return 'N1';
  if (s === 'n2' || s === 'suporte n2') return 'N2';
  if (s === 'n3' || s === 'suporte n3') return 'N3';
  if (s.includes('front')) return 'Front-End';
  if (s.includes('back')) return 'Back-End';
  if (s.includes('dba') || s.includes('dado')) return 'DBA';
  if (s.includes('cyber') || s.includes('seguran')) return 'Cyber Security';
  if (s.includes('admin')) return 'Administrativo';
  if (s.includes('rh')) return 'RH';
  if (s.includes('finan')) return 'Financeiro';
  if (s.includes('gest')) return 'Gestão';
  return sector;
};

export const TicketsView: React.FC<TicketsViewProps> = ({
  currentUser = CURRENT_USER,
  onNavigate,
  onSwitchUser
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge_base' | 'linked_activities'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>(() => activitySyncService.getTickets());
  const [search, setSearch] = useState('');
  const [selectedQueueSector, setSelectedQueueSector] = useState<string>('TODOS');
  const [priorityFilter, setPriorityFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [transferTicket, setTransferTicket] = useState<SupportTicket | null>(null);
  const [finalizeTicket, setFinalizeTicket] = useState<SupportTicket | null>(null);
  const [detailsTicket, setDetailsTicket] = useState<SupportTicket | null>(null);

  // Subscribe to central service
  useEffect(() => {
    return activitySyncService.subscribe(() => {
      setTickets(activitySyncService.getTickets());
    });
  }, []);

  // Access control determination:
  // Gestão e Administrativo (and Super Admin / RH) have access to all queues.
  // Standard users (e.g. N1, N2, N3, DBA, etc.) ONLY see their sector queue!
  const isManagementOrAdmin = useMemo(() => {
    const role = currentUser.userRole;
    const sector = currentUser.sector;
    return (
      role === 'SUPER_ADMIN' ||
      role === 'ADMINISTRATIVO' ||
      role === 'GESTOR' ||
      sector === 'Gestão' ||
      sector === 'Administrativo' ||
      sector === 'RH'
    );
  }, [currentUser]);

  const userNormalizedSector = useMemo(() => {
    return normalizeSector(currentUser.sector);
  }, [currentUser.sector]);

  // If user is not management/admin, restrict queue to their sector
  useEffect(() => {
    if (!isManagementOrAdmin) {
      setSelectedQueueSector(userNormalizedSector);
    }
  }, [isManagementOrAdmin, userNormalizedSector]);

  // Filtered tickets based on access control and filters
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const ticketNormSector = normalizeSector(t.sector);

      // RBAC Sector Gate:
      // If NOT management/admin: ticket MUST match user's sector!
      if (!isManagementOrAdmin) {
        if (ticketNormSector !== userNormalizedSector) {
          return false;
        }
      } else {
        // Management/Admin can filter by specific sector or view all ('TODOS')
        if (selectedQueueSector !== 'TODOS' && ticketNormSector !== normalizeSector(selectedQueueSector)) {
          return false;
        }
      }

      // Search filter
      const matchSearch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.client.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(search.toLowerCase())) ||
        (t.serviceType && t.serviceType.toLowerCase().includes(search.toLowerCase()));

      const matchPrio = priorityFilter === 'TODOS' || t.priority === priorityFilter;
      const matchStat = statusFilter === 'TODOS' || t.status === statusFilter;

      return matchSearch && matchPrio && matchStat;
    });
  }, [tickets, isManagementOrAdmin, userNormalizedSector, selectedQueueSector, search, priorityFilter, statusFilter]);

  // Queue counts for quick pills
  const queueCounts = useMemo(() => {
    const counts: Record<string, number> = {
      TODOS: tickets.length,
      N1: 0,
      N2: 0,
      N3: 0,
      DBA: 0,
      'Cyber Security': 0,
      'Back-End': 0,
      'Front-End': 0,
      Administrativo: 0
    };

    tickets.forEach(t => {
      const sec = normalizeSector(t.sector);
      if (counts[sec] !== undefined) {
        counts[sec]++;
      }
    });

    return counts;
  }, [tickets]);

  // Handlers
  const handleTakeTicket = (ticket: SupportTicket) => {
    try {
      const updated = activitySyncService.takeTicket(ticket.id, currentUser);
      setToastMessage(`✓ Você assumiu o chamado ${ticket.id} (${ticket.subject}). Status: Em atendimento.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferSuccess = (updatedTicket: SupportTicket, msg: string) => {
    setTransferTicket(null);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFinalizeSuccess = ({ ticket, activityId }: { ticket: SupportTicket; activityId: string }) => {
    setFinalizeTicket(null);
    setToastMessage(`✓ Chamado ${ticket.id} finalizado com sucesso! Registro de atividade #${activityId} gerado e pronto para exportação em Excel.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold text-white">{toastMessage}</p>
        </div>
      )}

      {/* Top Header & Session Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Help Desk & Gestão de Chamados
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Fases 5 & 6
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Filas setoriais por nível de serviço, transferência de grupos, Base de Conhecimento e exportação para Excel
              </p>
            </div>
          </div>
        </div>

        {/* Current Operator & Role Badge */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center text-[11px] border border-cyan-800">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="text-[11px] font-bold text-white leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Setor: <strong className="text-cyan-400 font-mono">{currentUser.sector}</strong></span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{currentUser.userRole}</span>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for Presentation & Testing of Queues */}
          {onSwitchUser && (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-[11px]">
              <span className="text-slate-500 px-1 text-[10px] uppercase font-bold">Simular:</span>
              <button
                onClick={() => {
                  const n1User = ALL_COLLABORATORS.find(c => c.name.includes('Gabriel Ribeiro')) || ALL_COLLABORATORS[0];
                  onSwitchUser({ ...n1User, sector: 'N1' as Sector, userRole: 'OPERACIONAL' });
                }}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-colors cursor-pointer ${
                  !isManagementOrAdmin && userNormalizedSector === 'N1'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Simular Operador N1 (Vê somente N1)"
              >
                N1
              </button>
              <button
                onClick={() => {
                  const n2User = ALL_COLLABORATORS.find(c => c.name.includes('Victor Estevão')) || ALL_COLLABORATORS[1];
                  onSwitchUser({ ...n2User, sector: 'N2' as Sector, userRole: 'OPERACIONAL' });
                }}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-colors cursor-pointer ${
                  !isManagementOrAdmin && userNormalizedSector === 'N2'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Simular Operador N2 (Vê somente N2)"
              >
                N2
              </button>
              <button
                onClick={() => {
                  const gestaoUser = ALL_COLLABORATORS.find(c => c.name.includes('Helena Santos')) || ALL_COLLABORATORS[0];
                  onSwitchUser({ ...gestaoUser, sector: 'Gestão' as Sector, userRole: 'GESTOR' });
                }}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-colors cursor-pointer ${
                  isManagementOrAdmin
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Simular Gestão / Administrativo (Acesso a Todos)"
              >
                Gestão/Adm (Todos)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Fila de Chamados ({filteredTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge_base')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'knowledge_base'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Base de Conhecimento (Fase 6)</span>
        </button>

        <button
          onClick={() => setActiveTab('linked_activities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'linked_activities'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Atividades & Excel</span>
        </button>
      </div>

      {/* VIEW: TAB 1 - TICKETS QUEUE */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Access Control Information Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isManagementOrAdmin
              ? 'bg-slate-900/80 border-cyan-900/60 text-cyan-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {isManagementOrAdmin ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Building2 className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
              <div>
                {isManagementOrAdmin ? (
                  <>
                    <strong className="text-white">Acesso Global Concedido:</strong> Perfil de Gestão e Administrativo. Você possui visibilidade e gerenciamento sobre <strong>todas as filas e grupos de serviço</strong>.
                  </>
                ) : (
                  <>
                    <strong className="text-white">Fila Restrita ao Setor:</strong> Operador de <strong>{userNormalizedSector}</strong>. Apenas os chamados atribuídos ao seu grupo de serviço estão visíveis nesta visualização.
                  </>
                )}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap ml-4">
              {filteredTickets.length} chamados listados
            </div>
          </div>

          {/* Sector Queue Pills (for Management/Admin or informational for standard users) */}
          {isManagementOrAdmin ? (
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Filas Setoriais Disponíveis (Acesso Executivo Global):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedQueueSector('TODOS')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedQueueSector === 'TODOS'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>Todos os Setores (Global)</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                    {queueCounts.TODOS}
                  </span>
                </button>

                {['N1', 'N2', 'N3', 'DBA', 'Cyber Security', 'Back-End', 'Front-End', 'Administrativo'].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSelectedQueueSector(sec)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedQueueSector === sec
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{sec}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                      {queueCounts[sec] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fila Ativa: <strong>{userNormalizedSector}</strong></span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Regra de Isolamento Setorial Ativa
              </span>
            </div>
          )}

          {/* Search and Extra Filters */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar por ID, cliente, assunto, técnico ou tipo de serviço..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="TODOS">Status: Todos</option>
                <option value="Aberto">Aberto</option>
                <option value="Em atendimento">Em atendimento</option>
                <option value="Resolvido">Resolvido</option>
                <option value="Aguardando">Aguardando</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="TODOS">Prioridade: Todas</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          {/* Tickets Cards & Table */}
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Nenhum chamado encontrado para esta fila ou filtro.</p>
              <p className="text-xs text-slate-500">Tente ajustar o termo de busca ou alternar para outra fila de atendimento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 shadow-lg transition-all ${
                    ticket.status === 'Resolvido'
                      ? 'border-emerald-900/50 bg-emerald-950/10'
                      : ticket.priority === 'Crítica'
                        ? 'border-rose-900/60 bg-rose-950/10'
                        : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Main Ticket Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-cyan-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        <span className="text-slate-400 font-medium">{ticket.client}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          Setor: {ticket.sector}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          ticket.priority === 'Crítica'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : ticket.priority === 'Alta'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          ticket.status === 'Resolvido'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : ticket.status === 'Em atendimento'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug">
                        {ticket.subject}
                      </h3>

                      {/* Subtitle / Context */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>Aberto há {ticket.openTime}</span>
                        </span>
                        {ticket.assignedTo && (
                          <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                            <UserCheck className="w-3 h-3 text-cyan-400" />
                            <span>Responsável: {ticket.assignedTo}</span>
                          </span>
                        )}
                        {ticket.status === 'Resolvido' && ticket.resolvedBy && (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Resolvido por: {ticket.resolvedBy} ({ticket.resolvedSector})</span>
                          </span>
                        )}
                      </div>

                      {/* Resolution details snippet if resolved */}
                      {ticket.status === 'Resolvido' && ticket.resolutionSummary && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 mt-1">
                          <span className="font-bold text-emerald-400 block text-[11px]">
                            Solução ({ticket.serviceType || 'Serviço Padrão'}):
                          </span>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            {ticket.resolutionSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Operational Action Buttons: Assumir, Transferir, Finalizar */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      {/* View Details */}
                      <button
                        onClick={() => setDetailsTicket(ticket)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Detalhes
                      </button>

                      {/* 1. Botão "Assumir" */}
                      {ticket.status !== 'Resolvido' && (
                        <button
                          onClick={() => handleTakeTicket(ticket)}
                          disabled={ticket.assignedTo === currentUser.name}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            ticket.assignedTo === currentUser.name
                              ? 'bg-cyan-950/60 border border-cyan-800 text-cyan-400 cursor-default'
                              : 'bg-slate-800 hover:bg-cyan-950 hover:border-cyan-700 border border-slate-700 text-white'
                          }`}
                          title={ticket.assignedTo === currentUser.name ? 'Você já é o responsável por este chamado' : 'Atribuir este chamado para você'}
                        >
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{ticket.assignedTo === currentUser.name ? 'Assumido por Você' : 'Assumir'}</span>
                        </button>
                      )}

                      {/* 2. Botão "Transferir" */}
                      {ticket.status !== 'Resolvido' && (
                        <button
                          onClick={() => setTransferTicket(ticket)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Transferir chamado para outro grupo de serviço ou colaborador específico"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Transferir</span>
                        </button>
                      )}

                      {/* 3. Botão "Finalizar" */}
                      {ticket.status !== 'Resolvido' ? (
                        <button
                          onClick={() => setFinalizeTicket(ticket)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Finalizar chamado com Base de Conhecimento e vincular ao Registro de Atividades"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Finalizar</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluído</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: TAB 2 - KNOWLEDGE BASE (FASE 6) */}
      {activeTab === 'knowledge_base' && (
        <KnowledgeBaseExplorer currentUser={currentUser} />
      )}

      {/* VIEW: TAB 3 - LINKED ACTIVITIES & EXCEL EXPORT */}
      {activeTab === 'linked_activities' && (
        <LinkedActivitiesTab onNavigate={onNavigate} />
      )}

      {/* MODALS */}
      {transferTicket && (
        <TicketTransferModal
          ticket={transferTicket}
          currentUser={currentUser}
          onClose={() => setTransferTicket(null)}
          onSuccess={handleTransferSuccess}
        />
      )}

      {finalizeTicket && (
        <TicketFinalizeModal
          ticket={finalizeTicket}
          currentUser={currentUser}
          onClose={() => setFinalizeTicket(null)}
          onSuccess={handleFinalizeSuccess}
        />
      )}

      {detailsTicket && (
        <TicketDetailsModal
          ticket={detailsTicket}
          onClose={() => setDetailsTicket(null)}
          onTakeTicket={handleTakeTicket}
          onOpenTransfer={(t) => setTransferTicket(t)}
          onOpenFinalize={(t) => setFinalizeTicket(t)}
        />
      )}
    </div>
  );
};
