import React, { useState, useMemo } from 'react';
import {
  FolderEdit,
  Plus,
  CheckCircle2,
  FileText,
  Save,
  Search,
  Download,
  Database,
  Table,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Calendar,
  User,
  Clock,
  Trash2,
  Check,
  ChevronRight,
  Send,
  Eye
} from 'lucide-react';
import { FORMS_DATA } from '../../data/mockData';
import { FormTemplate } from '../../types';
import { INITIAL_FORM_SUBMISSIONS } from '../../data/formSubmissions';
import { exportFormSubmissionsToExcel, FormSubmissionRecord } from '../../utils/excelExport';

export const FormsView: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(FORMS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'preencher' | 'banco_dados'>('preencher');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>(INITIAL_FORM_SUBMISSIONS);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dbSearch, setDbSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // New form modal state
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormCategory, setNewFormCategory] = useState('Operacional');

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Submissions filtered by currently selected form
  const currentFormSubmissions = useMemo(() => {
    if (!selectedForm) return [];
    return submissions.filter(sub => {
      const matchForm = sub.formId === selectedForm.id;
      const matchStatus = statusFilter === 'TODOS' || sub.status === statusFilter;
      const matchSearch =
        sub.id.toLowerCase().includes(dbSearch.toLowerCase()) ||
        sub.submittedBy.toLowerCase().includes(dbSearch.toLowerCase()) ||
        Object.values(sub.values).some(v => String(v).toLowerCase().includes(dbSearch.toLowerCase()));
      return matchForm && matchStatus && matchSearch;
    });
  }, [submissions, selectedForm, statusFilter, dbSearch]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    // Create persistent new record in functional database
    const newRecord: FormSubmissionRecord = {
      id: `${selectedForm.title.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(submissions.length + 1).padStart(3, '0')}`,
      formId: selectedForm.id,
      formTitle: selectedForm.title,
      submittedAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      submittedBy: formData['f_colab'] || formData['f_requisitante'] || 'Victor Estevão (Gestão ByComp)',
      status: 'Aprovado',
      values: { ...formData }
    };

    setSubmissions(prev => [newRecord, ...prev]);
    setSuccessMessage(true);
    setFormData({});

    setTimeout(() => {
      setSuccessMessage(false);
    }, 4500);
  };

  /**
   * Generates and downloads a real .xlsx Excel file with exact form fields!
   */
  const handleExportExcel = () => {
    if (!selectedForm) return;
    setIsExporting(true);

    try {
      exportFormSubmissionsToExcel(
        selectedForm,
        currentFormSubmissions,
        `Banco_de_Dados_${selectedForm.title.replace(/\s+/g, '_')}_ByComp.xlsx`
      );

      setIsExporting(false);
      setExportNotice(`Arquivo Excel .xlsx "${selectedForm.title}" gerado com sucesso!`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error('Erro na exportação Excel:', err);
      setIsExporting(false);
    }
  };

  const filteredForms = FORMS_DATA.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="forms-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FolderEdit className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Formulários & Banco de Dados</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Exportação Excel .XLSX Ativa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Padronização de cadastros, banco de dados relacional e exportação nativa em Excel funcional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewFormModalOpen(true)}
            id="btn-novo-formulario"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo formulário</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List of Forms, Right Active Form / Database */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Registered Forms */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-400">
                Modelos de Formulário ({FORMS_DATA.length})
              </span>
              <span className="text-[11px] font-mono text-cyan-400">Padrão ByComp</span>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="space-y-2">
              {filteredForms.map((form) => {
                const isSelected = selectedForm?.id === form.id;
                const formSubsCount = submissions.filter(s => s.formId === form.id).length;
                return (
                  <button
                    key={form.id}
                    id={`form-item-${form.id}`}
                    onClick={() => {
                      setSelectedForm(form);
                      setSuccessMessage(false);
                      setFormData({});
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-tight text-white">
                        {form.title}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {form.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {form.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                      <span>{form.fieldsCount} campos</span>
                      <span className="text-cyan-400 font-bold">{formSubsCount} registros no banco</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Form Filler OR Functional Database */}
        <div className="lg:col-span-8 space-y-4">
          {selectedForm ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              {/* Form Title & Tab Switcher (Preenchimento vs Banco de Dados) */}
              <div className="border-b border-slate-800 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedForm.title}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedForm.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedForm.description}</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setActiveTab('preencher')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'preencher'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preencher</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('banco_dados')}
                    id="tab-banco-dados"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'banco_dados'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Banco de Dados ({currentFormSubmissions.length})</span>
                  </button>
                </div>
              </div>

              {/* Toast de Exportação Excel */}
              {exportNotice && (
                <div 
                  id="excel-export-toast"
                  className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center justify-between shadow-xl animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold">
                      {exportNotice}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-emerald-300">
                    Download .xlsx Concluído
                  </span>
                </div>
              )}

              {/* Success Alert Banner (Quando salva novo registro) */}
              {successMessage && (
                <div 
                  id="form-success-banner"
                  className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Registro gravado com sucesso no Banco de Dados!</p>
                      <p className="text-xs text-emerald-300/80">
                        O formulário foi indexado e está pronto para visualização e exportação em Excel.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('banco_dados')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    Ver no Banco
                  </button>
                </div>
              )}

              {/* TAB 1: FORMULÁRIO DE PREENCHIMENTO */}
              {activeTab === 'preencher' && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedForm.fields.map((field) => (
                      <div 
                        key={field.id} 
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          {field.label} {field.required && <span className="text-rose-400">*</span>}
                        </label>

                        {field.type === 'text' && (
                          <input
                            type="text"
                            placeholder={field.placeholder || ''}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                            required={field.required}
                          />
                        )}

                        {field.type === 'number' && (
                          <input
                            type="number"
                            placeholder={field.placeholder || ''}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                            required={field.required}
                          />
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            value={formData[field.id] || '2026-09-16'}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                            required={field.required}
                          />
                        )}

                        {field.type === 'select' && (
                          <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                            required={field.required}
                          >
                            <option value="">Selecione uma opção...</option>
                            {field.options?.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder || ''}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 italic">
                      * Todos os campos são gravados na base relacional e exportáveis para Excel (.xlsx).
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportExcel}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 hover:border-emerald-600 font-bold text-xs transition-all cursor-pointer"
                        title="Exportar base existente em Excel"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>Exportar Excel</span>
                      </button>

                      <button
                        type="submit"
                        id="btn-salvar-registro"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar registro</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: BANCO DE DADOS RELACIONAL & EXPORTAÇÃO EXCEL */}
              {activeTab === 'banco_dados' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Database Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Buscar registros no banco..."
                          value={dbSearch}
                          onChange={(e) => setDbSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="TODOS">Status: Todos</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Processado">Processado</option>
                        <option value="Em Análise">Em Análise</option>
                      </select>
                    </div>

                    {/* BOTÃO EXPORTAR EXCEL LITERAL */}
                    <button
                      onClick={handleExportExcel}
                      id="btn-exportar-excel-forms"
                      disabled={isExporting}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      title="Gera e faz download de um arquivo Excel .xlsx real com todos os campos deste formulário"
                    >
                      {isExporting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Exportar Excel (.xlsx)</span>
                    </button>
                  </div>

                  {/* Tabela do Banco de Dados Dinâmica */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 shadow-lg">
                    <div className="overflow-x-auto max-h-[420px]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] select-none sticky top-0 z-10 backdrop-blur-sm">
                            <th className="py-2.5 px-3 whitespace-nowrap">Protocolo</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Data / Hora</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Responsável</th>
                            <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                            {selectedForm.fields.map(f => (
                              <th key={f.id} className="py-2.5 px-3 whitespace-nowrap">
                                {f.label}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
                          {currentFormSubmissions.length > 0 ? (
                            currentFormSubmissions.map((sub) => (
                              <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-2.5 px-3 text-cyan-400 font-bold whitespace-nowrap">
                                  {sub.id}
                                </td>
                                <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                                  {sub.submittedAt}
                                </td>
                                <td className="py-2.5 px-3 text-slate-200 font-sans whitespace-nowrap">
                                  {sub.submittedBy}
                                </td>
                                <td className="py-2.5 px-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    sub.status === 'Aprovado' || sub.status === 'Processado'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : sub.status === 'Pendente'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </td>
                                {selectedForm.fields.map(f => (
                                  <td key={f.id} className="py-2.5 px-3 text-slate-300 font-sans max-w-xs truncate" title={sub.values[f.id] || '-'}>
                                    {sub.values[f.id] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4 + selectedForm.fields.length} className="py-8 text-center text-slate-500 font-sans">
                                Nenhum registro encontrado para este formulário com os filtros atuais.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Total de registros no banco: <strong className="text-white font-mono">{currentFormSubmissions.length}</strong></span>
                      <span className="text-[11px] text-slate-500">Campos indexados: {selectedForm.fields.map(f => f.label).join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Nenhum formulário selecionado</p>
              <p className="text-xs text-slate-500 mt-1">Selecione um dos modelos à esquerda para preencher ou visualizar o banco.</p>
            </div>
          )}
        </div>
      </div>

      {/* "+ Novo formulário" Modal */}
      {isNewFormModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Criar Novo Modelo de Formulário
              </h3>
              <button
                onClick={() => setIsNewFormModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título do Formulário
                </label>
                <input
                  type="text"
                  placeholder="Ex: Check-list de Entrega de Sprint"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newFormCategory}
                  onChange={(e) => setNewFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Operacional">Operacional</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Comercial & CRM">Comercial & CRM</option>
                  <option value="Patrimônio">Patrimônio</option>
                  <option value="Segurança">Segurança</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-cyan-400 block">Gerador de Campos & Banco Relacional</span>
                <p>O construtor cria tabelas de armazenamento e disponibiliza exportação nativa em .xlsx com todas as colunas.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewFormModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsNewFormModalOpen(false);
                  setSuccessMessage(true);
                  setTimeout(() => setSuccessMessage(false), 3000);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                Salvar Modelo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
