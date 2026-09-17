import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  X,
  BookOpen,
  Search,
  Sparkles,
  Clock,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  Plus
} from 'lucide-react';
import { SupportTicket, Collaborator, KnowledgeArticle } from '../../../types';
import { activitySyncService } from '../../../services/activitySyncService';
import { SERVICE_TYPES_BY_SECTOR } from '../../../data/knowledgeBase';

interface TicketFinalizeModalProps {
  ticket: SupportTicket;
  currentUser: Collaborator;
  onClose: () => void;
  onSuccess: (result: { ticket: SupportTicket; activityId: string }) => void;
}

export const TicketFinalizeModal: React.FC<TicketFinalizeModalProps> = ({
  ticket,
  currentUser,
  onClose,
  onSuccess
}) => {
  const kbArticles = useMemo(() => activitySyncService.getKnowledgeBase(), []);

  // Filter default service types for current ticket sector
  const defaultServiceTypes = useMemo(() => {
    const sectorKey = ticket.sector.replace('Suporte ', '').trim();
    return SERVICE_TYPES_BY_SECTOR[sectorKey] || [
      'Atendimento Help Desk Geral',
      'Configuração de Acessos & Rede',
      'Manutenção Preventiva / Corretiva',
      'Resolução de Falha de Software',
      'Substituição de Hardware & Periféricos'
    ];
  }, [ticket.sector]);

  const [serviceType, setServiceType] = useState<string>(defaultServiceTypes[0] || 'Atendimento Help Desk Geral');
  const [selectedKbArticle, setSelectedKbArticle] = useState<KnowledgeArticle | null>(null);
  const [kbSearch, setKbSearch] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [timeSpent, setTimeSpent] = useState('00h 45m');
  const [saveAsNewKb, setSaveAsNewKb] = useState(false);
  const [newKbTitle, setNewKbTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter KB articles based on search or sector relevance
  const filteredKbArticles = useMemo(() => {
    return kbArticles.filter(art => {
      const matchSearch =
        art.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
        art.summarySolution.toLowerCase().includes(kbSearch.toLowerCase()) ||
        art.code.toLowerCase().includes(kbSearch.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(kbSearch.toLowerCase()));
      return matchSearch;
    });
  }, [kbArticles, kbSearch]);

  // Recommended articles for the ticket sector
  const recommendedKbArticles = useMemo(() => {
    const secNorm = ticket.sector.replace('Suporte ', '').trim().toLowerCase();
    return kbArticles.filter(art => art.sector.toLowerCase().includes(secNorm)).slice(0, 3);
  }, [kbArticles, ticket.sector]);

  const handleSelectKbArticle = (article: KnowledgeArticle) => {
    setSelectedKbArticle(article);
    setServiceType(article.serviceType);
    setResolutionSummary(article.summarySolution);
    const hours = Math.floor(article.estimatedResolutionMinutes / 60);
    const mins = article.estimatedResolutionMinutes % 60;
    setTimeSpent(`${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`);
  };

  const handleClearSelectedKb = () => {
    setSelectedKbArticle(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !resolutionSummary.trim()) return;

    setIsSubmitting(true);
    try {
      const result = activitySyncService.finalizeTicket({
        ticketId: ticket.id,
        currentUser,
        serviceType,
        resolutionSummary: resolutionSummary.trim(),
        timeSpent: timeSpent || '00h 45m',
        kbArticleId: selectedKbArticle?.id,
        saveToKb: saveAsNewKb,
        newKbTitle: newKbTitle.trim() || `Resolução: ${ticket.subject}`
      });

      onSuccess({
        ticket: result.ticket,
        activityId: result.activity.id
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Finalizar Chamado {ticket.id}
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Fases 5 & 6
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Fechamento técnico com Base de Conhecimento e vínculo com Registro de Atividade
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

        {/* Ticket Context Header Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Cliente: <strong className="text-white">{ticket.client}</strong></span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Setor: {ticket.sector}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Prioridade: {ticket.priority}
              </span>
            </div>
          </div>
          <p className="font-bold text-white text-sm">{ticket.subject}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
            <span>Operador finalizador: <strong className="text-cyan-400">{currentUser.name}</strong> ({currentUser.sector})</span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Tipo de Serviço Realizado */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tipo do Serviço Realizado</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Classificação de esforço
              </span>
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              required
            >
              {defaultServiceTypes.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
              <option value="Outro Serviço Especializado">Outro Serviço Especializado</option>
            </select>
          </div>

          {/* 2. Base de Conhecimento (Fase 6) Picker */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Fase 6 • Usar Solução da Base de Conhecimento</span>
              </label>
              {selectedKbArticle && (
                <button
                  type="button"
                  onClick={handleClearSelectedKb}
                  className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  Desvincular artigo
                </button>
              )}
            </div>

            {selectedKbArticle ? (
              /* Selected Article Card */
              <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/60 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold bg-cyan-900/60 px-2 py-0.5 rounded">
                      {selectedKbArticle.code}
                    </span>
                    <span className="font-bold text-white">{selectedKbArticle.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                    {selectedKbArticle.usefulCount} resoluções
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {selectedKbArticle.summarySolution}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1 border-t border-cyan-900/40 font-mono">
                  <span>Setor: {selectedKbArticle.sector}</span>
                  <span>Tempo médio: {selectedKbArticle.estimatedResolutionMinutes} min</span>
                  <span>Autor: {selectedKbArticle.author}</span>
                </div>
              </div>
            ) : (
              /* Article Search & Quick Recommendations */
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Pesquisar procedimentos padrão, códigos (ex: N1-AUTH, N2-NET)..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Suggestions List */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                    {kbSearch ? 'Resultados da Base de Conhecimento:' : `Soluções Recomendadas para ${ticket.sector}:`}
                  </span>
                  {(kbSearch ? filteredKbArticles.slice(0, 4) : recommendedKbArticles).map(art => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectKbArticle(art)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-800/80 hover:border-cyan-700/60 cursor-pointer transition-all flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">
                          {art.code}
                        </span>
                        <span className="text-white font-medium group-hover:text-cyan-200 line-clamp-1">
                          {art.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {art.estimatedResolutionMinutes}m
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          Usar Solução →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Resumo da Solução Realizada (Vai para a Atividade e para o Laudo) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span>Resumo do que foi Realizado (Solução Aplicada)</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Será registrado na timeline e no Registro de Atividades
              </span>
            </label>
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Descreva de modo conciso o procedimento técnico executado para solucionar o chamado..."
              rows={3}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
            />
          </div>

          {/* 4. Tempo Gasto e Salvar na KB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tempo Gasto no Atendimento</span>
              </label>
              <input
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="Ex: 00h 45m"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {!selectedKbArticle && (
              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={saveAsNewKb}
                    onChange={(e) => setSaveAsNewKb(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Catalogar nova solução na Base de Conhecimento</span>
                </label>
              </div>
            )}
          </div>

          {/* Title for new KB if checked */}
          {saveAsNewKb && (
            <div className="animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Título do Novo Artigo da Base de Conhecimento
              </label>
              <input
                type="text"
                value={newKbTitle}
                onChange={(e) => setNewKbTitle(e.target.value)}
                placeholder={`Ex: Resolução de ${ticket.subject}`}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* 5. Highlight notice: Integration with Formulários & Registro de Atividades */}
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-xs text-emerald-200 flex items-start gap-2.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">
                Vínculo Automático com Formulários & Banco de Atividades
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Ao finalizar, o sistema gera instantaneamente uma atividade vinculada com{' '}
                <strong>Colaborador ({currentUser.name})</strong> e{' '}
                <strong>Setor ({currentUser.sector})</strong>, pronta para ser filtrada e exportada em Excel.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
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
              disabled={isSubmitting || !resolutionSummary.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Encerrando Chamado...' : 'Finalizar Chamado & Gerar Atividade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
