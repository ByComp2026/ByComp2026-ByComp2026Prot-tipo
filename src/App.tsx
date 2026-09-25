import React, { useState, useEffect } from 'react';
import { ViewScreen, Collaborator, UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PresentationNavigatorModal } from './components/PresentationNavigatorModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';

// 22 Screen Views
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { SmartSpreadsheetView } from './components/views/SmartSpreadsheetView';
import { AgendaView } from './components/views/AgendaView';
import { MyKanbanView } from './components/views/MyKanbanView';
import { TeamKanbanView } from './components/views/TeamKanbanView';
import { WeeklyPlanningView } from './components/views/WeeklyPlanningView';
import { TimeClockView } from './components/views/TimeClockView';
import { TimeCardMirrorView } from './components/views/TimeCardMirrorView';
import { PontoAdminView } from './components/views/PontoAdminView';
import { AIHubView } from './components/views/AIHubView';
import { ReportsView } from './components/views/ReportsView';
import { MarketingHubView } from './components/views/MarketingHubView';
import { WhatsAppCentralView } from './components/views/WhatsAppCentralView';
import { ClientsView } from './components/views/ClientsView';
import { TicketsView } from './components/views/TicketsView';
import { EquipmentView } from './components/views/EquipmentView';
import { CollaboratorsView } from './components/views/CollaboratorsView';
import { AuditLogView } from './components/views/AuditLogView';
import { VisionOverviewView } from './components/views/VisionOverviewView';
import { DesignSystemNavMapView } from './components/views/DesignSystemNavMapView';
import { OrganogramaView } from './components/views/OrganogramaView';
import { SettingsView } from './components/views/SettingsView';
import { RoleSimulatorModal } from './components/RoleSimulatorModal';
import { checkScreenAccess } from './data/authCredentials';
import { Presentation, BookOpen, ChevronRight, ChevronLeft, ShieldAlert, Lock, Crown, Key, Sparkles, Shield } from 'lucide-react';

