import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  User,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ActivityRecord, Sector, ViewScreen } from '../../../types';
import { activitySyncService } from '../../../services/activitySyncService';
import { exportActivitiesToExcel } from '../../../utils/excelExport';
import { SECTORS } from '../../../data/mockData';

interface LinkedActivitiesTabProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const LinkedActivitiesTab: React.FC<LinkedActivitiesTabProps> = ({ onNavigate }) => {
  const [activities, setActivities] = useState<ActivityRecord[]>(() => activitySyncService.getActivities());
  const [search, setSearch] = useState('');
  const [collaboratorFilter, setCollaboratorFilter] = useState('TODOS');
  const [sectorFilter, setSectorFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Listen to sync updates
  React.useEffect(() => {
    return activitySyncService.subscribe(() => {
      setActivities(activitySyncService.getActivities());
    });
  }, []);

  // Unique collaborators who have logged or finalized activities
  const collaborators = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.collaborator))).filter(Boolean);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const matchSearch =
        a.activity.toLowerCase().includes(search.toLowerCase()) ||
        a.collaborator.toLowerCase().includes(search.toLowerCase()) ||
        a.observation.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());

      const matchColab = collaboratorFilter === 'TODOS' || a.collaborator === collaboratorFilter;
      const matchSector = sectorFilter === 'TODOS' || a.sector === sectorFilter;
      const matchStatus = statusFilter === 'TODOS' || a.status === statusFilter;

      return matchSearch && matchColab && matchSector && matchStatus;
    });
  }, [activities, search, collaboratorFilter, sectorFilter, statusFilter]);

  const handleExportExcel = () => {
    exportActivitiesToExcel(
      filteredActivities,
      `relatorio_atividades_helpdesk_${collaboratorFilter !== 'TODOS' ? collaboratorFilter.replace(/\s+/g, '_') : 'geral'}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Vínculo com Registro de Atividades & Planilha Excel
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Sincronização Ativa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Todo chamado finalizado no Help Desk é registrado automaticamente com o Colaborador e Setor responsável para filtragem e exportação em Excel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('planilhas')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Base de Atividades Geral</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar para Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar: Colaborador que Finalizou & Setor Responsável */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5 text-white">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtros Específicos para a Planilha Excel</span>
          </span>
          <span>{filteredActivities.length} registros filtrados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar atividade ou chamado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Colaborador que Finalizou o Chamado */}
          <div>
            <select
              value={collaboratorFilter}
              onChange={(e) => setCollaboratorFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
            >
              <option value="TODOS">Colaborador: Todos</option>
              {collaborators.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Setor Responsável */}
          <div>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Setor Responsável: Todos</option>
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="TODOS">Status: Todos</option>
              <option value="Concluído">Concluído</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Colaborador Finalizador</th>
                <th className="py-3 px-4">Setor Responsável</th>
                <th className="py-3 px-4">Atividade / Chamado</th>
                <th className="py-3 px-4">Tempo Gasto</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Observação Técnica / Solução</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredActivities.map((act) => {
                const isTicketActivity = act.activity.includes('[Chamado #') || act.id.startsWith('act-tk-');
                return (
                  <tr
                    key={act.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isTicketActivity ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-slate-400">
                      <div>{act.date}</div>
                      <div className="text-[10px] text-slate-500">{act.time}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                          {act.collaborator.slice(0, 1)}
                        </div>
                        <span>{act.collaborator}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                        {act.sector}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs font-medium text-slate-200">
                      <div className="line-clamp-2">
                        {act.activity}
                      </div>
                      {isTicketActivity && (
                        <span className="inline-block mt-1 text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded">
                          Fase 5/6 Help Desk
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-400 whitespace-nowrap">
                      {act.timeSpent}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-sm text-slate-400 text-[11px]">
                      <div className="line-clamp-2">{act.observation}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
