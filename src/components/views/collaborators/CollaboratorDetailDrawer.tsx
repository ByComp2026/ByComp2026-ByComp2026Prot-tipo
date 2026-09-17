import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Shield,
  Stethoscope,
  DollarSign,
  HeartPulse,
  BadgeCheck,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Building2,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { Collaborator } from '../../../types';

interface CollaboratorDetailDrawerProps {
  collaborator: Collaborator | null;
  onClose: () => void;
  onToggleBlock?: (c: Collaborator) => void;
  showToast: (msg: string) => void;
}

export const CollaboratorDetailDrawer: React.FC<CollaboratorDetailDrawerProps> = ({
  collaborator,
  onClose,
  onToggleBlock,
  showToast
}) => {
  const [showSalaryDetail, setShowSalaryDetail] = useState(false);

  if (!collaborator) return null;

  const c = collaborator;
  const isBlocked = c.isBlocked;
  const isExpiring = c.asoStatus === 'A renovar';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
      <div 
        id="drawer-dossie-colaborador"
        className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dossiê Funcional • Fase 4 Privada
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Identity Card */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950/80">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  isBlocked
                    ? 'bg-rose-500'
                    : c.status === 'Em atividade'
                    ? 'bg-emerald-500'
                    : 'bg-slate-600'
                }`}
              ></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white truncate">{c.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    c.userRole === 'SUPER_ADMIN'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : c.userRole === 'ADMINISTRATIVO'
                      ? 'bg-sky-950 text-sky-300 border-sky-800'
                      : c.userRole === 'GESTOR'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {c.userRole || 'COLABORADOR'}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-0.5">{c.role}</p>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Setor: {c.sector}
                </span>
                <span>• Área: {c.area || 'TI'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Block alert if user is blocked */}
          {isBlocked && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">Acesso ao sistema suspenso</p>
                <p className="text-[11px] text-rose-300">
                  O colaborador está temporariamente impedido de efetuar login ou registrar apontamentos.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Dados Contratuais & RH (Privado) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Contrato de Trabalho & Departamento Pessoal
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Regime de Contratação</span>
                <span className="font-bold text-white mt-0.5 block">{c.contractType || 'CLT'}</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Data de Admissão</span>
                <span className="font-bold text-white mt-0.5 block font-mono">{c.admissionDate || '14/03/2024'}</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Carga Horária</span>
                <span className="font-bold text-white mt-0.5 block">{c.workSchedule || '40h semanais (08h às 17h)'}</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">CPF Protegido (LGPD)</span>
                <span className="font-bold text-white mt-0.5 block font-mono">{c.cpfMasked || '***.418.902-**'}</span>
              </div>
            </div>

            {/* Salary Bracket Box with toggle */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-900/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  Faixa Salarial / Remuneração Base
                </span>
                <div className="mt-1 font-mono font-bold text-white text-sm">
                  {showSalaryDetail ? (
                    <span className="text-amber-300">{c.salaryBracket || 'R$ 5.800,00'}</span>
                  ) : (
                    <span className="text-slate-500 tracking-widest">•••••••••••••</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowSalaryDetail(!showSalaryDetail)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
              >
                {showSalaryDetail ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Revelar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Saúde Ocupacional & ASO */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              Saúde Ocupacional (Atestado de Saúde Ocupacional - ASO)
            </h3>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isExpiring
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {isExpiring ? <AlertTriangle className="w-5 h-5" /> : <BadgeCheck className="w-5 h-5" />}
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    {isExpiring ? 'Exame ASO a Renovar' : 'Exame ASO em Dia'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isExpiring
                      ? 'Vencimento em menos de 30 dias. Notificação emitida para agendamento clínico.'
                      : 'Atestado periódico válido conforme NR-7. Apto para atividades normais.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Benefícios Corporativos Ativos */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-purple-400" />
              Pacote de Benefícios Concedidos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(c.benefits || ['Vale Refeição R$ 45/dia', 'Vale Transporte', 'SulAmérica Saúde', 'Seguro de Vida']).map(
                (benefit, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section 4: Contatos & Emergência */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              Canais de Contato Corporativo
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  E-mail Corporativo:
                </span>
                <span className="text-slate-200 font-mono">{c.email}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Telefone / Ramal:
                </span>
                <span className="text-slate-200 font-mono">{c.phone || '(11) 98877-0000'}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  Contato de Emergência:
                </span>
                <span className="text-slate-200 font-mono">{c.emergencyContact || '(11) 98711-4000 (Família)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 sticky bottom-0 z-10 flex items-center justify-between gap-3">
          {onToggleBlock && c.userRole !== 'SUPER_ADMIN' && (
            <button
              onClick={() => {
                onToggleBlock(c);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isBlocked
                  ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                  : 'bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800'
              }`}
            >
              {isBlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Desbloquear Acesso</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Acesso</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
