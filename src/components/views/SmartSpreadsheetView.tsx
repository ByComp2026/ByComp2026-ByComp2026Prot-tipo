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
  Layers,
  User,
  SlidersHorizontal,
  FileCheck,
  Plus,
  Database,
  X
} from 'lucide-react';
import { SMART_SPREADSHEET_DATA, SECTORS, CURRENT_USER } from '../../data/mockData';
import { ActivityRecord, Priority, Sector, Collaborator } from '../../types';
import { exportActivitiesToExcel } from '../../utils/excelExport';
import { taskService } from '../../services/taskService';

interface SmartSpreadsheetViewProps {
  currentUser?: Collaborator;
}

export const SmartSpreadsheetView: React.FC<SmartSpreadsheetViewProps> = ({
  currentUser = CURRENT_USER
}) => {
  const [data, setData] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState<string>('TODOS');
  const [filterCollaborator, setFilterCollaborator] = useState<string>('TODOS');
  const [filterPeriod, setFilterPeriod] = useState<string>('TODOS');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterPriority, setFilterPriority] = useState<string>('TODOS');
  const [sortField, setSortField] = useState<keyof ActivityRecord>('time');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  // New activity modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCollaborator, setNewCollaborator] = useState(currentUser.name);
  const [newSector, setNewSector] = useState<Sector>((currentUser.sector as Sector) || 'Suporte N2');
  const [newPriority, setNewPriority] = useState<Priority>('Média');
  const [newTimeSpent, setNewTimeSpent] = useState('1h 30m');
  const [newObservation, setNewObservation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const itemsPerPage = 7;

  // Real-time subscription to Firebase Firestore activities
  useEffect(() => {
    const unsubscribe = taskService.subscribeActivities((activities) => {
      setData(activities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Collaborator unique list
  const collaboratorsList = useMemo(() => {
    const list = new Set(data.map(d => d.collaborator));
    list.add(currentUser.name);
    return Array.from(list);
  }, [data, currentUser]);

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
        timeSpent: newTimeSpent.trim() || '1h 00m',
        observation: newObservation.trim() || 'Atividade registrada via planilha inteligente',
        attachment: ''
      });

      setData(prev => [newAct, ...prev]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewObservation('');
      setFeedback('✓ Atividade gravada com sucesso no Firebase Firestore!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
    }
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = 
        item.activity.toLowerCase().includes(search.toLowerCase()) ||
        item.collaborator.toLowerCase().includes(search.toLowerCase()) ||
        item.observation.toLowerCase().includes(search.toLowerCase());

      const matchSector = filterSector === 'TODOS' || item.sector === filterSector;
      const matchCollaborator = filterCollaborator === 'TODOS' || item.collaborator === filterCollaborator;
      const matchStatus = filterStatus === 'TODOS' || item.status === filterStatus;
      const matchPriority = filterPriority === 'TODOS' || item.priority === filterPriority;

      let matchPeriod = true;
      if (filterPeriod === 'HOJE') matchPeriod = item.date === '16/09/2026';
      if (filterPeriod === 'ONTEM') matchPeriod = item.date === '15/09/2026';

      return matchSearch && matchSector && matchCollaborator && matchStatus && matchPriority && matchPeriod;
    }).sort((a, b) => {
      const valA = String(a[sortField]);
      const valB = String(b[sortField]);
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [data, search, filterSector, filterCollaborator, filterPeriod, filterStatus, filterPriority, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof ActivityRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      // Generates and triggers actual browser download of .xlsx
      exportActivitiesToExcel(
        filteredData,
        `Base_de_Atividades_ByComp_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      setExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 5000);
    } catch (err) {
      console.error('Erro ao gerar Excel:', err);
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterSector('TODOS');
    setFilterCollaborator('TODOS');
    setFilterPeriod('TODOS');
    setFilterStatus('TODOS');
    setFilterPriority('TODOS');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Base de Atividades</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Firebase Firestore 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">Planilha inteligente com filtros avançados, ordenação e auditoria sincronizada no Firestore</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            id="btn-apontar-atividade"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Apontar Atividade</span>
          </button>

          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Limpar Filtros
          </button>

          <button
            onClick={handleExport}
            id="btn-exportar-excel"
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            {exporting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Export Confirmation Toast Banner */}
      {exportNotice && (
        <div 
          id="export-toast-banner"
          className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 flex items-center justify-between animate-in fade-in duration-200 shadow-xl"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">
              Download do arquivo Excel <strong className="text-white font-mono">.xlsx</strong> iniciado com sucesso contendo os {filteredData.length} registros selecionados!
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60">
            Download Concluído
          </span>
        </div>
      )}

      {/* Filters Toolbar Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar atividade..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filtro: Setor */}
          <div>
            <select
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Setor: Todos</option>
              {SECTORS.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Colaborador */}
          <div>
            <select
              value={filterCollaborator}
              onChange={(e) => {
                setFilterCollaborator(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Colaborador: Todos</option>
              {collaboratorsList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Período */}
          <div>
            <select
              value={filterPeriod}
              onChange={(e) => {
                setFilterPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Período: Todos</option>
              <option value="HOJE">Hoje (16/09/2026)</option>
              <option value="ONTEM">Ontem (15/09/2026)</option>
            </select>
          </div>

          {/* Filtro: Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Status: Todos</option>
              <option value="Concluído">Concluído</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Pendente">Pendente</option>
              <option value="Em revisão">Em revisão</option>
            </select>
          </div>

          {/* Filtro: Prioridade */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Prioridade: Todas</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px] select-none">
                <th onClick={() => handleSort('date')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Data / Hora <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('collaborator')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Colaborador <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('sector')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Setor <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('activity')} className="py-3 px-3.5 cursor-pointer hover:text-white min-w-[220px]">
                  <span className="flex items-center gap-1">Atividade <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('priority')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Prioridade <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('status')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th onClick={() => handleSort('timeSpent')} className="py-3 px-3.5 cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Tempo <ArrowUpDown className="w-3 h-3 text-slate-500" /></span>
                </th>
                <th className="py-3 px-3.5 min-w-[200px]">Observação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                      <span className="text-white font-semibold">{row.date}</span>
                      <span className="text-slate-500 ml-1.5 text-[11px]">{row.time}</span>
                    </td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold whitespace-nowrap">
                      {row.collaborator}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60">
                        {row.sector}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-200 font-sans font-medium">
                      {row.activity}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.priority === 'Urgente'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : row.priority === 'Alta'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : row.priority === 'Média'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.status === 'Concluído'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 font-semibold whitespace-nowrap">
                      {row.timeSpent}
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 font-sans text-xs">
                      <span className="truncate block max-w-xs" title={row.observation}>
                        {row.observation}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 font-sans">
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Mostrando <strong>{paginatedData.length}</strong> de <strong>{filteredData.length}</strong> registros encontrados
          </span>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: + Apontar Atividade no Firebase */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Apontar Atividade no Firebase Firestore
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descrição da Atividade Executada
                </label>
                <input
                  type="text"
                  placeholder="Ex: Resolução de lentidão em cluster de banco e deploy de hotfix"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Colaborador
                  </label>
                  <input
                    type="text"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Setor
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as Sector)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tempo Gasto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 01h 30m"
                    value={newTimeSpent}
                    onChange={(e) => setNewTimeSpent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações Técnicas / Resolução
                </label>
                <textarea
                  placeholder="Detalhamento técnico da resolução aplicada..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
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
