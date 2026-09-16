import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Zap,
  Share2,
  Bot,
  BarChart3,
  ShieldCheck,
  Send,
  CheckCircle2,
  Terminal,
  Cpu,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { AI_TOOLS_DATA } from '../../data/mockData';
import { ViewScreen } from '../../types';

interface AIHubViewProps {
  onNavigate: (screen: ViewScreen) => void;
}

export const AIHubView: React.FC<AIHubViewProps> = ({ onNavigate }) => {
  const [prompt, setPrompt] = useState('');
  const [executing, setExecuting] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const suggestions = [
    "Gerar relatório executivo de produtividade da semana",
    "Criar procedimento padrão (SOP) para troca de chave de API",
    "Analisar gargalos no atendimento de chamados do Suporte N2",
    "Sugerir pauta de 5 vídeos técnicos para LinkedIn e TikTok"
  ];

  const handleExecute = (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim()) return;

    setExecuting(true);
    setGeneratedOutput(null);

    setTimeout(() => {
      setExecuting(false);
      setGeneratedOutput(`### 🤖 RELATÓRIO EXECUTIVO GERADO PELO BYCOMP AI
**Alvo:** ${textToRun}
**Data:** 16/09/2026 — 09:30 BRT | **Modelo:** ByComp LLM Core v4.2

#### 1. Diagnóstico Geral
* O índice de produtividade geral da TI atingiu **93.2%**, com destaque para DBA e Suporte N3 (SLA 99%).
* Identificada sobrecarga pontual no **Suporte N2** devido a 18 chamados de redefinição de VPN simultâneos.

#### 2. Recomendações Automáticas
1. **Automação de Autoatendimento:** Ativar fluxo guiado no WhatsApp Central para reset de credenciais com validação MFA.
2. **Rebalanceamento de Fila:** Redirecionar 4 chamados de média complexidade para a fila do Suporte N1 sênior.
3. **Previsão de Conclusão da Sprint:** 96% de assertividade até sexta-feira às 18h.

*Status: Parecer homologado e arquivado nos logs de auditoria corporativa.*`);
    }, 1200);
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                ByComp AI — Centro de Automações
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Modelos de linguagem, geração de procedimentos e inteligência preditiva corporativa
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Cluster IA Operacional: 99.9% Disponível</span>
          </span>
        </div>
      </div>

      {/* Quick Prompt Center (Command Console) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>O que você quer que a IA faça agora?</span>
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            ByComp Prompt Engine • Suporte a comandos em linguagem natural
          </span>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Ex: Analisar produtividade do Suporte N2 ou gerar ata de reunião..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            id="input-prompt-ai-hub"
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
          />

          <button
            onClick={() => handleExecute()}
            disabled={executing}
            id="btn-executar-com-ia"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            {executing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Processando IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Executar com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold">Sugestões Rápidas:</span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sug);
                handleExecute(sug);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer text-left"
            >
              ⚡ {sug}
            </button>
          ))}
        </div>

        {/* Output Box */}
        {generatedOutput && (
          <div 
            id="ai-output-box"
            className="mt-4 p-5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-slate-200 space-y-3 font-mono leading-relaxed animate-in fade-in duration-200 shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Resultado da Execução do Agente
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-[12px] text-slate-300">
              {generatedOutput}
            </pre>
          </div>
        )}
      </div>

      {/* 6 AI Tool Cards Requested by User */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_TOOLS_DATA.map((tool) => {
          return (
            <div
              key={tool.id}
              id={`ai-tool-card-${tool.id}`}
              onClick={() => {
                setPrompt(`Executar ${tool.title} com parâmetros operacionais da empresa.`);
                handleExecute(`Executar ${tool.title} com parâmetros operacionais da empresa.`);
              }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-cyan-950/60 text-cyan-400 border border-slate-700/80 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Ativar modelo</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
