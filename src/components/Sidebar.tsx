import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Calendar,
  Kanban,
  Clock,
  Sparkles,
  Share2,
  Instagram,
  Video,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Network,
  Compass,
  Settings,
  LogOut,
  FolderEdit,
  FileText,
  Building2,
  LifeBuoy,
  HardDrive,
  ChevronRight,
  Zap,
  Lock,
  KeyRound,
  Layers,
  X
} from 'lucide-react';
import { ViewScreen, Collaborator } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { checkScreenAccess } from '../data/authCredentials';

interface SidebarProps {
  currentScreen: ViewScreen;
  onSelectScreen: (screen: ViewScreen) => void;
  onLogout?: () => void;
  onOpenQuickJump?: () => void;
  onOpenNavModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenGuideModal?: () => void;
  onOpenSimulatorModal?: () => void;
  currentUser?: Collaborator;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: ViewScreen;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  onLogout,
  onOpenQuickJump,
  onOpenNavModal,
  onOpenGuideModal,
  onOpenSimulatorModal,
  currentUser = CURRENT_USER,
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  const handleOpenNav = () => {
    if (onOpenQuickJump || onOpenNavModal) {
      (onOpenQuickJump || onOpenNavModal)!();
      onCloseMobile?.();
    }
  };

  const handleSelect = (screen: ViewScreen) => {
    onSelectScreen(screen);
    onCloseMobile?.();
  };

  const navSections: NavSection[] = [
    {
      title: 'VISÃO GERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'visao_geral', label: 'Central de Gestão', icon: Compass, badge: 'Executivo' },
        { id: 'design_system', label: 'UX/UI & Design System', icon: Layers, badge: 'Fase 2 • Privada', highlight: true },
        { id: 'organograma', label: 'Organograma', icon: Network, badge: 'Fase 3 • Privada', highlight: true },
        { id: 'colaboradores', label: 'Colaboradores', icon: Users, badge: 'Fase 4 • Privada', highlight: true }
      ]
    },
    {
      title: 'OPERAÇÃO & TAREFAS',
      items: [
        { id: 'chamados', label: 'Help Desk & Chamados', icon: LifeBuoy, badge: 6 },
        { id: 'meu_kanban', label: 'Meu Kanban', icon: Kanban },
        { id: 'kanban_equipe', label: 'Kanban da Equipe', icon: Kanban, badge: 'N2' },
        { id: 'visao_semanal', label: 'Planejamento Semanal', icon: Calendar },
        { id: 'planilhas', label: 'Base de Atividades', icon: FileSpreadsheet },
        { id: 'formularios', label: 'Formulários & Banco', icon: FolderEdit, badge: 'Excel' },
        { id: 'registro_atividades', label: 'Registrar Atividade', icon: FileText }
      ]
    },
    {
      title: 'PESSOAS & PONTO',
      items: [
        { id: 'registro_ponto', label: 'Registro de Ponto', icon: Clock, highlight: true },
        { id: 'espelho_ponto', label: 'Espelho de Ponto', icon: FileSpreadsheet },
        { id: 'gestao_ponto', label: 'Gestão de Ponto (Admin)', icon: Users, badge: 'Admin' },
        { id: 'agenda', label: 'Agenda & Reuniões', icon: Calendar }
      ]
    },
    {
      title: 'COMERCIAL & ATIVOS',
      items: [
        { id: 'clientes', label: 'Gestão de Clientes', icon: Building2, badge: 5 },
        { id: 'equipamentos', label: 'Gestão de Ativos', icon: HardDrive },
        { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare, badge: 2, highlight: true }
      ]
    },
    {
      title: 'MARKETING & IA',
      items: [
        { id: 'ai_hub', label: 'AI HUB', icon: Sparkles, badge: 'IA' },
        { id: 'marketing_hub', label: 'Marketing & Vídeos IA', icon: Video, badge: 'Novo' },
        { id: 'social_ai', label: 'Social AI', icon: Sparkles },
        { id: 'gerador_video', label: 'AI Video Studio', icon: Video },
        { id: 'instagram', label: 'Instagram', icon: Instagram },
        { id: 'tiktok', label: 'TikTok', icon: Share2 }
      ]
    },
    {
      title: 'GOVERNANÇA',
      items: [
        { id: 'relatorios', label: 'Central de Relatórios', icon: BarChart3 },
        { id: 'auditoria', label: 'Auditoria do Sistema', icon: ShieldCheck },
        { id: 'configuracoes', label: 'Configurações', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar-panel"
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900/98 border-r border-slate-800/80 flex flex-col h-screen shrink-0 backdrop-blur-xl select-none transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:w-68 lg:z-auto lg:shadow-none
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
            id="sidebar-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-extrabold text-xl tracking-wider group-hover:scale-105 transition-transform">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base tracking-tight text-white">ByComp</h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  PROTÓTIPO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">Gestão Integrada</p>
            </div>
          </div>

          {/* Close button on mobile phones & tablets */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Fechar menu lateral"
            aria-label="Fechar menu lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presentation Fast Launcher Banner */}
        <div className="px-3 pt-3">
          <button
            onClick={handleOpenNav}
            id="sidebar-quick-jump-btn"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-950/70 to-slate-800/70 border border-cyan-800/50 hover:border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-semibold shadow-inner group transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Navegador de Telas (22)</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Nav Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-sm" id="sidebar-nav-container">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  const { allowed } = checkScreenAccess(item.id, currentUser.userRole);

                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-950'
                          : allowed
                          ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : allowed ? 'text-slate-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </span>

                      <div className="flex items-center gap-1 shrink-0 ml-1.5">
                        {!allowed && (
                          <span title="Acesso restrito para o perfil atual (Clique para testar proteção RBAC)">
                            <Lock className="w-3 h-3 text-amber-400/80" />
                          </span>
                        )}

                        {item.badge !== undefined && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            item.highlight 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : isActive 
                                ? 'bg-cyan-500/30 text-cyan-200' 
                                : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Simulator Shortcut Button */}
        {onOpenSimulatorModal && (
          <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/40">
            <button
              onClick={() => {
                onOpenSimulatorModal();
                onCloseMobile?.();
              }}
              id="btn-sidebar-open-simulator"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 border border-cyan-800/50 hover:border-cyan-500/60 text-cyan-300 text-xs font-semibold flex items-center justify-between transition-all group cursor-pointer shadow-sm"
            >
              <span className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Simulador & Senhas</span>
              </span>
              <span className="text-[10px] bg-cyan-900/60 border border-cyan-700/60 text-cyan-200 px-1.5 py-0.2 rounded font-mono">
                RBAC
              </span>
            </button>
          </div>
        )}

        {/* Logged User Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2" id="sidebar-user-footer">
          <div 
            onClick={() => handleSelect('colaboradores')}
            title="Ver perfil e permissões de acesso"
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer group flex-1"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/40 group-hover:ring-cyan-400 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 truncate">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                  currentUser.userRole === 'SUPER_ADMIN'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                    : currentUser.userRole === 'ADMINISTRATIVO'
                    ? 'bg-sky-950 text-sky-300 border border-sky-800'
                    : currentUser.userRole === 'GESTOR'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {currentUser.userRole === 'SUPER_ADMIN' ? 'SUPER ADMIN' : currentUser.userRole || 'COLABORADOR'}
                </span>
                <span className="text-[10px] text-slate-400 truncate font-mono">{currentUser.sector}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout?.();
              onCloseMobile?.();
            }}
            id="btn-sidebar-logout"
            title="Encerrar sessão"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
