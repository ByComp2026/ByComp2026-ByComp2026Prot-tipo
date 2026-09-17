import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Tag,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  User,
  Calendar,
  Layers,
  Sparkles,
  FileText,
  X
} from 'lucide-react';
import { KnowledgeArticle, Sector, Collaborator } from '../../../types';
import { activitySyncService } from '../../../services/activitySyncService';
import { SECTORS } from '../../../data/mockData';

interface KnowledgeBaseExplorerProps {
  currentUser: Collaborator;
  onUseArticleForTicket?: (article: KnowledgeArticle) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  currentUser,
  onUseArticleForTicket
}) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => activitySyncService.getKnowledgeBase());
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);

  // New Article Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState<Sector>(currentUser.sector || 'N1');
  const [newServiceType, setNewServiceType] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeArticle['category']>('Acessos & Identidade');
  const [newSummary, setNewSummary] = useState('');
  const [newProcedure, setNewProcedure] = useState('');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newTags, setNewTags] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchSearch =
        art.title.toLowerCase().includes(search.toLowerCase()) ||
        art.code.toLowerCase().includes(search.toLowerCase()) ||
        art.summarySolution.toLowerCase().includes(search.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        art.serviceType.toLowerCase().includes(search.toLowerCase());

      const matchSector = sectorFilter === 'TODOS' || art.sector === sectorFilter;
      const matchCategory = categoryFilter === 'TODOS' || art.category === categoryFilter;

      return matchSearch && matchSector && matchCategory;
    });
  }, [articles, search, sectorFilter, categoryFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(articles.map(a => a.category)));
  }, [articles]);

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newServiceType) return;

    const procedureSteps = newProcedure
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const article: KnowledgeArticle = {
      id: `KB-CUSTOM-${Date.now()}`,
      code: `${newSector.toUpperCase().slice(0, 3)}-PROC-${String(articles.length + 1).padStart(2, '0')}`,
      title: newTitle.trim(),
      sector: newSector,
      serviceType: newServiceType.trim(),
      category: newCategory,
      summarySolution: newSummary.trim(),
      detailedProcedure: procedureSteps.length > 0 ? procedureSteps : [newSummary.trim()],
      estimatedResolutionMinutes: Number(newMinutes) || 30,
      tags: tagsArray.length > 0 ? tagsArray : ['procedimento', newSector.toLowerCase()],
      usefulCount: 1,
      lastUpdated: new Date().toLocaleDateString('pt-BR'),
      author: currentUser.name
    };

    activitySyncService.addKnowledgeArticle(article);
    setArticles(activitySyncService.getKnowledgeBase());
    setIsNewArticleModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewSummary('');
    setNewProcedure('');
    setNewTags('');
    setNewServiceType('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Fase 6 • Base de Conhecimento Corporativa
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {articles.length} Artigos Catalogados
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Acervo técnico de incidentes, tipos de serviço e procedimentos padronizados para fechamento de chamados
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewArticleModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Artigo de Solução</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por título, código (ex: N1-AUTH, N2-NET, DBA-PERF), tags ou solução..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Sector filter */}
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

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="TODOS">Categoria: Todas</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-cyan-700/60 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                  {article.code}
                </span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {article.sector}
                </span>
              </div>

              {/* Title & Service Type */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  Tipo: <strong className="text-slate-300">{article.serviceType}</strong>
                </span>
              </div>

              {/* Summary Solution */}
              <p className="text-xs text-slate-400 line-clamp-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                {article.summarySolution}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>~{article.estimatedResolutionMinutes} min</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-[10px]">
                  {article.usefulCount} usos
                </span>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Procedimento</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedArticle.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">Setor: {selectedArticle.sector}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedArticle.title}</h3>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                Tipo de Serviço: {selectedArticle.serviceType} • Categoria: {selectedArticle.category}
              </p>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-300 block">Resumo Padronizado de Fechamento:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedArticle.summarySolution}
              </p>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">
                Procedimento Técnico Detalhado ({selectedArticle.detailedProcedure.length} passos):
              </span>
              <div className="space-y-2">
                {selectedArticle.detailedProcedure.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px] border border-cyan-800">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 font-mono">
              <span>Autor: {selectedArticle.author}</span>
              <span>Última revisão: {selectedArticle.lastUpdated}</span>
              <span>Tempo médio: {selectedArticle.estimatedResolutionMinutes} min</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Article Modal */}
      {isNewArticleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Novo Artigo na Base de Conhecimento (Fase 6)</span>
              </h3>
              <button
                onClick={() => setIsNewArticleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Artigo</label>
                <input
                  type="text"
                  placeholder="Ex: Reset de Senhas e Pareamento MFA..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Setor Responsável</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as Sector)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  >
                    {SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as KnowledgeArticle['category'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Acessos & Identidade">Acessos & Identidade</option>
                    <option value="Redes & Conectividade">Redes & Conectividade</option>
                    <option value="Bancos de Dados">Bancos de Dados</option>
                    <option value="Aplicações & APIs">Aplicações & APIs</option>
                    <option value="Infraestrutura & Nuvem">Infraestrutura & Nuvem</option>
                    <option value="Segurança & LGPD">Segurança & LGPD</option>
                    <option value="Hardware & Periféricos">Hardware & Periféricos</option>
                    <option value="Sistemas & ERP">Sistemas & ERP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo do Serviço Realizado</label>
                <input
                  type="text"
                  placeholder="Ex: Reset de Credenciais & 2FA"
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resumo da Solução (Usado ao Finalizar Chamados)</label>
                <textarea
                  rows={2}
                  placeholder="Resumo conciso que será gravado nas atividades quando este artigo for utilizado..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Passos do Procedimento Detalhado (um por linha)</label>
                <textarea
                  rows={3}
                  placeholder="1. Acessar console de administração&#10;2. Resetar chave de acesso&#10;3. Validar retorno 200 OK..."
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tempo Médio (minutos)</label>
                  <input
                    type="number"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="vpn, rede, wifi"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewArticleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
                >
                  Salvar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
