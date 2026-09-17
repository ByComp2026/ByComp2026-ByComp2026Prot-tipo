import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  X,
  Users,
  User,
  Building2,
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';
import { SupportTicket, Sector, Collaborator } from '../../../types';
import { SECTORS, ALL_COLLABORATORS } from '../../../data/mockData';
import { activitySyncService } from '../../../services/activitySyncService';

interface TicketTransferModalProps {
  ticket: SupportTicket;
  currentUser: Collaborator;
  onClose: () => void;
  onSuccess: (updatedTicket: SupportTicket, message: string) => void;
}

export const TicketTransferModal: React.FC<TicketTransferModalProps> = ({
  ticket,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [targetSector, setTargetSector] = useState<Sector>(
    ticket.sector === 'N1' ? 'N2' : ticket.sector === 'N2' ? 'N3' : 'N1'
  );
  const [transferMode, setTransferMode] = useState<'group_only' | 'specific_collaborator'>('group_only');
  const [selectedCollaboratorName, setSelectedCollaboratorName] = useState<string>('');
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter collaborators that belong to the chosen targetSector
  const sectorCollaborators = useMemo(() => {
    const normalize = (sec: string) => {
      const s = (sec || '').toLowerCase();
      if (s.includes('n1')) return 'n1';
      if (s.includes('n2')) return 'n2';
      if (s.includes('n3')) return 'n3';
      if (s.includes('front')) return 'front-end';
      if (s.includes('back')) return 'back-end';
      if (s.includes('dba') || s.includes('dado')) return 'dba';
      if (s.includes('cyber') || s.includes('seguran')) return 'cyber security';
      if (s.includes('admin')) return 'administrativo';
      if (s.includes('rh')) return 'rh';
      if (s.includes('finan')) return 'financeiro';
      if (s.includes('gest')) return 'gestão';
      return s;
    };

    const targetNorm = normalize(targetSector);
    const list = ALL_COLLABORATORS.filter(c => normalize(c.sector) === targetNorm);

    // If no exact match found, return subset of collaborators
    return list.length > 0 ? list : ALL_COLLABORATORS.slice(0, 5);
  }, [targetSector]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = activitySyncService.transferTicket({
        ticketId: ticket.id,
        targetSector,
        targetCollaboratorName: transferMode === 'specific_collaborator' && selectedCollaboratorName ? selectedCollaboratorName : undefined,
        observation: observation.trim() || 'Encaminhamento técnico operacional entre setores',
        currentUser
      });

      const destText = transferMode === 'specific_collaborator' && selectedCollaboratorName
        ? `${selectedCollaboratorName} (${targetSector})`
        : `Fila Geral do Grupo ${targetSector}`;

      onSuccess(updated, `✓ Chamado ${ticket.id} transferido com sucesso para ${destText}.`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Transferir Chamado {ticket.id}
              </h3>
              <p className="text-[11px] text-slate-400">
                Encaminhamento para Grupo de Serviço ou Colaborador Específico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Ticket Details Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Cliente: <strong className="text-white">{ticket.client}</strong></span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
              Setor Atual: {ticket.sector}
            </span>
          </div>
          <p className="font-semibold text-white line-clamp-1">{ticket.subject}</p>
          {ticket.assignedTo && (
            <p className="text-[11px] text-cyan-400">
              Responsável atual: {ticket.assignedTo}
            </p>
          )}
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Sector / Service Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grupo de Serviço de Destino (Setor)</span>
            </label>
            <select
              value={targetSector}
              onChange={(e) => {
                setTargetSector(e.target.value as Sector);
                setSelectedCollaboratorName('');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {SECTORS.map(sec => (
                <option key={sec} value={sec}>
                  {sec} {sec === ticket.sector ? '(Setor Atual)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Tipo de Atribuição de Destino
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransferMode('group_only')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center gap-2 ${
                  transferMode === 'group_only'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold">Fila Geral do Grupo</div>
                  <div className="text-[10px] text-slate-400">Disponível para qualquer técnico</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode('specific_collaborator')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center gap-2 ${
                  transferMode === 'specific_collaborator'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold">Colaborador Específico</div>
                  <div className="text-[10px] text-slate-400">Direcionar para uma pessoa</div>
                </div>
              </button>
            </div>
          </div>

          {/* Specific Collaborator Dropdown if mode is specific */}
          {transferMode === 'specific_collaborator' && (
            <div className="animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Selecione o Colaborador do Grupo {targetSector}
              </label>
              <select
                value={selectedCollaboratorName}
                onChange={(e) => setSelectedCollaboratorName(e.target.value)}
                required={transferMode === 'specific_collaborator'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">Selecione um colaborador do setor...</option>
                {sectorCollaborators.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} — {c.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Observation / Transfer note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nota Técnica / Motivo da Transferência</span>
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Escalonamento para análise avançada de infraestrutura de rede, necessita de privilégios de firewall..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (transferMode === 'specific_collaborator' && !selectedCollaboratorName)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transferindo...' : 'Confirmar Transferência'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
