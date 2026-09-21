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
        { id: 'organograma', label: 'Organograma', icon: Network },
        { id: 'colaboradores', label: 'Colaboradores', icon: Users }
      ]
    },
    {
      title: 'OPERAÇÃO & TAREFAS',
      items: [
        { id: 'chamados', label: 'Help Desk & Chamados', icon: LifeBuoy, badge: 6 },
        { id: 'meu_kanban', label: 'Meu Kanban', icon: Kanban },
        { id: 'kanban_equipe', label: 'Kanban da Equipe', icon: Kanban },
        { id: 'visao_semanal', label: 'Planejamento Semanal', icon: Calendar },
        { id: 'planilhas', label: 'Base de Atividades', icon: FileSpreadsheet },
        { id: 'formularios', label: 'Formulários & Banco', icon: FolderEdit },
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
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#7da2ca] border-r border-[#37558d]/30 flex flex-col h-screen shrink-0 select-none transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:w-68 lg:z-auto lg:shadow-none
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#37558d]/30 flex items-center justify-between bg-[#7da2ca]">
          <div 
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
            id="sidebar-brand-logo"
            title="ByComp - enable the future"
          >
            <div className="bg-white px-2.5 py-1 rounded-xl shadow-xs border border-white/60">
              <img 
                src="/bycomp-logo.svg" 
                alt="ByComp" 
                className="h-6.5 max-w-[150px] w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8ba9d]/40 text-[#92400e] border border-[#e8ba9d] shrink-0">
              PROTÓTIPO
            </span>
          </div>

          {/* Close button on mobile phones & tablets */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl bg-white/60 hover:bg-[#37558d] text-slate-700 hover:text-white transition-colors cursor-pointer border border-white/40"
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
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#334b84] hover:bg-[#37558d] text-white text-xs font-bold shadow-xs group transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#8ad0da] group-hover:text-white animate-pulse" />
              <span className="text-white font-bold">Navegador de Telas (22)</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/30">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Nav Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-sm bg-[#7da2ca]" id="sidebar-nav-container">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#37558d]">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-[#37558d] text-white font-bold shadow-xs'
                          : allowed
                          ? 'text-[#1e3a6c] font-semibold hover:bg-[#37558d] hover:text-white hover:font-bold'
                          : 'text-[#37558d]/70 font-medium hover:bg-[#37558d] hover:text-white hover:font-bold'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : 'text-[#37558d] group-hover:text-white'
                        }`} />
                        <span className="truncate group-hover:text-white group-hover:font-bold">{item.label}</span>
                      </span>

                      <div className="flex items-center gap-1 shrink-0 ml-1.5">
                        {!allowed && (
                          <span title="Acesso restrito para o perfil atual (Clique para testar proteção RBAC)">
                            <Lock className="w-3 h-3 text-[#e8ba9d] group-hover:text-white" />
                          </span>
                        )}

                        {item.badge !== undefined && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold transition-colors ${
                            item.highlight 
                              ? 'bg-[#e8ba9d]/30 text-[#92400e] border border-[#e8ba9d] group-hover:bg-white/20 group-hover:text-white group-hover:border-white/40' 
                              : isActive 
                                ? 'bg-white/20 text-white border border-white/30' 
                                : 'bg-white/50 text-[#1e3a6c] border border-white/60 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
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
          <div className="px-3 py-2 border-t border-[#37558d]/30 bg-[#7da2ca]">
            <button
              onClick={() => {
                onOpenSimulatorModal();
                onCloseMobile?.();
              }}
              id="btn-sidebar-open-simulator"
              className="w-full py-2 px-3 rounded-xl bg-white/70 hover:bg-[#37558d] hover:text-white border border-white/60 text-[#37558d] text-xs font-bold hover:font-bold flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-[#37558d] group-hover:text-white group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white group-hover:font-bold">Simulador & Senhas</span>
              </span>
              <span className="text-[10px] bg-white group-hover:bg-white/20 group-hover:text-white group-hover:border-white/40 border border-slate-300 text-slate-700 px-1.5 py-0.2 rounded font-mono transition-colors">
                RBAC
              </span>
            </button>
          </div>
        )}

        {/* Logged User Bar */}
        <div className="p-3 border-t border-[#37558d]/30 bg-[#7da2ca] flex items-center justify-between gap-2" id="sidebar-user-footer">
          <div 
            onClick={() => handleSelect('colaboradores')}
            title="Ver perfil e permissões de acesso"
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer group flex-1 p-1 rounded-lg hover:bg-[#37558d] hover:text-white transition-all"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/60 group-hover:ring-white transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-[#1e3a6c] truncate group-hover:text-white group-hover:font-bold transition-colors">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 truncate">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                  currentUser.userRole === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                    : currentUser.userRole === 'ADMINISTRATIVO'
                    ? 'bg-sky-100 text-sky-700 border border-sky-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                    : currentUser.userRole === 'GESTOR'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                    : 'bg-white/60 text-[#1e3a6c] border border-white/70 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                }`}>
                  {currentUser.userRole === 'SUPER_ADMIN' ? 'SUPER ADMIN' : currentUser.userRole || 'COLABORADOR'}
                </span>
                <span className="text-[10px] text-[#37558d] font-bold group-hover:text-white/90 truncate font-mono">{currentUser.sector}</span>
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
            className="p-1.5 text-[#37558d] hover:text-white hover:bg-[#37558d] rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
