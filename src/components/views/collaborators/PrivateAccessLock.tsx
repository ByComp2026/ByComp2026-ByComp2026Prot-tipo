import React from 'react';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  LayoutDashboard,
  Crown,
  UserCog,
  Shield
} from 'lucide-react';
import { Collaborator, ViewScreen } from '../../../types';
import { AUTH_ACCOUNTS, convertCredentialToCollaborator } from '../../../data/authCredentials';

interface PrivateAccessLockProps {
  currentUser?: Collaborator;
  onSwitchUser?: (user: Collaborator) => void;
  onNavigate?: (screen: ViewScreen) => void;
  phaseNumber?: 2 | 3 | 4;
  phaseBadge?: string;
  title?: string;
  description?: React.ReactNode;
  userRestrictionNote?: string;
  whyPrivateTitle?: string;
  whyPrivateDescription?: string;
}

export const PrivateAccessLock: React.FC<PrivateAccessLockProps> = ({
  currentUser,
  onSwitchUser,
  onNavigate,
  phaseNumber = 4,
  phaseBadge,
  title,
  description,
  userRestrictionNote,
  whyPrivateTitle,
  whyPrivateDescription
}) => {
  const helenaAccount = AUTH_ACCOUNTS.find(a => a.role === 'ADMINISTRATIVO');
  const victorAccount = AUTH_ACCOUNTS.find(a => a.role === 'SUPER_ADMIN');
  const carlosAccount = AUTH_ACCOUNTS.find(a => a.role === 'GESTOR');

  const handleSimulateUser = (acc: typeof AUTH_ACCOUNTS[0]) => {
    if (onSwitchUser) {
      onSwitchUser(convertCredentialToCollaborator(acc));
    }
  };

  // Phase-specific defaults
  const effectiveBadge =
    phaseBadge ||
    (phaseNumber === 2
      ? 'FASE 2 • TELA PRIVADA & CONFIDENCIAL'
      : phaseNumber === 3
      ? 'FASE 3 • TELA PRIVADA & CONFIDENCIAL'
      : 'FASE 4 • TELA PRIVADA & CONFIDENCIAL');

  const effectiveTitle = title || 'Acesso Restrito: Gestão, Administração & RH';

  const effectiveDescription =
    description ||
    (phaseNumber === 2 ? (
      <>
        O módulo de <strong className="text-slate-200">UX/UI Design System & Wireframes da Fase 2</strong> é um ambiente restrito e protegido por governança corporativa e sigilo de produto da ByComp. Acesso reservado à liderança estratégica.
      </>
    ) : phaseNumber === 3 ? (
      <>
        O módulo de <strong className="text-slate-200">Organograma Institucional da Fase 3</strong> é um ambiente restrito e protegido por governança corporativa e conformidade com a <strong className="text-rose-300">LGPD (Art. 46)</strong>. Acesso reservado à linha de comando e gestão de pessoas.
      </>
    ) : (
      <>
        O módulo de <strong className="text-slate-200">Colaboradores da Fase 4</strong> é um ambiente restrito e protegido por governança corporativa e conformidade com a <strong className="text-rose-300">LGPD (Lei Geral de Proteção de Dados - Art. 46)</strong>.
      </>
    ));

  const effectiveUserRestriction =
    userRestrictionNote ||
    (phaseNumber === 2
      ? '⛔ Perfil sem permissão para especificações de arquitetura e protótipos'
      : phaseNumber === 3
      ? '⛔ Perfil sem permissão para visualização de linhas de comando e subordinação'
      : '⛔ Perfil sem permissão para prontuários funcionais e dados contratuais');

  const effectiveWhyTitle =
    whyPrivateTitle ||
    (phaseNumber === 2
      ? 'Por que a Fase 2 é privada?'
      : phaseNumber === 3
      ? 'Por que a Fase 3 é privada?'
      : 'Por que esta tela é privada?');

  const effectiveWhyDescription =
    whyPrivateDescription ||
    (phaseNumber === 2
      ? 'Reúne a documentação de alta fidelidade das 22 telas navegáveis, wireframes intersetoriais responsivos, fluxos de engenharia e a matriz de governança técnica. O acesso é restrito à liderança de Gestão, Administração e RH.'
      : phaseNumber === 3
      ? 'Reúne a árvore hierárquica completa dos 11 setores, linhas de subordinação de 48 colaboradores, metas de SLA setorial e o simulador interativo de reestruturação de cargos. Acesso confidencial para Gestão, Administração e RH.'
      : 'Reúne dados sensíveis do departamento de pessoal: faixas salariais, contratos (CLT/PJ), atestados médicos ocupacionais (ASO) e matriz de permissões. Apenas gestores autorizados possuem credencial de acesso.');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900 border border-rose-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* Header with Lock Icon */}
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-rose-950/80 border-2 border-rose-700/80 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/60">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-900 border border-rose-600 text-rose-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold tracking-wide">
              <span>{effectiveBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {effectiveTitle}
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              {effectiveDescription}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 relative z-10">
          {/* Current User Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser?.name || 'Usuário'}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Colaborador Autenticado'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {currentUser?.userRole || 'COLABORADOR'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.role || 'Analista'}</p>
              <p className="text-[10px] text-rose-400 mt-1 font-semibold flex items-center gap-1">
                <span>{effectiveUserRestriction}</span>
              </p>
            </div>
          </div>

          {/* Privacy Notice Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-center text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{effectiveWhyTitle}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {effectiveWhyDescription}
            </p>
          </div>
        </div>

        {/* Authorized Roles Fast Simulation */}
        <div className="border-t border-slate-800 pt-6 relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Simular Acesso Autorizado (Ambiente Executivo)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Clique para testar com perfis permitidos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Helena Santos (RH) */}
            {helenaAccount && (
              <button
                onClick={() => handleSimulateUser(helenaAccount)}
                className="p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/80 hover:border-sky-500 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-lg bg-sky-900 text-sky-300">
                    <UserCog className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                    Administração & RH
                  </span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-sky-200 truncate">
                  {helenaAccount.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{helenaAccount.roleLabel}</p>
                <div className="flex items-center gap-1 text-[10px] text-sky-400 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
                  <span>Acessar tela privada</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            )}

            {/* Victor Estevão (Super Admin) */}
            {victorAccount && (
              <button
                onClick={() => handleSimulateUser(victorAccount)}
                className="p-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/80 hover:border-purple-500 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-lg bg-purple-900 text-purple-300">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-purple-200 truncate">
                  {victorAccount.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{victorAccount.roleLabel}</p>
                <div className="flex items-center gap-1 text-[10px] text-purple-400 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
                  <span>Acessar tela privada</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            )}

            {/* Carlos Eduardo (Gestão TI) */}
            {carlosAccount && (
              <button
                onClick={() => handleSimulateUser(carlosAccount)}
                className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 hover:border-emerald-500 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-lg bg-emerald-900 text-emerald-300">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Gestão TI (Líder N3)
                  </span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-200 truncate">
                  {carlosAccount.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{carlosAccount.roleLabel}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
                  <span>Acessar tela privada</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Trilha de auditoria registrada: tentativa de acesso não-autorizado à Fase {phaseNumber} com perfil COLABORADOR</span>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Voltar ao Dashboard Executivo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