const HIERARCHY_PERSONAS: Record<UserRole, Collaborator> = {
  SUPER_ADMIN: {
    id: 'user-victor-master',
    name: 'Victor (Master Admin)',
    role: 'Tech Lead / Super Admin Master',
    sector: 'DESENVOLVIMENTO',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'victormorekids@gmail.com',
    phone: '(11) 98765-4321',
    admissionDate: '2021-01-10',
    status: 'Em atividade',
    currentTask: 'Governança Master e Arquitetura do Sistema',
    userRole: 'SUPER_ADMIN',
    area: 'DESENVOLVIMENTO'
  },
  ADMINISTRATIVO: {
    id: 'user-helena',
    name: 'Helena Santos',
    role: 'Coordenadora Administrativa',
    sector: 'ADMINISTRATIVO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'helena.santos@bycomp.com.br',
    phone: '(11) 99871-0002',
    admissionDate: '2022-04-12',
    status: 'Em atividade',
    currentTask: 'Acompanhamento de Ponto e Colaboradores',
    userRole: 'ADMINISTRATIVO',
    area: 'ADMINISTRATIVO'
  },
  GESTOR: {
    id: 'user-carlos',
    name: 'Carlos Eduardo',
    role: 'Gestor de Suporte N3',
    sector: 'SUPORTE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'carlos.eduardo@bycomp.com.br',
    phone: '(11) 99871-0003',
    admissionDate: '2022-08-01',
    status: 'Em atividade',
    currentTask: 'Gestão de Fila e Produtividade N3',
    userRole: 'GESTOR',
    area: 'SUPORTE'
  },
  COLABORADOR: {
    id: 'user-gabriel',
    name: 'Gabriel Ribeiro',
    role: 'Analista de Suporte N1',
    sector: 'SUPORTE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'gabriel.ribeiro@bycomp.com.br',
    phone: '(11) 99871-0004',
    admissionDate: '2023-02-15',
    status: 'Em atividade',
    currentTask: 'Atendimento a Chamados N1',
    userRole: 'COLABORADOR',
    area: 'SUPORTE'
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('login');
  const [currentUser, setCurrentUser] = useState<Collaborator>(HIERARCHY_PERSONAS.SUPER_ADMIN);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPitchCollapsed, setIsPitchCollapsed] = useState(false);

  const handleSwitchRole = (role: UserRole) => {
    if (HIERARCHY_PERSONAS[role]) {
      setCurrentUser(HIERARCHY_PERSONAS[role]);
    }
  };

  const handleSelectCollaborator = (user: Collaborator) => {
    setCurrentUser(user);
  };

  // Keyboard shortcut: Ctrl+K, Cmd+K or Alt+K opens quick navigator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsNavModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen ordering for linear pitch navigation
  const screenOrder: ViewScreen[] = [
    'login',
    'dashboard',
    'planilhas',
    'agenda',
    'meu_kanban',
    'kanban_equipe',
    'visao_semanal',
    'registro_ponto',
    'espelho_ponto',
    'gestao_ponto',
    'ai_hub',
    'relatorios',
    'marketing_hub',
    'whatsapp',
    'clientes',
    'chamados',
    'equipamentos',
    'colaboradores',
    'auditoria',
    'visao_geral',
    'design_system'
  ];

  const currentScreenIndex = screenOrder.indexOf(currentScreen);
  const prevScreen = currentScreenIndex > 0 ? screenOrder[currentScreenIndex - 1] : null;
  const nextScreen = currentScreenIndex < screenOrder.length - 1 ? screenOrder[currentScreenIndex + 1] : null;

  const renderActiveScreen = () => {
    // Login Screen is publicly accessible for authentication
    if (currentScreen === 'login') {
      return (
        <LoginView 
          onLogin={(user) => {
            if (user) {
              setCurrentUser(user);
            }
            setCurrentScreen('dashboard');
          }} 
        />
      );
    }

    // Dedicated executive private screens (Phase 2, Phase 3, Phase 4) render their own
    // specialized PrivateAccessLock with 1-click test personas (Helena, Victor, Carlos) and full governance context.
    const isDedicatedPrivateScreen =
      currentScreen === 'colaboradores' ||
      currentScreen === 'organograma' ||
      currentScreen === 'design_system';

    if (!isDedicatedPrivateScreen) {
      // Centralized RBAC Security Enforcement across standard operational screens
      const access = checkScreenAccess(currentScreen, currentUser.userRole);
      if (!access.allowed) {
        const isSuperAdminRequired = access.policy.allowedRoles.length === 1 && access.policy.allowedRoles[0] === 'SUPER_ADMIN';

        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto my-8 text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
              isSuperAdminRequired 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Lock className="w-8 h-8" />
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${
              isSuperAdminRequired
                ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              Controle de Acesso (RBAC) Ativo • {access.policy.category}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Acesso Restrito: {access.policy.screenTitle}
            </h3>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-lg mx-auto">
              {access.policy.restrictionReason}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 mb-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Usuário Ativo Simulado:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{currentUser.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                    {currentUser.userRole || 'COLABORADOR'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Papéis com permissão:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {access.policy.allowedRoles.map((role) => (
                    <span key={role} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">
                      {role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleSwitchRole(access.policy.recommendedRoleToTest)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-900/30 hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Simular como {access.policy.recommendedRoleToTest === 'SUPER_ADMIN' ? 'Super Admin' : access.policy.recommendedRoleToTest}
              </button>

              <button
                onClick={() => setIsSimulatorModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Ver Credenciais & Senhas
              </button>

              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
      }
    }

    switch (currentScreen) {
      case 'login':
        return (
          <LoginView 
            onLogin={(user) => {
              if (user) {
                setCurrentUser(user);
              }
              setCurrentScreen('dashboard');
            }} 
          />
        );
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentScreen} />;
      case 'planilhas':
        return <SmartSpreadsheetView currentUser={currentUser} />;
      case 'agenda':
        return <AgendaView />;
      case 'meu_kanban':
        return <MyKanbanView />;
      case 'kanban_equipe':
        return <TeamKanbanView />;
      case 'visao_semanal':
        return <WeeklyPlanningView />;
      case 'registro_ponto':
        return <TimeClockView currentUser={currentUser} onNavigate={setCurrentScreen} />;
      case 'espelho_ponto':
        return <TimeCardMirrorView />;
      case 'gestao_ponto':
        return <PontoAdminView onNavigate={setCurrentScreen} />;
      case 'ai_hub':
        return <AIHubView onNavigate={setCurrentScreen} />;
      case 'relatorios':
        return <ReportsView />;
      case 'marketing_hub':
        return <MarketingHubView />;
      case 'whatsapp':
        return <WhatsAppCentralView />;
      case 'clientes':
        return <ClientsView />;
      case 'chamados':
        return (
          <TicketsView
            currentUser={currentUser}
            onNavigate={setCurrentScreen}
            onSwitchUser={setCurrentUser}
          />
        );
      case 'equipamentos':
        return <EquipmentView onNavigate={setCurrentScreen} />;
      case 'colaboradores':
        return (
          <CollaboratorsView
            onNavigate={setCurrentScreen}
            currentUser={currentUser}
            onSwitchUser={setCurrentUser}
            onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
          />
        );
      case 'auditoria':
        return <AuditLogView />;
      case 'visao_geral':
        return (
          <VisionOverviewView
            onNavigate={setCurrentScreen}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        );
      case 'organograma':
        return (
          <OrganogramaView
            onNavigate={setCurrentScreen}
            currentUser={currentUser}
            onSwitchUser={setCurrentUser}
          />
        );
      case 'design_system':
        return (
          <DesignSystemNavMapView
            onNavigate={setCurrentScreen}
            currentUser={currentUser}
            onSwitchUser={setCurrentUser}
          />
        );
      case 'configuracoes':
        return (
          <SettingsView
            currentUser={currentUser}
            onUpdateCurrentUser={setCurrentUser}
          />
        );
      default:
        return <DashboardView onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#8ad0da]/40 selection:text-[#121a2d] antialiased">
      {currentScreen === 'login' ? (
        renderActiveScreen()
      ) : (
        // Standard Corporate Master Layout for Screens 2 to 22
        <div className="flex h-screen overflow-hidden relative">
          {/* Main Sidebar (Desktop persistent + Mobile slide-over drawer) */}
          <Sidebar
            currentScreen={currentScreen}
            onSelectScreen={setCurrentScreen}
            onLogout={() => setCurrentScreen('login')}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onOpenNavModal={() => setIsNavModalOpen(true)}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
            onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
            currentUser={currentUser}
            isOpenOnMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content Column */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Top Corporate Navbar */}
            <Navbar
              currentScreen={currentScreen}
              onSelectScreen={setCurrentScreen}
              onOpenQuickJump={() => setIsNavModalOpen(true)}
              onOpenGuide={() => setIsGuideModalOpen(true)}
              currentUser={currentUser}
              onSwitchUserRole={handleSwitchRole}
              onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
              onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
            />

            {/* Scrollable Work Area - Clean & Responsive with brand background #7da2ca */}
            <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 pb-20 lg:pb-8 bg-[#7da2ca] overflow-x-hidden">
              <div className="max-w-7xl mx-auto">
                {renderActiveScreen()}
              </div>
            </main>

            {/* Mobile Bottom Navigation Bar (Phones and portrait tablets) */}
            <MobileBottomNav
              currentScreen={currentScreen}
              onSelectScreen={setCurrentScreen}
              onOpenMenu={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Screen Quick-Jump Modal */}
      <PresentationNavigatorModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
      />

      {/* Presentation Speaker Narrative Guide Modal */}
      <PresentationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
      />

      {/* Role & Permissions Simulator Modal with Credentials & Screen Matrix */}
      <RoleSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectCollaborator}
        onNavigateToScreen={(screen) => {
          setCurrentScreen(screen);
          setIsSimulatorModalOpen(false);
        }}
      />
    </div>
  );
}
