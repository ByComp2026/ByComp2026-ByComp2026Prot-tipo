import React, { useState } from 'react';
import {
  FolderEdit,
  Plus,
  CheckCircle2,
  FileText,
  Save,
  ArrowLeft,
  Search,
  Sparkles,
  ClipboardList,
  UserPlus,
  Inbox,
  Laptop
} from 'lucide-react';
import { FORMS_DATA } from '../../data/mockData';
import { FormTemplate } from '../../types';

export const FormsView: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(FORMS_DATA[0]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New form modal state
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormCategory, setNewFormCategory] = useState('Operacional');

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 4000);
  };

  const filteredForms = FORMS_DATA.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <FolderEdit className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Formulários</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Padronização de cadastros, requisições internas e registros operacionais
          </p>
        </div>

        <button
          onClick={() => setIsNewFormModalOpen(true)}
          id="btn-novo-formulario"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo formulário</span>
        </button>
      </div>

      {/* Main Grid: Left List of Forms, Right Active Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Registered Forms */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-400">
                Formulários Cadastrados ({FORMS_DATA.length})
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
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              {filteredForms.map((form) => {
                const isSelected = selectedForm?.id === form.id;
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
                      <span>Atualizado: {form.lastUpdated}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Form Filler */}
        <div className="lg:col-span-8">
          {selectedForm ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              {/* Form Title & Meta */}
              <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedForm.title}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedForm.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedForm.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-500">ID: {selectedForm.id}</span>
              </div>

              {/* Success Alert Banner */}
              {successMessage && (
                <div 
                  id="form-success-banner"
                  className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Registro salvo com sucesso.</p>
                    <p className="text-xs text-emerald-300/80">
                      Os dados foram indexados e distribuídos automaticamente para a Base de Atividades.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Elements */}
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

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 italic">
                    * Todos os campos com asterisco são validados pela governança corporativa.
                  </span>

                  <button
                    type="submit"
                    id="btn-salvar-registro"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar registro</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Nenhum formulário selecionado</p>
              <p className="text-xs text-slate-500 mt-1">Selecione um dos modelos à esquerda para preencher.</p>
            </div>
          )}
        </div>
      </div>

      {/* "+ Novo formulário" Simulated Modal */}
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
                className="text-slate-400 hover:text-white text-xs"
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
                <span className="font-semibold text-cyan-400 block">Gerador de Campos Dinâmicos</span>
                <p>O construtor permite adicionar campos de texto, data, anexo e aprovação multinível.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewFormModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsNewFormModalOpen(false);
                  setSuccessMessage(true);
                  setTimeout(() => setSuccessMessage(false), 3000);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30"
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
