import React, { useState, useMemo } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';
import { SMART_SPREADSHEET_DATA, SECTORS } from '../../data/mockData';
import { ActivityRecord, Priority, Sector } from '../../types';

export const SmartSpreadsheetView: React.FC = () => {
  const [data, setData] = useState<ActivityRecord[]>(SMART_SPREADSHEET_DATA);
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

  const itemsPerPage = 7;

  // Collaborator unique list
  const collaboratorsList = useMemo(() => {
    return Array.from(new Set(SMART_SPREADSHEET_DATA.map(d => d.collaborator)));
  }, []);

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
    setTimeout(() => {
      setExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    }, 700);
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
              <h1 className="text-xl font-bold text-white tracking-tight">Base de Atividades</h1>
              <p className="text-xs text-slate-400">Planilha inteligente com filtros avançados, ordenação e auditoria</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Export Confirmation Toast Banner */}
      {exportNotice && (
        <div 
          id="export-toast-banner"
          className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 flex items-center justify-between animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">
              Arquivo <strong className="text-white font-mono">Base_de_Atividades_ByComp_16092026.xlsx</strong> gerado com sucesso com {filteredData.length} registros filtrados!
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300">Simulação de Download Concluída</span>
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
    </div>
  );
};
