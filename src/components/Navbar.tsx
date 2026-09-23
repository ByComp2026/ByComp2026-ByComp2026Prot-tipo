import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Shield,
  UserCog,
  Users,
  ChevronDown,
  Key,
  Menu,
  Settings
} from 'lucide-react';
import { ViewScreen, Collaborator, UserRole } from '../types';
import { MOCK_ALERTS, CURRENT_USER } from '../data/mockData';

interface NavbarProps {
  currentScreen: ViewScreen;
  onSelectScreen: (screen: ViewScreen) => void;
  onOpenQuickJump: () => void;
  onOpenGuide: () => void;
  currentUser?: Collaborator;
  onSwitchUserRole?: (role: UserRole) => void;
  onOpenSimulatorModal?: () => void;
  onToggleMobileMenu?: () => void;
}

const SCREEN_TITLES: Record<ViewScreen, { title: string; subtitle: string; category: string }> = {
  login: { title: 'Acesso Corporativo', subtitle: 'ByComp', category: 'Segurança' },
  dashboard: { title: 'Dashboard Executivo', subtitle: 'Panorama em tempo real', category: 'Visão Geral' },
  visao_geral: { title: 'Central de Gestão', subtitle: 'Tudo conectado. Todos os processos monitorados.', category: 'Visão Geral' },
  organograma: { title: 'Organograma Corporativo', subtitle: 'Conexão estrutural de todos os setores', category: 'Visão Geral' },
  colaboradores: { title: 'Colaboradores (Fase 4 • Privada)', subtitle: 'Acesso Restrito: Gestão, Administração e RH', category: 'Gestão & RH' },
  meu_kanban: { title: 'Meu Kanban', subtitle: 'Fluxo individual de trabalho', category: 'Operação' },
  kanban_equipe: { title: 'Kanban da Equipe', subtitle: 'Suporte N2 • Semana 14/09 a 20/09/2026', category: 'Operação' },
  visao_semanal: { title: 'Planejamento Semanal', subtitle: 'Distribuição de atividades por dia', category: 'Operação' },
  planilhas: { title: 'Base de Atividades', subtitle: 'Planilha inteligente com filtros e exportação Excel', category: 'Operação' },
  formularios: { title: 'Formulários e Banco de Dados', subtitle: 'Cadastros padronizados e exportação Excel (.xlsx)', category: 'Operação & Dados' },
  registro_atividades: { title: 'Registrar Atividade', subtitle: 'Apontamento técnico de esforço e status', category: 'Operação' },
  registro_ponto: { title: 'Registro de Ponto Eletrônico', subtitle: 'Controle de jornada com simulação biométrica', category: 'Pessoas & Ponto' },
  espelho_ponto: { title: 'Espelho de Ponto', subtitle: 'Consolidação mensal e horas trabalhadas', category: 'Pessoas & Ponto' },
  gestao_ponto: { title: 'Gestão de Ponto (Admin)', subtitle: 'Painel da gerência com status em tempo real', category: 'Pessoas & Ponto' },
  agenda: { title: 'Agenda & Reuniões', subtitle: 'Eventos corporativos integrados', category: 'Pessoas & Ponto' },
  whatsapp: { title: 'WhatsApp Business', subtitle: 'Central comercial e de atendimento integrada', category: 'Comunicação' },
  clientes: { title: 'Gestão de Clientes', subtitle: 'Contratos, SLAs e empresas atendidas', category: 'Comercial' },
  chamados: { title: 'Help Desk & Chamados', subtitle: 'Fila de tickets, prioridades e SLAs', category: 'Operação' },
  equipamentos: { title: 'Inventário de Equipamentos', subtitle: 'Ativos de TI, patrimônio e cautela', category: 'Infraestrutura' },
  instagram: { title: 'Instagram Corporativo', subtitle: 'Painel social e métricas de alcance', category: 'Comunicação' },
  tiktok: { title: 'TikTok Corporativo', subtitle: 'Métricas de vídeos curtos e engajamento', category: 'Comunicação' },
  ai_hub: { title: 'AI HUB', subtitle: 'Inteligência para auxiliar a gestão', category: 'Inteligência' },
  social_ai: { title: 'Social AI Studio', subtitle: 'Geração inteligente de conteúdo multicanal', category: 'Inteligência' },
  marketing_hub: { title: 'Marketing & Vídeos por IA', subtitle: 'Esteira de geração de vídeos e redes sociais', category: 'Marketing' },
  gerador_video: { title: 'AI Video Studio', subtitle: 'Pipeline conceitual de geração de vídeos', category: 'Inteligência' },
  relatorios: { title: 'Central de Relatórios', subtitle: 'Indicadores de produtividade, ponto e SLAs', category: 'Governança' },
  auditoria: { title: 'Auditoria do Sistema', subtitle: 'Trilhas de auditoria, logs e conformidade', category: 'Governança' },
  configuracoes: { title: 'Configurações do Sistema', subtitle: 'Parâmetros corporativos do protótipo', category: 'Governança' },
  design_system: { title: 'UX/UI & Design System', subtitle: 'Arquitetura de Navegação, Wireframes e Tokens Visuais', category: 'Fase 2' }
};

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenQuickJump,
  onOpenGuide,
  currentUser = CURRENT_USER,
  onSwitchUserRole,
  onOpenSimulatorModal,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [time, setTime] = useState('09:02:18');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMeta = SCREEN_TITLES[currentScreen] || {
    title: 'ByComp',
    subtitle: 'Gestão Integrada',
    category: 'Sistema'
  };

  return (
    <header className="h-16 bg-[#7da2ca] border-b border-[#37558d]/30 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0">
      {/* Breadcrumb and Screen Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          id="btn-navbar-mobile-menu"
          className="lg:hidden min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl bg-white/70 hover:bg-[#37558d] hover:text-white active:scale-95 text-[#37558d] border border-white/60 transition-all cursor-pointer shrink-0 z-30 group shadow-2xs"
          title="Abrir menu de navegação lateral"
          aria-label="Abrir menu de navegação lateral"
        >
          <Menu className="w-5 h-5 text-[#37558d] group-hover:text-white transition-colors" />
        </button>

        {/* Small Screen Logo */}
        <div 
          onClick={() => onSelectScreen('dashboard')}
          className="lg:hidden flex items-center cursor-pointer shrink-0 bg-white px-2 py-1 rounded-lg border border-white/60 shadow-2xs"
          title="Ir para Dashboard ByComp"
        >
        </div>

        {/* Screen Title - Responsive for all screens */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#1e3a6c]/80 font-bold">
            <span className="hidden sm:inline">ByComp</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-[#1e3a6c] font-black truncate">{currentMeta.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-black text-[#1e3a6c] tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-none">
              {currentMeta.title}
            </h2>
            <span className="hidden lg:inline text-xs text-[#1e3a6c]/85 font-semibold border-l border-[#37558d]/40 pl-2 truncate">
              {currentMeta.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live Date & Time Widget - Clean, Light & Polished */}
        <div 
          id="navbar-datetime-widget"
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/70 border border-white/60 shadow-2xs text-xs font-mono"
          title="Data e hora sincronizada do sistema ByComp"
        >
          <div className="w-5 h-5 rounded-md bg-white/80 flex items-center justify-center text-[#37558d] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#37558d]" />
          </div>
          <span className="hidden sm:inline text-[#1e3a6c] font-bold tracking-tight">16/09/2026</span>
          <span className="text-[#37558d]/50 hidden sm:inline">•</span>
          <span className="bg-white/90 text-[#1e3a6c] font-black px-2 py-0.5 rounded-md border border-white/80 tracking-wider shadow-2xs">
            {time}
          </span>
        </div>

        {/* Attendance Status Badge (Clickable to jump to Time Clock) */}
        <button
          onClick={() => onSelectScreen('registro_ponto')}
          id="btn-navbar-timeclock-pill"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/70 hover:bg-[#37558d] border border-white/60 hover:border-[#37558d] text-[#1e3a6c] hover:text-white text-xs font-semibold hover:font-bold transition-all shadow-2xs active:scale-95 cursor-pointer group"
          title="Ponto registrado hoje às 08:02. Clique para abrir Registro de Ponto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-white"></span>
          </span>
          <span className="font-bold text-[#1e3a6c] group-hover:text-white group-hover:font-bold transition-colors">Ponto: 08:02</span>
          <span className="hidden md:inline text-[10px] bg-emerald-100 group-hover:bg-white/25 text-emerald-800 group-hover:text-white px-1.5 py-0.2 rounded font-semibold border border-emerald-200 group-hover:border-white/30 transition-colors">
            Expediente
          </span>
        </button>

        {/* Role Simulator Pill & Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            id="btn-navbar-role-simulator"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/60 bg-white/70 hover:bg-[#37558d] hover:text-white text-xs font-bold hover:font-bold transition-all cursor-pointer group shadow-2xs text-[#1e3a6c]"
            title="Simular permissões de acesso por perfil"
          >
            {currentUser.userRole === 'SUPER_ADMIN' && <Crown className="w-3.5 h-3.5 text-purple-600 group-hover:text-white transition-colors" />}
            {currentUser.userRole === 'ADMINISTRATIVO' && <UserCog className="w-3.5 h-3.5 text-sky-600 group-hover:text-white transition-colors" />}
            {currentUser.userRole === 'GESTOR' && <Shield className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors" />}
            {(!currentUser.userRole || currentUser.userRole === 'COLABORADOR') && <Users className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />}
            <span className="hidden lg:inline font-mono text-[11px] text-[#1e3a6c] group-hover:text-white group-hover:font-bold transition-colors">
              {currentUser.userRole === 'SUPER_ADMIN'
                ? 'SUPER ADMIN'
                : currentUser.userRole || 'COLABORADOR'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#37558d] group-hover:text-white" />
          </button>

          {showRoleSelector && (
            <div 
              id="role-simulator-popover"
              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="space-y-1.5">
                {[
                  {
                    role: 'SUPER_ADMIN' as UserRole,
                    title: '1. SUPER ADMINISTRADOR',
                    name: 'Victor Estevão',
                    pass: 'admin@bycomp2026',
                    desc: 'Acesso completo às 22 telas e auditoria',
                    color: 'text-purple-900 border-purple-200 bg-purple-50/70 hover:bg-purple-100/70',
                    icon: Crown
                  },
                  {
                    role: 'ADMINISTRATIVO' as UserRole,
                    title: '2. ADMINISTRATIVO',
                    name: 'Helena Santos',
                    pass: 'admin@rh2026',
                    desc: 'Colaboradores, gestão de ponto, docs e planilhas',
                    color: 'text-sky-900 border-sky-200 bg-sky-50/70 hover:bg-sky-100/70',
                    icon: UserCog
                  },
                  {
                    role: 'GESTOR' as UserRole,
                    title: '3. GESTOR',
                    name: 'Carlos Eduardo (N3)',
                    pass: 'gestor@sup2026',
                    desc: 'Fila técnica N3, chamados e SLA do setor',
                    color: 'text-emerald-900 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70',
                    icon: Shield
                  },
                  {
                    role: 'COLABORADOR' as UserRole,
                    title: '4. COLABORADOR',
                    name: 'Gabriel Ribeiro (N1)',
                    pass: 'colab@n12026',
                    desc: 'Meu Kanban pessoal, ponto e agenda própria',
                    color: 'text-slate-800 border-slate-200 bg-slate-50 hover:bg-slate-100',
                    icon: Users
                  }
                ].map((item) => {
                  const isSelected = currentUser.userRole === item.role;
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        if (onSwitchUserRole) onSwitchUserRole(item.role);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${item.color} ${
                        isSelected ? 'ring-2 ring-[#334b84] font-bold' : ''
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0 mt-0.5 text-[#334b84]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{item.title}</span>
                          {isSelected && (
                            <span className="text-[10px] text-[#334b84] font-bold">Ativo</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <p className="text-[10px] text-slate-600">{item.name}</p>
                          <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1 rounded border border-amber-200 font-semibold">
                            {item.pass}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                {onOpenSimulatorModal ? (
                  <button
                    onClick={() => {
                      setShowRoleSelector(false);
                      onOpenSimulatorModal();
                    }}
                    className="text-[#334b84] hover:text-[#37558d] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Key className="w-3 h-3" />
                    <span>Matriz de Senhas & Telas</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowRoleSelector(false);
                      onSelectScreen('colaboradores');
                    }}
                    className="text-[#334b84] hover:text-[#37558d] font-medium cursor-pointer"
                  >
                    Quadro Geral
                  </button>
                )}
                <button
                  onClick={() => setShowRoleSelector(false)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Alert - Styled Identical to "PROTÓTIPO" Beside Logo */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="btn-navbar-notifications"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#37558d] hover:text-white transition-all cursor-pointer shadow-2xs group"
            title="Alertas e Notificações do Sistema ByComp"
          >
            <Bell className="w-4 h-4 text-[#334b84] group-hover:text-white transition-colors shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8ba9d]/30 text-[#92400e] border border-[#e8ba9d] shrink-0 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/40 transition-colors">
              <span className="hidden sm:inline">3 NOTIFICAÇÕES</span>
              <span className="sm:hidden">3 ALERTA</span>
            </span>
          </button>

          {showNotifications && (
            <div 
              id="notifications-popover"
              className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#334b84]" />
                  <span className="text-xs font-bold text-slate-800">Alertas do Sistema</span>
                </div>
                {/* Styled Identical to "PROTÓTIPO" */}
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8ba9d]/30 text-[#92400e] border border-[#e8ba9d]">
                  3 ATIVOS
                </span>
              </div>

              <div className="space-y-2">
                {MOCK_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-lg text-xs flex items-start gap-2 border bg-slate-50 border-slate-200 hover:bg-[#37558d]/10 transition-colors"
                  >
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="font-medium text-[12px] text-slate-800 truncate">{alert.text}</p>
                        {/* Alert tag styled identical to Protótipo */}
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1 py-0.2 rounded bg-[#e8ba9d]/30 text-[#92400e] border border-[#e8ba9d] shrink-0">
                          {alert.type === 'warning' ? 'ALERTA' : 'STATUS'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectScreen('auditoria');
                  }}
                  className="px-2 py-1 rounded-md text-[#334b84] hover:bg-[#37558d] hover:text-white font-semibold hover:font-bold cursor-pointer transition-colors"
                >
                  Ver logs de auditoria
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="px-2 py-1 rounded-md text-slate-500 hover:bg-[#37558d] hover:text-white hover:font-bold cursor-pointer transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings & Profile Button */}
        <button
          onClick={() => onSelectScreen('configuracoes')}
          id="btn-navbar-settings"
          className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-[#37558d] hover:text-white border border-white/60 text-[#1e3a6c] transition-all shadow-2xs active:scale-95 cursor-pointer group"
          title="Abrir Configurações do Sistema e Perfil Master"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 rounded-lg object-cover ring-1 ring-[#37558d]/30"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[11px] font-black leading-tight group-hover:text-white transition-colors truncate max-w-[110px]">
              {currentUser.name}
            </span>
            <span className="text-[9px] text-[#37558d] group-hover:text-white/80 font-mono font-semibold truncate">
              Configurações
            </span>
          </div>
          <Settings className="w-3.5 h-3.5 text-[#37558d] group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
};
