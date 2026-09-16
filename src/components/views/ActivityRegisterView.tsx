import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Upload,
  CheckCircle2,
  Calendar,
  Layers,
  User,
  Paperclip,
  Check,
  AlertCircle
} from 'lucide-react';
import { SECTORS, CURRENT_USER, ALL_COLLABORATORS } from '../../data/mockData';
import { Priority, Sector } from '../../types';

export const ActivityRegisterView: React.FC = () => {
  const [collaborator, setCollaborator] = useState(CURRENT_USER.name);
  const [sector, setSector] = useState<Sector>('Suporte N2');
  const [date, setDate] = useState('2026-09-16');
  const [activity, setActivity] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [status, setStatus] = useState<'Concluído' | 'Em andamento' | 'Pendente' | 'Em revisão'>('Concluído');
  const [timeSpent, setTimeSpent] = useState('01h 30m');
  const [observation, setObservation] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Keep feedback for presentation
    }, 4000);
  };

  const resetForm = () => {
    setActivity('');
    setDescription('');
    setObservation('');
    setFileName(null);
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Registrar Atividade</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Apontamento de esforço técnico e rastreabilidade na Base de Atividades
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
          ByComp Task Tracker
        </span>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div 
          id="banner-atividade-registrada"
          className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/80 text-emerald-200 flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-base text-white">✓ Atividade registrada.</p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                O apontamento foi contabilizado na produtividade do setor <strong>{sector}</strong> e vinculado à timeline de hoje.
              </p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-xs font-bold text-white transition-colors"
          >
            Registrar Outra
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colaborador */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Colaborador
              </label>
              <select
                value={collaborator}
                onChange={(e) => setCollaborator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              >
                {ALL_COLLABORATORS.slice(0, 16).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.sector})
                  </option>
                ))}
              </select>
            </div>

            {/* Setor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Setor
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as Sector)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              >
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            {/* Tempo Gasto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tempo Gasto
              </label>
              <input
                type="text"
                placeholder="Ex: 01h 45m"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              >
                <option value="Concluído">Concluído</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Pendente">Pendente</option>
                <option value="Em revisão">Em revisão</option>
              </select>
            </div>
          </div>

          {/* Atividade */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Atividade Realizada
            </label>
            <input
              type="text"
              placeholder="Ex: Resolução de falha de conexão na VPN do cliente XYZ"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descrição Detalhada do Procedimento
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes técnicos, comandos executados, logs verificados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observação
            </label>
            <input
              type="text"
              placeholder="Notas adicionais para a gestão..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Anexo simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Anexo (Evidência ou Log)
            </label>
            <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/80 rounded-xl p-3 text-center bg-slate-950/60 cursor-pointer transition-colors">
              <input
                type="file"
                id="file-upload-activity"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
                className="hidden"
              />
              <label htmlFor="file-upload-activity" className="cursor-pointer">
                <Upload className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300 block font-medium">
                  {fileName ? (
                    <span className="text-cyan-300 font-mono">Arquivo selecionado: {fileName}</span>
                  ) : (
                    "Clique ou arraste um arquivo de log, relatório ou print (Max 25MB)"
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              id="btn-registrar-atividade-submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              Registrar atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
