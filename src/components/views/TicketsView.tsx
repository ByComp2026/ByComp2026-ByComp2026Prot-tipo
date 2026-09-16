import React, { useState } from 'react';
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
  Send
} from 'lucide-react';
import { TICKETS_DATA, SECTORS } from '../../data/mockData';
import { SupportTicket, Sector } from '../../types';

export const TicketsView: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(TICKETS_DATA);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('TODOS');
  const [priorityFilter, setPriorityFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transfer modal
  const [transferTicket, setTransferTicket] = useState<SupportTicket | null>(null);
  const [targetSector, setTargetSector] = useState<Sector>('Suporte N3');

  const filtered = tickets.filter(t => {
    const matchSearch = 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchSec = sectorFilter === 'TODOS' || t.sector === sectorFilter;
    const matchPrio = priorityFilter === 'TODOS' || t.priority === priorityFilter;
    const matchStat = statusFilter === 'TODOS' || t.status === statusFilter;
    return matchSearch && matchSec && matchPrio && matchStat;
  });

  const handleTakeTicket = (ticket: SupportTicket) => {
    setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: 'Em atendimento' } : t));
    setToastMessage(`✓ Você assumiu o chamado ${ticket.id} (${ticket.subject})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveTicket = (ticket: SupportTicket) => {
    setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: 'Resolvido' } : t));
    setToastMessage(`✓ Chamado ${ticket.id} finalizado e registrado na base de conhecimento.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTicket) return;
    setTickets(tickets.map(t => t.id === transferTicket.id ? { ...t, sector: targetSector } : t));
    setToastMessage(`✓ Chamado ${transferTicket.id} transferido com sucesso para ${targetSector}.`);
    setTransferTicket(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Fila de Chamados — Help Desk & TI
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestão operacional de incidentes técnicos, requisições de serviço e SLAs
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-xl">
          SLA Global: 98.2% dentro da meta
        </span>
      </div>

      {/* 4 Cards Requested by User:
          - Chamados abertos: 32
          - Em atendimento: 18
          - Aguardando cliente: 9
          - Fechados hoje: 14 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Chamados abertos</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-rose-400">32</span>
            <span className="text-[10px] text-rose-400 font-mono">Fila total</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Em atendimento</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-cyan-400">18</span>
            <span className="text-[10px] text-cyan-400 font-mono">N1, N2 e N3</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Aguardando cliente</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-amber-400">9</span>
            <span className="text-[10px] text-amber-400 font-mono">Feedback pendente</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Fechados hoje</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">14</span>
            <span className="text-[10px] text-emerald-400 font-mono">100% no SLA</span>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por assunto, ID ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="TODOS">Setor: Todos</option>
            {SECTORS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="TODOS">Prioridade: Todas</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="TODOS">Status: Todos</option>
            <option value="Aberto">Aberto</option>
            <option value="Em atendimento">Em atendimento</option>
            <option value="Aguardando">Aguardando</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>
      </div>

      {/* Tickets Table: ID, Cliente, Assunto, Setor responsável, Prioridade, Status, Tempo em aberto, Ações */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-3.5">ID</th>
                <th className="py-3 px-3.5">Cliente</th>
                <th className="py-3 px-3.5 min-w-[200px]">Assunto</th>
                <th className="py-3 px-3.5">Setor responsável</th>
                <th className="py-3 px-3.5">Prioridade</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Tempo em aberto</th>
                <th className="py-3 px-3.5 text-right min-w-[200px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3.5 text-cyan-400 font-bold">{t.id}</td>
                  <td className="py-3 px-3.5 font-bold text-white font-sans">{t.client}</td>
                  <td className="py-3 px-3.5 text-slate-200 font-sans font-medium">{t.subject}</td>
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {t.sector}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      t.priority === 'Crítica'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : t.priority === 'Alta'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      t.status === 'Resolvido'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : t.status === 'Em atendimento'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : t.status === 'Aguardando'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-semibold">{t.openTime}</td>

                  {/* Actions: Assumir chamado, Transferir setor, Finalizar */}
                  <td className="py-3 px-3.5 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status !== 'Resolvido' && (
                        <button
                          onClick={() => handleTakeTicket(t)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Assumir chamado"
                        >
                          Assumir
                        </button>
                      )}

                      <button
                        onClick={() => setTransferTicket(t)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Transferir setor"
                      >
                        Transferir
                      </button>

                      {t.status !== 'Resolvido' && (
                        <button
                          onClick={() => handleResolveTicket(t)}
                          className="px-2 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Finalizar chamado"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                Transferir Chamado {transferTicket.id}
              </h3>
              <button
                onClick={() => setTransferTicket(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Assunto:</span>
                <span className="text-xs font-bold text-white block">{transferTicket.subject}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Novo Setor Responsável
                </label>
                <select
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value as Sector)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {SECTORS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferTicket(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
                >
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
