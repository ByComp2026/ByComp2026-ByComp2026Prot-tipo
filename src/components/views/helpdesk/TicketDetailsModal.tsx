import React from 'react';
import {
  X,
  Clock,
  UserCheck,
  Building2,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  History,
  BookOpen
} from 'lucide-react';
import { SupportTicket } from '../../../types';

interface TicketDetailsModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onTakeTicket?: (ticket: SupportTicket) => void;
  onOpenTransfer?: (ticket: SupportTicket) => void;
  onOpenFinalize?: (ticket: SupportTicket) => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  onClose,
  onTakeTicket,
  onOpenTransfer,
  onOpenFinalize
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {ticket.id}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              ticket.status === 'Resolvido'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : ticket.status === 'Em atendimento'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {ticket.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title and Client */}
        <div>
          <h2 className="text-base font-bold text-white leading-snug">{ticket.subject}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>Cliente: <strong className="text-slate-200">{ticket.client}</strong></span>
            <span>•</span>
            <span>Setor Responsável: <strong className="text-cyan-400 font-mono">{ticket.sector}</strong></span>
            <span>•</span>
            <span>Prioridade: <strong className="text-amber-400">{ticket.priority}</strong></span>
          </div>
        </div>

        {/* Status info box */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Responsável Atual:</span>
            <span className="text-white font-bold">{ticket.assignedTo || 'Fila Geral do Setor'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Tempo em Aberto:</span>
            <span className="text-slate-300">{ticket.openTime}</span>
          </div>
        </div>

        {/* Resolution details if resolved */}
        {ticket.status === 'Resolvido' && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Chamado Finalizado com Sucesso</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-400">{ticket.resolvedAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tipo de Serviço:</span>
              <span className="text-white font-semibold">{ticket.serviceType || 'Atendimento Geral'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Resumo da Solução Realizada:</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-emerald-900/40">
                {ticket.resolutionSummary || 'Resolução técnica executada conforme procedimentos corporativos.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>Resolvido por: <strong className="text-emerald-300">{ticket.resolvedBy}</strong> ({ticket.resolvedSector})</span>
              <span>Tempo gasto: <strong>{ticket.resolutionTimeSpent || '00h 45m'}</strong></span>
            </div>
          </div>
        )}

        {/* History / Audit Trail Timeline */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trilha de Auditoria & Histórico de Movimentações</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(ticket.history || []).map((h, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-300">{h.action}</span>
                  <span className="text-slate-500 font-mono">{h.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{h.details}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Operador: {h.user} {h.userSector ? `(${h.userSector})` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Fechar
          </button>

          {ticket.status !== 'Resolvido' && onTakeTicket && (
            <button
              onClick={() => {
                onTakeTicket(ticket);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs font-semibold transition-colors"
            >
              Assumir
            </button>
          )}

          {ticket.status !== 'Resolvido' && onOpenTransfer && (
            <button
              onClick={() => {
                onClose();
                onOpenTransfer(ticket);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
            >
              Transferir
            </button>
          )}

          {ticket.status !== 'Resolvido' && onOpenFinalize && (
            <button
              onClick={() => {
                onClose();
                onOpenFinalize(ticket);
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Finalizar Chamado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
