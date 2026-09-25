import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  User,
  Plus,
  Database,
  X,
  Clock,
  Shield,
  LifeBuoy,
  FileCheck2,
  Sparkles,
  Trash2
} from 'lucide-react';
import { SECTORS, CURRENT_USER } from '../../data/mockData';
import { ActivityRecord, Priority, Sector, Collaborator } from '../../types';
import { exportActivitiesToExcel } from '../../utils/excelExport';
import { taskService } from '../../services/taskService';
import { dbService, UserDbModel } from '../../services/dbService';
import { activitySyncService } from '../../services/activitySyncService';

interface SmartSpreadsheetViewProps {
  currentUser?: Collaborator;
}

// Normalize name by removing extra spaces, lowercase, and removing parenthesized annotations (e.g. "(Master Admin)")
const cleanNameForCompare = (name: string): string => {
  return (name || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9áéíóúãõâêîôûàèìòùç\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Robust date parser for pt-BR (DD/MM/YYYY) and ISO (YYYY-MM-DD)
function parseRecordDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const ptMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ptMatch) {
    const [, day, month, year] = ptMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export const SmartSpreadsheetView: React.FC<SmartSpreadsheetViewProps> = ({
  currentUser = CURRENT_USER
}) => {
  const [data, setData] = useState<ActivityRecord[]>([]);
  const [firebaseUsers, setFirebaseUsers] = useState<UserDbModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState<string>('TODOS');
  const [filterCollaborator, setFilterCollaborator] = useState<string>('TODOS');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterPriority, setFilterPriority] = useState<string>('TODOS');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<keyof ActivityRecord>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // New activity modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCollaborator, setNewCollaborator] = useState(currentUser.name);
  const [newSector, setNewSector] = useState<Sector>((currentUser.sector as Sector) || 'N1');
  const [newPriority, setNewPriority] = useState<Priority>('Média');
  const [newTimeSpent, setNewTimeSpent] = useState('00h 45m');
  const [newObservation, setNewObservation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const itemsPerPage = 8;

  // 1. Subscribe to Firebase Firestore activities collection in real time
  useEffect(() => {
    const unsubscribe = taskService.subscribeActivities((activities) => {
      setData(activities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Subscribe exclusively to Firebase Firestore Users for the collaborator dropdown
  useEffect(() => {
    const unsubUsers = dbService.subscribeUsers((users) => {
      setFirebaseUsers(users);
      if (users.length > 0 && !newCollaborator) {
        setNewCollaborator(users[0].name);
      }
    });

    return () => unsubUsers();
  }, [newCollaborator]);

  // Unique list of collaborators STRICTLY from Firebase
  const firebaseCollaboratorsList = useMemo(() => {
    const names = firebaseUsers.map((u) => u.name.trim()).filter(Boolean);
    // If master admin isn't loaded yet, ensure current authenticated Firebase user is included
    if (names.length === 0 && currentUser?.name) {
      names.push(currentUser.name.trim());
    }
    return Array.from(new Set(names));
  }, [firebaseUsers, currentUser]);

  // Helper to determine if a collaborator belongs strictly to Firebase users
  const isFirebaseCollaborator = (colabName: string): boolean => {
    if (!colabName) return false;
    const cleanColab = colabName.trim().toLowerCase();
    const normColab = cleanNameForCompare(colabName);
    if (!normColab) return false;

    return firebaseCollaboratorsList.some((fbName) => {
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

  // Automatically purge any activities whose collaborator does not exist in Firebase
  useEffect(() => {
    if (firebaseCollaboratorsList.length === 0 || data.length === 0) return;

    const nonFirebaseRecords = data.filter((item) => !isFirebaseCollaborator(item.collaborator));
    if (nonFirebaseRecords.length > 0) {
      nonFirebaseRecords.forEach((item) => {
        taskService.deleteActivity(item.id).catch((err) => {
          console.warn('Erro ao remover atividade de colaborador fora do Firebase:', item.id, err);
        });
      });
      setData((prev) => prev.filter((item) => isFirebaseCollaborator(item.collaborator)));
      activitySyncService.purgeNonFirebaseActivities(firebaseCollaboratorsList);
    }
  }, [firebaseCollaboratorsList, data]);

  const handleDeleteActivity = async (id: string) => {
    try {
      await taskService.deleteActivity(id);
      setData((prev) => prev.filter((a) => a.id !== id));
      setFeedback('✓ Atividade removida da Base de Atividades.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao excluir atividade:', err);
    }
  };

  const handleCleanNonFirebase = async () => {
    const toRemove = data.filter((item) => !isFirebaseCollaborator(item.collaborator));
    if (toRemove.length === 0) {
      setFeedback('✓ Todas as pessoas na Base de Atividades já pertencem 100% ao Firebase!');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }
    for (const act of toRemove) {
      await taskService.deleteActivity(act.id);
    }
    setData((prev) => prev.filter((item) => isFirebaseCollaborator(item.collaborator)));
    activitySyncService.purgeNonFirebaseActivities(firebaseCollaboratorsList);
    setFeedback(`✓ ${toRemove.length} atividades de pessoas fora do Firebase foram removidas com sucesso.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const now = new Date();
      const newAct = await taskService.createActivity({
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        collaborator: newCollaborator || currentUser.name,
        sector: newSector,
        activity: newTitle.trim(),
        priority: newPriority,
        status: 'Concluído',
        timeSpent: newTimeSpent.trim() || '00h 45m',
        observation: newObservation.trim() || 'Apontamento técnico registrado na Base de Atividades',
        attachment: ''
      });

      setData((prev) => [newAct, ...prev]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewObservation('');
      setFeedback('✓ Atividade registrada com sucesso no Firebase Firestore!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
    }
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // 0. EXCLUSIVELY FIREBASE USERS: Drop all non-Firebase people
        if (firebaseCollaboratorsList.length > 0 && !isFirebaseCollaborator(item.collaborator)) {
          return false;
        }

        // 1. Text search
        const matchSearch =
          search === '' ||
          item.activity.toLowerCase().includes(search.toLowerCase()) ||
          item.collaborator.toLowerCase().includes(search.toLowerCase()) ||
          item.observation.toLowerCase().includes(search.toLowerCase()) ||
          item.sector.toLowerCase().includes(search.toLowerCase());

        // 2. Sector filter
        const matchSector = filterSector === 'TODOS' || item.sector === filterSector;

        // 3. Firebase Collaborator filter
        const matchCollaborator =
          filterCollaborator === 'TODOS' ||
          item.collaborator.toLowerCase() === filterCollaborator.toLowerCase();

        // 4. Status filter
        const matchStatus = filterStatus === 'TODOS' || item.status === filterStatus;

        // 5. Priority filter
        const matchPriority = filterPriority === 'TODOS' || item.priority === filterPriority;

        // 6. Date Range filter (startDate & endDate)
        let matchDateRange = true;
        if (startDate || endDate) {
          const recDate = parseRecordDate(item.date);
          if (recDate) {
            if (startDate) {
              const start = new Date(startDate + 'T00:00:00');
              if (recDate < start) matchDateRange = false;
            }
            if (endDate) {
              const end = new Date(endDate + 'T23:59:59');
              if (recDate > end) matchDateRange = false;
            }
          }
        }

        return (
          matchSearch &&
          matchSector &&
          matchCollaborator &&
          matchStatus &&
          matchPriority &&
          matchDateRange
        );
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const dateA = parseRecordDate(a.date)?.getTime() || 0;
          const dateB = parseRecordDate(b.date)?.getTime() || 0;
          return sortAsc ? dateA - dateB : dateB - dateA;
        }
        const valA = String(a[sortField] || '');
        const valB = String(b[sortField] || '');
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [
    data,
    search,
    filterSector,
    filterCollaborator,
    startDate,
    endDate,
    filterStatus,
    filterPriority,
    sortField,
    sortAsc
  ]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof ActivityRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  /**
   * User requirement:
   * "OBS: ao realizar o download do excel, o excel deverá puxar somente a data e o usuário que selecionarmos."
   */
  const handleExport = () => {
    setExporting(true);
    try {
      // Filter activities strictly by selected collaborator and date range
      const exportList = data.filter((item) => {
        // Enforce Firebase user existence
        if (firebaseCollaboratorsList.length > 0 && !isFirebaseCollaborator(item.collaborator)) {
          return false;
        }

        // Filter by collaborator if chosen
        if (
          filterCollaborator !== 'TODOS' &&
          item.collaborator.toLowerCase() !== filterCollaborator.toLowerCase()
        ) {
          return false;
        }

        // Filter by date range if chosen
        if (startDate || endDate) {
          const recDate = parseRecordDate(item.date);
          if (recDate) {
            if (startDate) {
              const start = new Date(startDate + 'T00:00:00');
              if (recDate < start) return false;
            }
            if (endDate) {
              const end = new Date(endDate + 'T23:59:59');
              if (recDate > end) return false;
            }
          }
        }

        // Filter by sector if chosen
        if (filterSector !== 'TODOS' && item.sector !== filterSector) {
          return false;
        }

        return true;
      });

      const userTag =
        filterCollaborator !== 'TODOS'
          ? filterCollaborator.replace(/[^a-zA-Z0-9]/g, '_')
          : 'Todos_Usuarios';

      const dateTag =
        startDate && endDate
          ? `${startDate}_a_${endDate}`
          : startDate
          ? `a_partir_de_${startDate}`
          : endDate
          ? `ate_${endDate}`
          : new Date().toISOString().slice(0, 10);

      const filename = `Base_Atividades_ByComp_${userTag}_${dateTag}.xlsx`;

      exportActivitiesToExcel(exportList, filename);

      const summaryText =
        filterCollaborator !== 'TODOS'
          ? `Exportando ${exportList.length} registro(s) de ${filterCollaborator}${
              startDate || endDate ? ` no período de ${startDate || 'início'} até ${endDate || 'hoje'}` : ''
            }`
          : `Exportando ${exportList.length} registro(s) selecionados no arquivo Excel (.xlsx)`;

      setExportNotice(summaryText);
      setExporting(false);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error('Erro ao gerar Excel:', err);
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterSector('TODOS');
    setFilterCollaborator('TODOS');
    setStartDate('');
    setEndDate('');
    setFilterStatus('TODOS');
    setFilterPriority('TODOS');
    setCurrentPage(1);
  };

  // Helper to check if a row represents a closed ticket from Help Desk
  const isTicketActivity = (row: ActivityRecord) => {
    return (
      row.activity.startsWith('[Chamado') ||
      row.observation?.includes('Help Desk') ||
      row.observation?.includes('Solução:')
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header - Style matching Colaboradores (White Div with Blue Text) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative overflow-hidden">
        {/* Subtle Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10 text-[#37558d]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#37558d] shadow-2xs">
                <FileSpreadsheet className="w-5 h-5 text-[#37558d]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-[#37558d] tracking-tight">
                    Base de Atividades & Chamados Finalizados
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#37558d] border border-blue-200 font-bold flex items-center gap-1">
                    <Database className="w-3 h-3 text-[#37558d]" />
                    Firebase Firestore 100%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Planilha integrada de esforço, horas e chamados solucionados no{' '}
                  <strong className="text-[#37558d]">Help Desk</strong> com exportação precisa em Excel.
                </p>
              </div>
            </div>

            {/* Quick Context Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 mt-3.5">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-[#37558d] px-3 py-1.5 rounded-xl">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#37558d]"
                />
                <span className="text-xs text-slate-600">
                  Operador: <strong className="text-[#37558d]">{currentUser?.name}</strong>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#37558d] border border-blue-200">
                  {currentUser?.userRole || 'COLABORADOR'}
                </span>
              </div>

              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-[#37558d] px-2.5 py-1.5 rounded-xl font-mono text-[11px]">
                <FileCheck2 className="w-3.5 h-3.5 text-[#37558d]" />
                <span>{filteredData.length} registros filtrados</span>
              </span>

              <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-[#37558d] px-2.5 py-1.5 rounded-xl font-mono text-[11px]">
                <User className="w-3.5 h-3.5 text-[#37558d]" />
                <span>{firebaseCollaboratorsList.length} usuários Firebase</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Limpar Filtros, Exportar Excel, Apontar Atividade */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={resetFilters}
              id="btn-limpar-filtros"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#37558d] hover:bg-[#37558d] hover:text-white border border-slate-200 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Restaurar todos os filtros para os valores padrão"
            >
              <span>Limpar Filtros</span>
            </button>

            <button
              onClick={handleCleanNonFirebase}
              id="btn-limpar-nao-firebase"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Remover permanentemente registros de pessoas que não estão no Firebase"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Remover Não-Firebase</span>
            </button>

            <button
              onClick={handleExport}
              id="btn-exportar-excel"
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Download do Excel puxando os dados de data e usuário selecionados"
            >
              {exporting ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Exportar Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              id="btn-apontar-atividade"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#37558d] hover:bg-[#2c4471] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Apontar Atividade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-[#37558d] text-xs flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#37558d] shrink-0" />
          <span className="font-semibold">{feedback}</span>
        </div>
      )}

      {/* Export Confirmation Toast Banner */}
      {exportNotice && (
        <div
          id="export-toast-banner"
          className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in duration-200 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">
              Download do Excel <strong className="font-mono">.xlsx</strong> concluído:{' '}
              {exportNotice}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 font-bold">
            Excel Baixado
          </span>
        </div>
      )}

      {/* Filters Toolbar Bar - White Div with Blue Labels & Text */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#37558d]" />
            <h2 className="text-xs font-bold text-[#37558d] tracking-wide uppercase">
              Filtros Avançados de Auditoria & Fechamento de Chamados
            </h2>
          </div>
          {(filterCollaborator !== 'TODOS' || startDate || endDate) && (
            <span className="text-[11px] text-[#37558d] bg-blue-50 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
              Exportação personalizada ativa
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1">
              Buscar Termo
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Chamado, tarefa..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
              />
            </div>
          </div>

          {/* Filtro: Colaborador - SOMENTE USUÁRIOS DO FIREBASE */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1">
              Colaborador (Firebase)
            </label>
            <select
              value={filterCollaborator}
              onChange={(e) => {
                setFilterCollaborator(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] font-semibold"
            >
              <option value="TODOS">Colaborador: Todos</option>
              {firebaseCollaboratorsList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro: Data de Início */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#37558d]" />
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] font-mono focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
            />
          </div>

          {/* Filtro: Data Final */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#37558d]" />
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] font-mono focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
            />
          </div>

          {/* Filtro: Setor */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1">
              Setor
            </label>
            <select
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
            >
              <option value="TODOS">Setor: Todos</option>
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro: Prioridade */}
          <div>
            <label className="block text-[11px] font-bold text-[#37558d] mb-1">
              Prioridade
            </label>
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#37558d] focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
            >
              <option value="TODOS">Prioridade: Todas</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>

        {/* Selected Criteria Summary Bar */}
        {(filterCollaborator !== 'TODOS' || startDate || endDate) && (
          <div className="bg-blue-50/70 border border-blue-200 px-3.5 py-2 rounded-xl text-xs text-[#37558d] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">Filtro de Exportação Ativo:</span>
              <span>
                Colaborador:{' '}
                <strong className="underline">{filterCollaborator}</strong>
              </span>
              <span>•</span>
              <span>
                Período:{' '}
                <strong>{startDate || 'Início'}</strong> até{' '}
                <strong>{endDate || 'Hoje'}</strong>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              O download do Excel puxará exclusivamente estes dados selecionados.
            </span>
          </div>
        )}
      </div>

      {/* Spreadsheet Table - White Card with Blue Text and Accents */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[#37558d] font-bold uppercase tracking-wider text-[11px] select-none">
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Data / Hora <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('collaborator')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Colaborador <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('sector')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Setor <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('activity')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors min-w-[240px]"
                >
                  <span className="flex items-center gap-1">
                    Atividade / Chamado Fechado{' '}
                    <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Prioridade <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Status <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('timeSpent')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Tempo <ArrowUpDown className="w-3 h-3 text-[#37558d]" />
                  </span>
                </th>
                <th className="py-3 px-3.5 min-w-[220px]">Observação / Solução</th>
                <th className="py-3 px-3.5 text-right w-12 text-[#37558d] font-bold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-sans text-[12px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const isTicket = isTicketActivity(row);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-colors text-slate-700"
                    >
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                        <span className="text-[#37558d] font-bold">{row.date}</span>
                        <span className="text-slate-400 ml-1.5">{row.time}</span>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#37558d] font-bold flex items-center justify-center text-[10px] border border-blue-200">
                            {row.collaborator.charAt(0)}
                          </div>
                          <span className="text-[#37558d] font-bold">{row.collaborator}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#37558d] text-[11px] border border-blue-200 font-semibold">
                          {row.sector}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-900 font-medium">
                        <div className="flex items-start gap-1.5">
                          {isTicket && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0 mt-0.5">
                              <LifeBuoy className="w-3 h-3 text-emerald-600" />
                              Chamado
                            </span>
                          )}
                          <span className="leading-snug">{row.activity}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.priority === 'Urgente' || row.priority === 'Crítica'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : row.priority === 'Alta'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : row.priority === 'Média'
                              ? 'bg-blue-50 text-[#37558d] border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.status === 'Concluído'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-[#37558d] border border-blue-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 font-mono font-semibold whitespace-nowrap text-[11px]">
                        {row.timeSpent}
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 text-xs">
                        <span className="truncate block max-w-xs" title={row.observation}>
                          {row.observation}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(row.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Excluir atividade da base"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-[#37558d]">
                        Nenhum registro encontrado
                      </p>
                      <p className="text-xs text-slate-400">
                        Não encontramos atividades ou chamados para os filtros selecionados.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#37558d] gap-2">
          <span>
            Mostrando <strong>{paginatedData.length}</strong> de{' '}
            <strong>{filteredData.length}</strong> registros encontrados
          </span>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#37558d] hover:bg-[#37558d] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#37558d] hover:bg-[#37558d] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: + Apontar Atividade no Firebase */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#37558d] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#37558d]" />
                Apontar Atividade no Firebase Firestore
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#37558d] mb-1">
                  Descrição da Atividade Executada
                </label>
                <input
                  type="text"
                  placeholder="Ex: Configuração de portas no switch core e validação de VLAN"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37558d] mb-1">
                    Colaborador (Firebase)
                  </label>
                  <select
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
                    required
                  >
                    {firebaseCollaboratorsList.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#37558d] mb-1">
                    Setor
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as Sector)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#37558d] mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#37558d] mb-1">
                    Tempo Gasto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 00h 45m"
                    value={newTimeSpent}
                    onChange={(e) => setNewTimeSpent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#37558d] mb-1">
                  Observações Técnicas / Resolução
                </label>
                <textarea
                  placeholder="Detalhamento do procedimento realizado..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#37558d] hover:bg-[#2c4471] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Gravar no Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
