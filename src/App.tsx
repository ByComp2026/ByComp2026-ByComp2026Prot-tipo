import React, { useState, useEffect } from 'react';
import { ViewScreen, Collaborator, UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PresentationNavigatorModal } from './components/PresentationNavigatorModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';

// 22 Screen Views
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { FormsView } from './components/views/FormsView';
import { SmartSpreadsheetView } from './components/views/SmartSpreadsheetView';
import { AgendaView } from './components/views/AgendaView';
import { MyKanbanView } from './components/views/MyKanbanView';
import { TeamKanbanView } from './components/views/TeamKanbanView';
import { WeeklyPlanningView } from './components/views/WeeklyPlanningView';
import { ActivityRegisterView } from './components/views/ActivityRegisterView';
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
import { RoleSimulatorModal } from './components/RoleSimulatorModal';
import { checkScreenAccess } from './data/authCredentials';
import { Presentation, BookOpen, ChevronRight, ChevronLeft, ShieldAlert, Lock, Crown, Key, Sparkles, Shield } from 'lucide-react';

const HIERARCHY_PERSONAS: Record<UserRole, Collaborator> = {
  SUPER_ADMIN: {
    id: 'user-victor',
    name: 'Victor Estevão',
    role: 'Tech Lead / Super Admin',
    sector: 'DESENVOLVIMENTO',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'victor.estevao@bycomp.com.br',
    phone: '(11) 99871-0001',
    admissionDate: '2021-01-10',
    status: 'Em atividade',
    currentTask: 'Supervisão Geral do Sistema & Arquitetura',
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
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('dashboard');
  const [currentUser, setCurrentUser] = useState<Collaborator>(HIERARCHY_PERSONAS.SUPER_ADMIN);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  const handleSwitchRole = (role: UserRole) => {
    if (HIERARCHY_PERSONAS[role]) {
      setCurrentUser(HIERARCHY_PERSONAS[role]);
    }
  };

  const handleSelectCollaborator = (user: Collaborator) => {
    setCurrentUser(user);
  };

  // Keyboard shortcut: Ctrl+K or Cmd+K opens quick navigator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
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
    'formularios',
    'planilhas',
    'agenda',
    'meu_kanban',
    'kanban_equipe',
    'visao_semanal',
    'registro_atividades',
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
    'visao_geral'
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

    // Centralized RBAC Security Enforcement across all 22 screens
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
      case 'formularios':
        return <FormsView />;
      case 'planilhas':
        return <SmartSpreadsheetView />;
      case 'agenda':
        return <AgendaView />;
      case 'meu_kanban':
        return <MyKanbanView />;
      case 'kanban_equipe':
        return <TeamKanbanView />;
      case 'visao_semanal':
        return <WeeklyPlanningView />;
      case 'registro_atividades':
        return <ActivityRegisterView />;
      case 'registro_ponto':
        return <TimeClockView />;
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
        return <TicketsView />;
      case 'equipamentos':
        return <EquipmentView />;
      case 'colaboradores':
        return <CollaboratorsView />;
      case 'auditoria':
        return <AuditLogView />;
      case 'visao_geral':
        return (
          <VisionOverviewView
            onNavigate={setCurrentScreen}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        );
      default:
        return <DashboardView onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      {currentScreen === 'login' ? (
        // Login View has its own self-contained corporate visual framing
        <div className="relative min-h-screen flex flex-col">
          {/* Subtle top banner during login to jump directly to other screens if presenter desires */}
          <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="font-mono text-cyan-300 font-semibold">ByComp Protótipo</span>
              <span className="hidden sm:inline text-slate-500">• Tela 1 de 22</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guia do Apresentador</span>
              </button>

              <button
                onClick={() => setIsNavModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Pular para qualquer tela</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {renderActiveScreen()}
          </div>
        </div>
      ) : (
        // Standard Corporate Master Layout for Screens 2 to 22
        <div className="flex h-screen overflow-hidden">
          {/* Main Sidebar */}
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
          />

          {/* Main Content Column */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Corporate Navbar */}
            <Navbar
              currentScreen={currentScreen}
              onSelectScreen={setCurrentScreen}
              onOpenQuickJump={() => setIsNavModalOpen(true)}
              onOpenGuide={() => setIsGuideModalOpen(true)}
              currentUser={currentUser}
              onSwitchUserRole={handleSwitchRole}
              onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
            />

            {/* Scrollable Work Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
              <div className="max-w-7xl mx-auto">
                {renderActiveScreen()}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Floating Pitch Navigation Bar (Always available for smooth live presentation) */}
      <div 
        id="floating-pitch-controls"
        className="fixed bottom-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 shadow-2xl flex items-center gap-2 animate-in fade-in"
      >
        <button
          onClick={() => prevScreen && setCurrentScreen(prevScreen)}
          disabled={!prevScreen}
          title={prevScreen ? `Voltar para ${prevScreen}` : 'Primeira tela'}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsNavModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Tela {currentScreenIndex + 1}/22</span>
        </button>

        <button
          onClick={() => setIsGuideModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Abrir Roteiro de Fala"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Roteiro</span>
        </button>

        <button
          onClick={() => setIsSimulatorModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Abrir Simulador de Usuários e Senhas RBAC"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">Senhas</span>
        </button>

        <button
          onClick={() => nextScreen && setCurrentScreen(nextScreen)}
          disabled={!nextScreen}
          title={nextScreen ? `Avançar para ${nextScreen}` : 'Última tela'}
          className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:pointer-events-none text-white shadow-md transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

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
