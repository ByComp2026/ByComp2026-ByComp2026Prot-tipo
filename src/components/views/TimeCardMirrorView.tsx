import React, { useState } from 'react';
import {
  Clock,
  User,
  Calendar,
  FileCheck,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  PenTool,
  ShieldCheck
} from 'lucide-react';
import { MOCK_COLLABORATORS, TIME_CARD_RECORDS } from '../../data/mockData';

export const TimeCardMirrorView: React.FC = () => {
  const [selectedCollaborator, setSelectedCollaborator] = useState('Victor Estevão');
  const [selectedMonth, setSelectedMonth] = useState('Setembro / 2026');
  const [isSigned, setIsSigned] = useState(false);
  const [signModal, setSignModal] = useState(false);

  const handleSign = () => {
    setIsSigned(true);
    setSignModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Espelho de Ponto</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Conferência mensal de jornadas, banco de horas e conformidade trabalhista
          </p>
        </div>

        {/* Filters: Colaborador & Mês */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              id="select-colaborador-espelho"
              className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              {MOCK_COLLABORATORS.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                  {c.name} ({c.sector})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer font-mono"
            >
              <option value="Setembro / 2026" className="bg-slate-900">Setembro / 2026</option>
              <option value="Agosto / 2026" className="bg-slate-900">Agosto / 2026</option>
              <option value="Julho / 2026" className="bg-slate-900">Julho / 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saldo Banco de Horas Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Saldo do Mês</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">+04:32</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Crédito
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Setembro / 2026 até hoje</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Saldo Acumulado</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-cyan-400">+18:45</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Banco Ativo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Acordo de compensação 6 meses</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Carga Contratada</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-white">40h</span>
            <span className="text-[10px] text-slate-400 font-mono">Semanal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Segunda a Sexta (08:00 - 17:00)</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Status de Assinatura</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="mt-2">
            {isSigned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Assinado Digitalmente
              </span>
            ) : (
              <button
                onClick={() => setSignModal(true)}
                id="btn-assinatura-digital"
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Assinatura digital</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table of Days */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-300">
            Demonstrativo Diário — {selectedCollaborator}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Jornada padrão: 08:00 com 01:00 de intervalo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/90 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Entrada</th>
                <th className="py-3 px-4">Início Intervalo</th>
                <th className="py-3 px-4">Fim Intervalo</th>
                <th className="py-3 px-4">Saída</th>
                <th className="py-3 px-4">Horas Trabalhadas</th>
                <th className="py-3 px-4">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {TIME_CARD_RECORDS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{row.date}</td>
                  <td className="py-3 px-4 text-cyan-300">{row.entry}</td>
                  <td className="py-3 px-4 text-slate-400">{row.breakStart}</td>
                  <td className="py-3 px-4 text-slate-400">{row.breakEnd}</td>
                  <td className="py-3 px-4 text-cyan-300">{row.exit}</td>
                  <td className="py-3 px-4 font-bold text-white">{row.totalHours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.balance.startsWith('+')
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : row.balance === '00:00'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {row.balance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Simulation Modal */}
      {signModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-cyan-400" />
                Assinatura Eletrônica do Espelho
              </h3>
              <button
                onClick={() => setSignModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
              <p>
                Eu, <strong>{selectedCollaborator}</strong>, declaro a veracidade dos apontamentos registrados no período de {selectedMonth}.
              </p>
              <div className="font-mono text-[11px] text-slate-400">
                Hash de Validação: <code>SHA256:7f83b165...94a3</code>
              </div>
            </div>

            {/* Signature Draw Area */}
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-950 flex flex-col items-center justify-center">
              <span className="font-serif italic text-2xl text-cyan-300 tracking-wider">
                {selectedCollaborator}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-2">
                Certificado Digital ByComp Auth ID #9482
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSignModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSign}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                Confirmar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
