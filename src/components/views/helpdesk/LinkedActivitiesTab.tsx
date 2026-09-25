import React, { useState, useMemo, useEffect } from 'react';
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
import { taskService } from '../../../services/taskService';
import { dbService, UserDbModel } from '../../../services/dbService';
import { exportActivitiesToExcel } from '../../../utils/excelExport';
import { SECTORS } from '../../../data/mockData';

interface LinkedActivitiesTabProps {
  onNavigate?: (screen: ViewScreen) => void;
}

// Normalize name by removing extra spaces, lowercase, and removing parenthesized annotations
const cleanNameForCompare = (name: string): string => {
  return (name || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9áéíóúãõâêîôûàèìòùç\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const LinkedActivitiesTab: React.FC<LinkedActivitiesTabProps> = ({ onNavigate }) => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [firebaseUsers, setFirebaseUsers] = useState<UserDbModel[]>([]);
  const [search, setSearch] = useState('');
  const [collaboratorFilter, setCollaboratorFilter] = useState('TODOS');
  const [sectorFilter, setSectorFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // 1. Subscribe to Firebase Firestore activities
  useEffect(() => {
    const unsubActivities = taskService.subscribeActivities((firestoreActivities) => {
      if (firestoreActivities && firestoreActivities.length > 0) {
        setActivities(firestoreActivities);
      } else {
        setActivities(activitySyncService.getActivities());
      }
    });

    const unsubSync = activitySyncService.subscribe(() => {
      // Re-check sync service if firestore is empty
      setActivities((prev) => (prev.length > 0 ? prev : activitySyncService.getActivities()));
    });

    return () => {
      unsubActivities();
      unsubSync();
    };
  }, []);

  // 2. Subscribe to Firebase Users
  useEffect(() => {
    const unsubUsers = dbService.subscribeUsers((users) => {
      setFirebaseUsers(users);
    });

    return () => unsubUsers();
  }, []);

  // List of collaborators strictly from Firebase
  const firebaseCollaborators = useMemo(() => {
    const names = firebaseUsers.map(u => u.name.trim()).filter(Boolean);
    return Array.from(new Set(names));
  }, [firebaseUsers]);

  const isFirebaseCollaborator = (colabName: string): boolean => {
    if (!colabName) return false;
    const cleanColab = colabName.trim().toLowerCase();
    const normColab = cleanNameForCompare(colabName);
    if (!normColab) return false;

    return firebaseCollaborators.some((fbName) => {
      const cleanFb = fbName.trim().toLowerCase();
      const normFb = cleanNameForCompare(fbName);
      if (cleanColab === cleanFb || normColab === normFb) return true;

      const colabTokens = normColab.split(' ').filter(Boolean);
      const fbTokens = normFb.split(' ').filter(Boolean);
      if (colabTokens.length === fbTokens.length && colabTokens.length > 0) {
        return colabTokens.every((t, i) => t === fbTokens[i]);
      }
      if (colabTokens.length === 1 && fbTokens.length === 1) {
        return colabTokens[0] === fbTokens[0];
      }
      return false;
    });
  };

  // Auto purge activities of people who aren't in Firebase
  useEffect(() => {
    if (firebaseCollaborators.length === 0 || activities.length === 0) return;
    const nonFirebase = activities.filter(a => !isFirebaseCollaborator(a.collaborator));
    if (nonFirebase.length > 0) {
      nonFirebase.forEach(a => {
        taskService.deleteActivity(a.id).catch(() => {});
      });
      setActivities(prev => prev.filter(a => isFirebaseCollaborator(a.collaborator)));
      activitySyncService.purgeNonFirebaseActivities(firebaseCollaborators);
    }
  }, [firebaseCollaborators, activities]);

  // Dropdown list strictly of Firebase users
  const collaborators = useMemo(() => {
    if (firebaseCollaborators.length > 0) {
      return firebaseCollaborators;
    }
    return Array.from(new Set(activities.map(a => a.collaborator))).filter(Boolean);
  }, [firebaseCollaborators, activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      // Must belong to Firebase user
      if (firebaseCollaborators.length > 0 && !isFirebaseCollaborator(a.collaborator)) {
        return false;
      }

      const matchSearch =
        a.activity.toLowerCase().includes(search.toLowerCase()) ||
        a.collaborator.toLowerCase().includes(search.toLowerCase()) ||
        a.observation.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());

      const matchColab =
        collaboratorFilter === 'TODOS' ||
        a.collaborator.toLowerCase() === collaboratorFilter.toLowerCase() ||
        cleanNameForCompare(a.collaborator) === cleanNameForCompare(collaboratorFilter);

      const matchSector = sectorFilter === 'TODOS' || a.sector === sectorFilter;
      const matchStatus = statusFilter === 'TODOS' || a.status === statusFilter;

      return matchSearch && matchColab && matchSector && matchStatus;
    });
  }, [activities, firebaseCollaborators, search, collaboratorFilter, sectorFilter, statusFilter]);

  const handleExportExcel = () => {
    exportActivitiesToExcel(filteredActivities, `Relatorio_Chamados_Atividades_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Vínculo com Registro de Atividades & Planilha Excel
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Sincronização Ativa
              </span>
            </div>
            <p className="text-xs text-[#37558d] font-medium mt-0.5">
              Todo chamado finalizado no Help Desk é registrado automaticamente com Colaborador e Setor para exportação em Excel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('planilhas')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Base de Atividades Geral</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="text-white">Exportar para Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2">
          <span className="flex items-center gap-1.5 text-slate-800 font-bold">
            <Filter className="w-3.5 h-3.5 text-[#37558d]" />
            <span>Filtros Específicos para a Planilha Excel</span>
          </span>
          <span className="font-mono text-[#37558d]">{filteredActivities.length} registros filtrados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar atividade ou chamado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#37558d]"
            />
          </div>

          {/* Colaborador que Finalizou o Chamado */}
          <div>
            <select
              value={collaboratorFilter}
              onChange={(e) => setCollaboratorFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d] font-sans"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d] font-sans"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d]"
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
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Data / Hora</th>
                <th className="py-3.5 px-4 font-bold">Colaborador Finalizador</th>
                <th className="py-3.5 px-4 font-bold">Setor Responsável</th>
                <th className="py-3.5 px-4 font-bold">Atividade / Chamado</th>
                <th className="py-3.5 px-4 font-bold">Tempo Gasto</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Observação Técnica / Solução</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredActivities.map((act) => {
                const isTicketActivity = act.activity.includes('[Chamado #') || act.id.startsWith('act-tk-');
                return (
                  <tr
                    key={act.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isTicketActivity ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap text-slate-500">
                      <div>{act.date}</div>
                      <div className="text-[10px] text-slate-400">{act.time}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-[#37558d] border border-blue-200 text-[10px] flex items-center justify-center font-bold">
                          {act.collaborator.slice(0, 1)}
                        </div>
                        <span>{act.collaborator}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px] text-[#37558d] font-semibold">
                        {act.sector}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-semibold text-slate-800">
                      <div className="line-clamp-2">
                        {act.activity}
                      </div>
                      {isTicketActivity && (
                        <span className="inline-block mt-1 text-[9px] font-mono bg-blue-50 text-[#37558d] border border-blue-200 px-1.5 py-0.2 rounded font-bold">
                          Fase 5/6 Help Desk
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#37558d] font-bold whitespace-nowrap">
                      {act.timeSpent}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm text-slate-600 text-[11px] leading-relaxed">
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
