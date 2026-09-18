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
  Menu
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
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-3 sm:px-5 flex items-center justify-between z-20 backdrop-blur-md shrink-0">
      {/* Breadcrumb and Screen Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          id="btn-navbar-mobile-menu"
          className="lg:hidden min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-700/80 transition-all cursor-pointer shrink-0 z-30"
          title="Abrir menu de navegação lateral"
          aria-label="Abrir menu de navegação lateral"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Small Screen Logo */}
        <div 
          onClick={() => onSelectScreen('dashboard')}
          className="lg:hidden flex items-center cursor-pointer shrink-0"
          title="Ir para Dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
            B
          </div>
        </div>

        {/* Screen Title - Responsive for all screens */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium">
            <span className="hidden sm:inline">ByComp</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-cyan-400 truncate">{currentMeta.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-none">
              {currentMeta.title}
            </h2>
            <span className="hidden lg:inline text-xs text-slate-400 font-normal border-l border-slate-700 pl-2 truncate">
              {currentMeta.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live Date & Time Widget */}
        <div 
          id="navbar-datetime-widget"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300 shadow-sm"
          title="Data e hora sincronizada do sistema"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline text-slate-300 font-medium">16/09/2026</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-cyan-300 font-bold tracking-wide">{time}</span>
        </div>

        {/* Attendance Status Badge (Clickable to jump to Time Clock) */}
        <button
          onClick={() => onSelectScreen('registro_ponto')}
          id="btn-navbar-timeclock-pill"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 hover:border-emerald-400 text-emerald-300 text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Ponto registrado hoje às 08:02. Clique para abrir Registro de Ponto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">Ponto: 08:02</span>
          <span className="hidden md:inline text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded font-semibold border border-emerald-700/60">
            Expediente
          </span>
        </button>

        {/* Role Simulator Pill & Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            id="btn-navbar-role-simulator"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              currentUser.userRole === 'SUPER_ADMIN'
                ? 'bg-purple-950/70 border-purple-800/80 text-purple-300 hover:border-purple-500'
                : currentUser.userRole === 'ADMINISTRATIVO'
                ? 'bg-sky-950/70 border-sky-800/80 text-sky-300 hover:border-sky-500'
                : currentUser.userRole === 'GESTOR'
                ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300 hover:border-emerald-500'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="Simular permissões de acesso por perfil"
          >
            {currentUser.userRole === 'SUPER_ADMIN' && <Crown className="w-3.5 h-3.5 text-purple-400" />}
            {currentUser.userRole === 'ADMINISTRATIVO' && <UserCog className="w-3.5 h-3.5 text-sky-400" />}
            {currentUser.userRole === 'GESTOR' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
            {(!currentUser.userRole || currentUser.userRole === 'COLABORADOR') && <Users className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden lg:inline font-mono text-[11px]">
              {currentUser.userRole === 'SUPER_ADMIN'
                ? 'SUPER ADMIN'
                : currentUser.userRole || 'COLABORADOR'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showRoleSelector && (
            <div 
              id="role-simulator-popover"
              className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Simulador de Papel & Senhas
                </span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
                  4 Níveis RBAC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Alterne o usuário ativo para validar as permissões de cada tela:
              </p>

              <div className="space-y-1.5">
                {[
                  {
                    role: 'SUPER_ADMIN' as UserRole,
                    title: '1. SUPER ADMINISTRADOR',
                    name: 'Victor Estevão',
                    pass: 'admin@bycomp2026',
                    desc: 'Acesso completo às 22 telas e auditoria',
                    color: 'text-purple-300 border-purple-800 bg-purple-950/40 hover:bg-purple-900/40',
                    icon: Crown
                  },
                  {
                    role: 'ADMINISTRATIVO' as UserRole,
                    title: '2. ADMINISTRATIVO',
                    name: 'Helena Santos',
                    pass: 'admin@rh2026',
                    desc: 'Colaboradores, gestão de ponto, docs e planilhas',
                    color: 'text-sky-300 border-sky-800 bg-sky-950/40 hover:bg-sky-900/40',
                    icon: UserCog
                  },
                  {
                    role: 'GESTOR' as UserRole,
                    title: '3. GESTOR',
                    name: 'Carlos Eduardo (N3)',
                    pass: 'gestor@sup2026',
                    desc: 'Fila técnica N3, chamados e SLA do setor',
                    color: 'text-emerald-300 border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/40',
                    icon: Shield
                  },
                  {
                    role: 'COLABORADOR' as UserRole,
                    title: '4. COLABORADOR',
                    name: 'Gabriel Ribeiro (N1)',
                    pass: 'colab@n12026',
                    desc: 'Meu Kanban pessoal, ponto e agenda própria',
                    color: 'text-slate-300 border-slate-700 bg-slate-800/40 hover:bg-slate-750',
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
                        isSelected ? 'ring-1 ring-cyan-400 font-bold' : ''
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{item.title}</span>
                          {isSelected && (
                            <span className="text-[10px] text-cyan-400 font-bold">Ativo</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <p className="text-[10px] text-slate-300">{item.name}</p>
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1 rounded border border-amber-800/60">
                            {item.pass}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                {onOpenSimulatorModal ? (
                  <button
                    onClick={() => {
                      setShowRoleSelector(false);
                      onOpenSimulatorModal();
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
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
                    className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                  >
                    Quadro Geral
                  </button>
                )}
                <button
                  onClick={() => setShowRoleSelector(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell with Dropdown containing Mock Alerts */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="btn-navbar-notifications"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors relative"
            title="Alertas e Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div 
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Alertas do Sistema</span>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                  3 Ativos
                </span>
              </div>

              <div className="space-y-2">
                {MOCK_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                      alert.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                        : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                    }`}
                  >
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-[12px]">{alert.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectScreen('auditoria');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Ver logs de auditoria
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
