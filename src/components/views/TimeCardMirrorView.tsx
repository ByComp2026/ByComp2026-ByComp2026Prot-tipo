import React, { useState, useEffect } from 'react';
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
import { dbService } from '../../services/dbService';
import { Collaborator } from '../../types';
import { TIME_CARD_RECORDS } from '../../data/mockData';

export const TimeCardMirrorView: React.FC = () => {
  const [firebaseUsers, setFirebaseUsers] = useState<Collaborator[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Setembro / 2026');
  const [isSigned, setIsSigned] = useState(false);
  const [signModal, setSignModal] = useState(false);

  useEffect(() => {
    const unsub = dbService.subscribeUsers((users) => {
      setFirebaseUsers(users);
      if (users.length > 0 && !selectedCollaborator) {
        setSelectedCollaborator(users[0].name);
      }
    });
    return () => unsub();
  }, [selectedCollaborator]);

  const handleSign = () => {
    setIsSigned(true);
    setSignModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header - White with Blue typography identical to CollaboratorsView */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#37558d] shadow-2xs">
              <Clock className="w-5 h-5 text-[#37558d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#37558d] tracking-tight">Espelho de Ponto</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#37558d] border border-blue-200 font-bold">
                  PORTARIA 671 MTE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conferência mensal de jornadas, banco de horas e conformidade trabalhista
              </p>
            </div>
          </div>
        </div>

        {/* Filters: Colaborador & Mês */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <User className="w-3.5 h-3.5 text-[#37558d]" />
            <select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              id="select-colaborador-espelho"
              className="bg-transparent text-xs font-bold text-[#37558d] focus:outline-none cursor-pointer"
            >
              {firebaseUsers.map((c) => (
                <option key={c.id} value={c.name} className="bg-white text-slate-800">
                  {c.name} ({c.sector})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-[#37558d]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#37558d] focus:outline-none cursor-pointer font-mono"
            >
              <option value="Setembro / 2026" className="bg-white">Setembro / 2026</option>
              <option value="Agosto / 2026" className="bg-white">Agosto / 2026</option>
              <option value="Julho / 2026" className="bg-white">Julho / 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saldo Banco de Horas Cards - White cards with Blue typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Saldo do Mês</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-emerald-600">+04:32</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Crédito
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Setembro / 2026 até hoje</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Saldo Acumulado</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-[#37558d]">+18:45</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#37558d] border border-blue-200">
              Banco Ativo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Acordo de compensação 6 meses</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Carga Contratada</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-slate-800">40h</span>
            <span className="text-[10px] text-slate-400 font-mono">Semanal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Segunda a Sexta (08:00 - 17:00)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status de Assinatura</span>
            <ShieldCheck className="w-4 h-4 text-[#37558d]" />
          </div>

          <div className="mt-2">
            {isSigned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Assinado Digitalmente
              </span>
            ) : (
              <button
                onClick={() => setSignModal(true)}
                id="btn-assinatura-digital"
                className="w-full py-2 px-3 rounded-xl bg-[#37558d] hover:bg-[#1e3a6c] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Assinatura digital</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table of Days - White table with Blue accents */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#37558d]">
            Demonstrativo Diário — {selectedCollaborator}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Jornada padrão: 08:00 com 01:00 de intervalo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Entrada</th>
                <th className="py-3 px-4">Início Intervalo</th>
                <th className="py-3 px-4">Fim Intervalo</th>
                <th className="py-3 px-4">Saída</th>
                <th className="py-3 px-4">Horas Trabalhadas</th>
                <th className="py-3 px-4">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {TIME_CARD_RECORDS.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-sans text-xs">
                    Nenhum registro de ponto eletrônico apurado para {selectedCollaborator || 'o colaborador'} no período de {selectedMonth}.
                  </td>
                </tr>
              ) : (
                TIME_CARD_RECORDS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#37558d]">{row.date}</td>
                    <td className="py-3 px-4 text-[#37558d] font-semibold">{row.entry}</td>
                    <td className="py-3 px-4 text-slate-500">{row.breakStart}</td>
                    <td className="py-3 px-4 text-slate-500">{row.breakEnd}</td>
                    <td className="py-3 px-4 text-[#37558d] font-semibold">{row.exit}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.totalHours}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.balance.startsWith('+')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.balance === '00:00'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {row.balance}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Simulation Modal */}
      {signModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-[#37558d] flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#37558d]" />
                Assinatura Eletrônica do Espelho
              </h3>
              <button
                onClick={() => setSignModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
              <p>
                Eu, <strong className="text-[#37558d]">{selectedCollaborator}</strong>, declaro a veracidade dos apontamentos registrados no período de {selectedMonth}.
              </p>
              <div className="font-mono text-[11px] text-slate-500">
                Hash de Validação: <code>SHA256:7f83b165...94a3</code>
              </div>
            </div>

            {/* Signature Draw Area */}
            <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/30 flex flex-col items-center justify-center">
              <span className="font-serif italic text-2xl text-[#37558d] tracking-wider">
                {selectedCollaborator}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                Certificado Digital ByComp Auth ID #9482
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSignModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSign}
                className="px-4 py-1.5 rounded-lg bg-[#37558d] hover:bg-[#1e3a6c] text-white text-xs font-bold shadow-xs cursor-pointer"
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
