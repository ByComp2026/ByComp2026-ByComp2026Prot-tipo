import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  CheckSquare,
  Shield,
  Filter,
  Building2,
  Lock,
  Unlock,
  Edit3,
  Sliders,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Briefcase,
  Layers,
  Crown,
  UserCog,
  Check,
  Network,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Download,
  ShieldAlert,
  Sparkles,
  Key,
  DollarSign,
  Stethoscope,
  HeartPulse,
  Clock,
  BadgeCheck,
  AlertTriangle,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  ALL_COLLABORATORS,
  INITIAL_ORGANIZATIONAL_SECTORS,
  ORGANIZATIONAL_AREAS,
  ROLE_DEFINITIONS,
  CURRENT_USER
} from '../../data/mockData';
import { AUTH_ACCOUNTS, convertCredentialToCollaborator } from '../../data/authCredentials';
import { Collaborator, UserRole, OrganizationalSector, ViewScreen } from '../../types';
import { exportHierarchyToExcel, exportPrivateHRDossierToExcel } from '../../utils/excelExport';
import { PrivateAccessLock } from './collaborators/PrivateAccessLock';
import { HRDossierTab } from './collaborators/HRDossierTab';
import { CollaboratorDetailDrawer } from './collaborators/CollaboratorDetailDrawer';

interface CollaboratorsViewProps {
  onNavigate?: (screen: ViewScreen) => void;
  currentUser?: Collaborator;
  onSwitchUser?: (user: Collaborator) => void;
  onOpenSimulatorModal?: () => void;
}

// Helper to ensure all 48 collaborators have authentic HR data
function enrichCollaboratorWithHRData(c: Collaborator, index: number): Collaborator {
  let contractType: 'CLT' | 'PJ' | 'Estágio' = 'CLT';
  let salaryBracket = 'R$ 4.200 - R$ 5.800';
  let workSchedule = '40h semanais (08h às 17h)';
  let asoStatus: 'Em dia' | 'A renovar' | 'Pendente' = 'Em dia';
  let benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica Especial', 'Seguro de Vida MetLife'];

  if (c.userRole === 'SUPER_ADMIN') {
    contractType = 'PJ';
    salaryBracket = 'R$ 24.500,00';
    workSchedule = 'Dedicação Exclusiva / Diretoria';
    benefits = ['Seguro Executivo D&O', 'Plano Black Saúde', 'Reembolso Combustível'];
  } else if (c.userRole === 'ADMINISTRATIVO') {
    contractType = 'CLT';
    salaryBracket = 'R$ 13.800,00';
    workSchedule = '40h semanais (08h às 17h)';
    benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica Especial', 'Previdência Privada', 'Auxílio Creche'];
  } else if (c.userRole === 'GESTOR') {
    contractType = index % 3 === 0 ? 'PJ' : 'CLT';
    salaryBracket = 'R$ 11.200 - R$ 14.500';
    workSchedule = '40h semanais (09h às 18h)';
    benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica Especial', 'Gympass', 'Auxílio Certificação'];
  } else {
    // Colaborador
    if (c.role.toLowerCase().includes('estagiário') || c.role.toLowerCase().includes('estágio')) {
      contractType = 'Estágio';
      salaryBracket = 'R$ 2.100,00';
      workSchedule = '30h semanais (09h às 15h)';
      benefits = ['VR R$ 30/dia', 'VT', 'Seguro de Vida'];
    } else if (
      c.role.toLowerCase().includes('n3') ||
      c.role.toLowerCase().includes('dba') ||
      c.role.toLowerCase().includes('security') ||
      c.role.toLowerCase().includes('senior')
    ) {
      contractType = 'CLT';
      salaryBracket = 'R$ 8.900 - R$ 11.500';
      workSchedule = '40h semanais (Escala 5x2)';
      benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica', 'Bradesco Dental', 'Seguro de Vida'];
    } else if (c.role.toLowerCase().includes('n2') || c.role.toLowerCase().includes('pleno')) {
      contractType = 'CLT';
      salaryBracket = 'R$ 5.800 - R$ 7.200';
      workSchedule = '40h semanais (08h às 17h)';
      benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica', 'Bradesco Dental'];
    } else {
      contractType = 'CLT';
      salaryBracket = 'R$ 3.800 - R$ 4.600';
      workSchedule = '40h semanais (Escala 5x2)';
      benefits = ['VR R$ 45/dia', 'VT', 'Plano SulAmérica', 'Bradesco Dental'];
    }
  }

  // 2 collaborateurs with ASO expiring soon for realistic management
  if (index === 5 || index === 14) {
    asoStatus = 'A renovar';
  }

  return {
    ...c,
    contractType: c.contractType || contractType,
    salaryBracket: c.salaryBracket || salaryBracket,
    workSchedule: c.workSchedule || workSchedule,
    asoStatus: c.asoStatus || asoStatus,
    benefits: c.benefits || benefits,
    cpfMasked:
      c.cpfMasked ||
      `***.${String(100 + ((index * 17) % 900)).padStart(3, '0')}.${String(
        200 + ((index * 23) % 900)
      ).padStart(3, '0')}-**`,
    emergencyContact: c.emergencyContact || `(11) 98711-${String(1000 + index)}`
  };
}

export const CollaboratorsView: React.FC<CollaboratorsViewProps> = ({
  onNavigate,
  currentUser = CURRENT_USER,
  onSwitchUser,
  onOpenSimulatorModal
}) => {
  // Local state for collaborators initialized with enriched HR data
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    return ALL_COLLABORATORS.map((c, idx) => enrichCollaboratorWithHRData(c, idx));
  });

  const [sectors, setSectors] = useState<OrganizationalSector[]>(INITIAL_ORGANIZATIONAL_SECTORS);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'rh_dossier' | 'sectors' | 'rbac_matrix'>('hierarchy');

  // Selected collaborator for full private drawer dossier
  const [selectedUserDetail, setSelectedUserDetail] = useState<Collaborator | null>(null);

  // Filters
  const [selectedRole, setSelectedRole] = useState<string>('TODOS');
  const [selectedArea, setSelectedArea] = useState<string>('TODOS');
  const [selectedSector, setSelectedSector] = useState<string>('TODOS');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isNewSectorModalOpen, setIsNewSectorModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Collaborator | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<Collaborator | null>(null);

  // New user form state with HR fields
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRoleTitle, setNewUserRoleTitle] = useState('Analista de TI');
  const [newUserAccessRole, setNewUserAccessRole] = useState<UserRole>('COLABORADOR');
  const [newUserArea, setNewUserArea] = useState<string>('SUPORTE');
  const [newUserSector, setNewUserSector] = useState<string>('N1');
  const [newUserPhone, setNewUserPhone] = useState('(11) 98877-0000');
  const [newUserContractType, setNewUserContractType] = useState<'CLT' | 'PJ' | 'Estágio'>('CLT');
  const [newUserSalaryBracket, setNewUserSalaryBracket] = useState('R$ 4.800,00');

  // New sector form state
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorArea, setNewSectorArea] = useState<string>('SUPORTE');
  const [newSectorLeader, setNewSectorLeader] = useState('Mariana Castro');
  const [newSectorSla, setNewSectorSla] = useState('99.5%');
  const [newSectorDescription, setNewSectorDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // CHECK ACCESS POLICY: Somente Gestão, Administração e RH
  const activeUserRole = currentUser?.userRole || 'COLABORADOR';
  const isAllowed =
    activeUserRole === 'SUPER_ADMIN' ||
    activeUserRole === 'ADMINISTRATIVO' ||
    activeUserRole === 'GESTOR';

  // If role is COLABORADOR, render the defense-in-depth security block screen
  if (!isAllowed) {
    return (
      <PrivateAccessLock
        currentUser={currentUser}
        onSwitchUser={onSwitchUser}
        onNavigate={onNavigate}
      />
    );
  }

  // Helper for Role metadata
  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          label: 'SUPER ADMINISTRADOR',
          badgeClass: 'bg-purple-950/80 border-purple-600/60 text-purple-300 font-bold',
          icon: Crown
        };
      case 'ADMINISTRATIVO':
        return {
          label: 'ADMINISTRATIVO',
          badgeClass: 'bg-sky-950/80 border-sky-600/60 text-sky-300 font-bold',
          icon: UserCog
        };
      case 'GESTOR':
        return {
          label: 'GESTOR',
          badgeClass: 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300 font-bold',
          icon: Shield
        };
      case 'COLABORADOR':
      default:
        return {
          label: 'COLABORADOR',
          badgeClass: 'bg-slate-800/90 border-slate-700 text-slate-300',
          icon: Users
        };
    }
  };

  // Filtered collaborators
  const filtered = collaborators.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase());

    const matchRole = selectedRole === 'TODOS' || c.userRole === selectedRole;
    const matchArea = selectedArea === 'TODOS' || c.area === selectedArea;
    const matchSector = selectedSector === 'TODOS' || c.sector === selectedSector;

    return matchSearch && matchRole && matchArea && matchSector;
  });

  // Grouped by userRole in exact order requested by user:
  const superAdmins = filtered.filter(c => c.userRole === 'SUPER_ADMIN');
  const administratives = filtered.filter(c => c.userRole === 'ADMINISTRATIVO');
  const gestores = filtered.filter(c => c.userRole === 'GESTOR');
  const colaboradores = filtered.filter(c => c.userRole === 'COLABORADOR' || !c.userRole);

  // Export full hierarchy to Excel
  const handleExportHierarchyExcel = () => {
    exportHierarchyToExcel(collaborators, sectors);
    showToast('✓ Arquitetura funcional e colaboradores exportados com sucesso em Excel (.xlsx)!');
  };

  // Handler: Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEmail = newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@bycomp.com.br`;

    const newUser: Collaborator = enrichCollaboratorWithHRData(
      {
        id: `colab-${Date.now()}`,
        name: newUserName || 'Novo Usuário',
        role: newUserRoleTitle,
        userRole: newUserAccessRole,
        area: newUserArea,
        sector: newUserSector,
        email: formattedEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'Em atividade',
        tasksCount: 1,
        currentTask: 'Integração ao sistema corporativo ByComp',
        phone: newUserPhone,
        admissionDate: '16/09/2026',
        isBlocked: false,
        contractType: newUserContractType,
        salaryBracket: newUserSalaryBracket
      },
      collaborators.length
    );

    setCollaborators([newUser, ...collaborators]);
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`✓ Usuário ${newUser.name} cadastrado com perfil ${newUserAccessRole} e dados de RH salvos.`);
  };

  // Handler: Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setCollaborators(collaborators.map(c => (c.id === editingUser.id ? editingUser : c)));
    showToast(`✓ Dados cadastrais e contratuais de ${editingUser.name} atualizados com sucesso.`);
    setEditingUser(null);
  };

  // Handler: Toggle Block / Unblock
  const handleToggleBlock = (user: Collaborator) => {
    const willBlock = !user.isBlocked;
    const updatedUser: Collaborator = {
      ...user,
      isBlocked: willBlock,
      status: willBlock ? 'Bloqueado' : 'Em atividade'
    };

    setCollaborators(collaborators.map(c => (c.id === user.id ? updatedUser : c)));
    showToast(
      willBlock
        ? `⚠️ Acesso de ${user.name} foi BLOQUEADO com sucesso no sistema.`
        : `✓ Acesso de ${user.name} foi DESBLOQUEADO.`
    );
  };

  // Handler: Create Sector
  const handleCreateSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorName.trim()) return;

    const newSec: OrganizationalSector = {
      id: `sec-${Date.now()}`,
      name: newSectorName.trim(),
      area: newSectorArea,
      leaderName: newSectorLeader || 'A definir',
      collaboratorsCount: 0,
      slaTarget: newSectorSla || '99.0%',
      description: newSectorDescription || 'Novo setor cadastrado na arquitetura corporativa',
      isCustom: true
    };

    setSectors([...sectors, newSec]);
    setIsNewSectorModalOpen(false);
    setNewSectorName('');
    setNewSectorDescription('');
    showToast(`✓ Setor "${newSec.name}" criado com sucesso na área ${newSec.area}!`);
  };

  // Unique list of sectors from current sectors state
  const availableSectorsForArea = sectors.filter(
    s => newUserArea === 'TODOS' || s.area === newUserArea
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header: FASE 4 PRIVADA (Gestão, Administração & RH) */}
      <div className="bg-slate-900/90 border border-emerald-800/60 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-400 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Colaboradores: Quadro Funcional & Dossiê RH
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300">
                    FASE 4 • TELA PRIVADA
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    LGPD COMPLIANT • ART. 46
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Acesso restrito autorizado para <strong className="text-emerald-400">Gestão</strong>,{' '}
                  <strong className="text-sky-400">Administração</strong> e{' '}
                  <strong className="text-purple-400">RH</strong>. Prontuários funcionais, dados contratuais e governança RBAC.
                </p>
              </div>
            </div>

            {/* Current Operator & Confidentiality Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-3.5">
              {/* Operator info */}
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <span className="text-slate-300">
                  Operador: <strong className="text-white">{currentUser?.name}</strong>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentUser?.userRole}
                </span>
              </div>

              {/* Total Colabs */}
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{collaborators.length} colaboradores monitorados</span>
              </span>

              {/* Setores */}
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{sectors.length} setores ativos</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Exportar Excel, Cadastrar Setor, Novo Usuário */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigate && (
              <button
                onClick={() => onNavigate('organograma')}
                id="btn-colab-to-organograma"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 font-bold text-xs shadow-md transition-all cursor-pointer"
                title="Acessar Árvore Hierárquica e Organograma (Fase 3)"
              >
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fase 3: Organograma</span>
              </button>
            )}

            <button
              onClick={handleExportHierarchyExcel}
              id="btn-exportar-hierarquia-excel"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Baixar lista funcional em Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar (.xlsx)</span>
            </button>

            <button
              onClick={() => setIsNewSectorModalOpen(true)}
              id="btn-cadastrar-novo-setor"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Setor</span>
            </button>

            <button
              onClick={() => setIsNewUserModalOpen(true)}
              id="btn-novo-usuario"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Colaborador</span>
            </button>
          </div>
        </div>

        {/* Persona Quick Switcher for Stakeholder Demonstration */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
          <div className="flex items-center gap-2 text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Testar Permissões (Demonstração):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {AUTH_ACCOUNTS.map((acc) => {
              const isActive = currentUser?.email === acc.email;
              const isColabBlocked = acc.role === 'COLABORADOR';

              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    if (onSwitchUser) {
                      onSwitchUser(convertCredentialToCollaborator(acc));
                      showToast(`✓ Perfil alternado para: ${acc.name} (${acc.role})`);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isColabBlocked
                      ? 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60'
                      : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700'
                  }`}
                  title={
                    isColabBlocked
                      ? 'Testar bloqueio de tela com usuário Colaborador'
                      : `Acessar como ${acc.name} (${acc.roleLabel})`
                  }
                >
                  {isColabBlocked ? (
                    <Lock className="w-3 h-3 text-rose-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                  <span>{acc.name.split(' ')[0]}</span>
                  <span className="text-[9px] opacity-75">
                    ({acc.role === 'ADMINISTRATIVO' ? 'RH/Adm' : acc.role === 'SUPER_ADMIN' ? 'Admin' : acc.role === 'GESTOR' ? 'Gestor' : 'Colab 🚫'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs Navigation (4 TABS) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {/* Tab 1: Hierarquia de Usuários */}
        <button
          onClick={() => setActiveTab('hierarchy')}
          id="tab-hierarquia-usuarios"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'hierarchy'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Hierarquia Oficial de Usuários</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
            {filtered.length}
          </span>
        </button>

        {/* Tab 2: Dossiê RH & Dados Contratuais (NOVA FASE 4) */}
        <button
          onClick={() => setActiveTab('rh_dossier')}
          id="tab-dossie-rh"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'rh_dossier'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dossiê RH & Dados Contratuais (Privado)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
            EXCLUSIVO RH
          </span>
        </button>

        {/* Tab 3: Estrutura Organizacional & Setores */}
        <button
          onClick={() => setActiveTab('sectors')}
          id="tab-estrutura-setores"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'sectors'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Estrutura Organizacional & Setores</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
            {sectors.length}
          </span>
        </button>

        {/* Tab 4: Matriz de Permissões (RBAC) */}
        <button
          onClick={() => setActiveTab('rbac_matrix')}
          id="tab-matriz-permissoes"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'rbac_matrix'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Matriz de Permissões (RBAC)</span>
        </button>
      </div>

      {/* VIEW TAB 1: HIERARQUIA DE USUÁRIOS (SUPER ADMIN -> ADMINISTRATIVO -> GESTOR -> COLABORADOR) */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar por nome, cargo, e-mail ou setor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              {/* Role filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                  <Crown className="w-3 h-3 text-purple-400" />
                  Perfil:
                </span>
                {['TODOS', 'SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'].map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedRole === roleKey
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {roleKey === 'TODOS'
                      ? 'Todos'
                      : roleKey === 'SUPER_ADMIN'
                      ? 'Super Admin'
                      : roleKey === 'ADMINISTRATIVO'
                      ? 'Administrativo'
                      : roleKey === 'GESTOR'
                      ? 'Gestor'
                      : 'Colaborador'}
                  </button>
                ))}
              </div>

              {/* Area filter */}
              <div className="flex items-center gap-1.5 flex-wrap border-l border-slate-800 pl-3">
                <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-400" />
                  Área:
                </span>
                {['TODOS', ...ORGANIZATIONAL_AREAS].map((areaKey) => (
                  <button
                    key={areaKey}
                    onClick={() => setSelectedArea(areaKey)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedArea === areaKey
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {areaKey}
                  </button>
                ))}
              </div>

              {/* Clear filters if active */}
              {(selectedRole !== 'TODOS' || selectedArea !== 'TODOS' || search !== '') && (
                <button
                  onClick={() => {
                    setSelectedRole('TODOS');
                    setSelectedArea('TODOS');
                    setSearch('');
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium ml-auto cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* 1. SUPER ADMINISTRADOR SECTION */}
          {(selectedRole === 'TODOS' || selectedRole === 'SUPER_ADMIN') && superAdmins.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-300">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>SUPER ADMINISTRADOR</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700 font-mono">
                        {superAdmins.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Acesso completo ao sistema • Controle total de setores, usuários, kanbans, ponto, integrações e governança
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {superAdmins.map((user) => renderUserCard(user))}
              </div>
            </div>
          )}

          {/* 2. ADMINISTRATIVO SECTION */}
          {(selectedRole === 'TODOS' || selectedRole === 'ADMINISTRATIVO') && administratives.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-sky-900/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-800 text-sky-300">
                    <UserCog className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>ADMINISTRATIVO & RH</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-300 border border-sky-700 font-mono">
                        {administratives.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Gestão de colaboradores, formulários, espelho de ponto, planilhas mestras e cadastros de RH
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {administratives.map((user) => renderUserCard(user))}
              </div>
            </div>
          )}

          {/* 3. GESTOR SECTION */}
          {(selectedRole === 'TODOS' || selectedRole === 'GESTOR') && gestores.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>GESTOR (LÍDERES DE SETOR)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-mono">
                        {gestores.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Gestão do seu setor específico: Kanban da equipe, distribuição de chamados e aprovação de apontamentos
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gestores.map((user) => renderUserCard(user))}
              </div>
            </div>
          )}

          {/* 4. COLABORADOR SECTION */}
          {(selectedRole === 'TODOS' || selectedRole === 'COLABORADOR') && colaboradores.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>COLABORADOR</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {colaboradores.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Visualiza apenas suas informações, seu Kanban, suas tarefas, ponto, agenda e info compartilhada
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colaboradores.map((user) => renderUserCard(user))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 2: DOSSIÊ RH & DADOS CONTRATUAIS (FASE 4 PRIVADA) */}
      {activeTab === 'rh_dossier' && (
        <HRDossierTab
          collaborators={collaborators}
          onSelectCollaborator={(c) => setSelectedUserDetail(c)}
          showToast={showToast}
        />
      )}

      {/* VIEW TAB 3: ESTRUTURA ORGANIZACIONAL (11 SETORES) */}
      {activeTab === 'sectors' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Estrutura Oficial de Setores</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Organização por Áreas corporativas. Você pode cadastrar novos setores a qualquer momento.
              </p>
            </div>
            <button
              onClick={() => setIsNewSectorModalOpen(true)}
              id="btn-adicionar-setor-tab"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Setor</span>
            </button>
          </div>

          {/* Grouped by Area */}
          {ORGANIZATIONAL_AREAS.map((areaName) => {
            const areaSectors = sectors.filter((s) => s.area === areaName);

            return (
              <div
                key={areaName}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                    <h3 className="text-base font-bold text-white tracking-wide">{areaName}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {areaSectors.length} setores
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Área Corporativa ByComp
                  </span>
                </div>

                {/* Grid of Sectors in this Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areaSectors.map((sec) => {
                    const sectorCollaborators = collaborators.filter(
                      (c) => c.sector === sec.name
                    );

                    return (
                      <div
                        key={sec.id}
                        className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>Setor: {sec.name}</span>
                              {sec.isCustom && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                                  Custom
                                </span>
                              )}
                            </h4>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                              SLA: {sec.slaTarget}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-2">
                            {sec.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-850 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Líder / Gestor:</span>
                            <span className="font-semibold text-slate-200">{sec.leaderName}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Headcount Ativo:</span>
                            <span className="font-mono text-cyan-300 font-bold">
                              {sectorCollaborators.length} pessoa(s)
                            </span>
                          </div>

                          {/* Preview of members */}
                          <div className="flex items-center -space-x-1.5 pt-1 overflow-hidden">
                            {sectorCollaborators.slice(0, 5).map((colab) => (
                              <img
                                key={colab.id}
                                src={colab.avatar}
                                alt={colab.name}
                                title={`${colab.name} (${colab.role})`}
                                className="w-6 h-6 rounded-full ring-2 ring-slate-900 object-cover"
                              />
                            ))}
                            {sectorCollaborators.length > 5 && (
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900 font-mono">
                                +{sectorCollaborators.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW TAB 4: MATRIZ DE PERMISSÕES (RBAC) */}
      {activeTab === 'rbac_matrix' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Matriz Oficial de Controle de Acesso por Função (RBAC)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Definições de permissões estritas para conformidade com a governança da ByComp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROLE_DEFINITIONS.map((def) => {
              const meta = getRoleBadge(def.role);
              const IconComp = meta.icon;

              return (
                <div
                  key={def.role}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <IconComp className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          {def.label}
                        </h3>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}>
                        Nível {def.role === 'SUPER_ADMIN' ? '1 (Total)' : def.role === 'ADMINISTRATIVO' ? '2 (Operacional)' : def.role === 'GESTOR' ? '3 (Setorial)' : '4 (Individual)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 font-medium">
                      {def.description}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Permissões e Ações Autorizadas:
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {def.allowedActions.map((action, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-850"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {def.role === 'GESTOR' && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Restrição: Não possui acesso automático aos dados de outros setores.</span>
                    </div>
                  )}

                  {def.role === 'COLABORADOR' && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Restrição: Visualiza apenas seus próprios registros e tarefas atribuídas.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: + NOVO COLABORADOR / USUÁRIO (com campos de RH) */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Criar Novo Usuário / Cadastro de Pessoal
              </h3>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gabriela Costa"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    placeholder="gabriela.costa@bycomp.com.br"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefone / Ramal
                  </label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargo Profissional
                </label>
                <input
                  type="text"
                  value={newUserRoleTitle}
                  onChange={(e) => setNewUserRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Perfil de Acesso (RBAC) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Perfil de Acesso (Hierarquia Oficial)
                </label>
                <select
                  value={newUserAccessRole}
                  onChange={(e) => setNewUserAccessRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="SUPER_ADMIN">SUPER ADMINISTRADOR (Acesso total)</option>
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO (Pessoas, Docs, Planilhas & RH)</option>
                  <option value="GESTOR">GESTOR (Equipe, tarefas e SLA do setor)</option>
                  <option value="COLABORADOR">COLABORADOR (Acesso individual)</option>
                </select>
              </div>

              {/* Área e Setor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Área Organizacional
                  </label>
                  <select
                    value={newUserArea}
                    onChange={(e) => {
                      setNewUserArea(e.target.value);
                      const available = sectors.filter(s => s.area === e.target.value);
                      if (available.length > 0) {
                        setNewUserSector(available[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ORGANIZATIONAL_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Setor
                  </label>
                  <select
                    value={newUserSector}
                    onChange={(e) => setNewUserSector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {availableSectorsForArea.map(sec => (
                      <option key={sec.id} value={sec.name}>{sec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dados de RH: Regime e Faixa Salarial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Regime de Contratação (RH)
                  </label>
                  <select
                    value={newUserContractType}
                    onChange={(e) => setNewUserContractType(e.target.value as 'CLT' | 'PJ' | 'Estágio')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CLT">CLT (Consolidação das Leis do Trabalho)</option>
                    <option value="PJ">PJ (Pessoa Jurídica)</option>
                    <option value="Estágio">Estágio Corporativo (Lei 11.788)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Remuneração Base / Faixa Salarial
                  </label>
                  <input
                    type="text"
                    value={newUserSalaryBracket}
                    onChange={(e) => setNewUserSalaryBracket(e.target.value)}
                    placeholder="Ex: R$ 5.800,00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Cadastrar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: + CADASTRAR NOVO SETOR */}
      {isNewSectorModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Cadastrar Novo Setor Organizacional
              </h3>
              <button
                onClick={() => setIsNewSectorModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSector} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Área Matriz
                </label>
                <select
                  value={newSectorArea}
                  onChange={(e) => setNewSectorArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {ORGANIZATIONAL_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Setor (Ex: N4, Mobile, Cloud Ops, QA, Auditoria)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cloud Ops & DevOps"
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Líder / Gestor
                  </label>
                  <input
                    type="text"
                    value={newSectorLeader}
                    onChange={(e) => setNewSectorLeader(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta de SLA
                  </label>
                  <input
                    type="text"
                    value={newSectorSla}
                    onChange={(e) => setNewSectorSla(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descrição do Setor
                </label>
                <textarea
                  rows={2}
                  value={newSectorDescription}
                  onChange={(e) => setNewSectorDescription(e.target.value)}
                  placeholder="Responsabilidade e escopo operacional do setor..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSectorModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Setor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR USUÁRIO */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Editar Colaborador / Usuário
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Setor
                  </label>
                  <input
                    type="text"
                    value={editingUser.sector}
                    onChange={(e) => setEditingUser({ ...editingUser, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEFINIR PERMISSÕES (RBAC) */}
      {permissionsUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Nível de Acesso (RBAC)
              </h3>
              <button
                onClick={() => setPermissionsUser(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <img
                src={permissionsUser.avatar}
                alt={permissionsUser.name}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div>
                <p className="font-bold text-xs text-white">{permissionsUser.name}</p>
                <p className="text-[11px] text-slate-400">{permissionsUser.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Selecione o Papel Oficial:
              </label>

              {(['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'] as UserRole[]).map((role) => {
                const meta = getRoleBadge(role);
                const isSelected = permissionsUser.userRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      const updated = { ...permissionsUser, userRole: role };
                      setCollaborators(collaborators.map(c => (c.id === updated.id ? updated : c)));
                      setPermissionsUser(null);
                      showToast(`✓ Perfil de ${updated.name} alterado para ${role}.`);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{meta.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {role === 'SUPER_ADMIN'
                          ? 'Acesso irrestrito a todas as 24 telas e configurações'
                          : role === 'ADMINISTRATIVO'
                          ? 'Gestão de pessoas, chamados gerais, planilhas e relatórios'
                          : role === 'GESTOR'
                          ? 'Visão do Kanban de equipe, apontamentos e SLAs do setor'
                          : 'Acesso restrito ao próprio Kanban, tarefas e ponto'}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: PRONTUÁRIO COMPLETO DO COLABORADOR (DOSSIÊ PRIVADO) */}
      <CollaboratorDetailDrawer
        collaborator={selectedUserDetail}
        onClose={() => setSelectedUserDetail(null)}
        onToggleBlock={handleToggleBlock}
        showToast={showToast}
      />
    </div>
  );

  // Sub-render: Individual user card for the hierarchy view
  function renderUserCard(c: Collaborator) {
    const meta = getRoleBadge(c.userRole);
    const isVictor = c.id === 'colab-1';

    return (
      <div
        key={c.id}
        onClick={() => setSelectedUserDetail(c)}
        className={`bg-slate-900/90 border rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.01] hover:shadow-xl group flex flex-col justify-between cursor-pointer ${
          c.isBlocked
            ? 'border-rose-900/70 bg-rose-950/10'
            : isVictor
            ? 'border-purple-600/60 ring-1 ring-purple-500/20'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={c.avatar}
              alt={c.name}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                c.isBlocked
                  ? 'bg-rose-500'
                  : c.status === 'Em atividade'
                  ? 'bg-emerald-500'
                  : 'bg-slate-600'
              }`}
            ></span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {c.name}
              </h3>
              {isVictor && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                  Super Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.role}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${meta.badgeClass}`}>
                {meta.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {c.sector}
              </span>
            </div>
          </div>
        </div>

        {/* Current task or block warning */}
        <div className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-xl border border-slate-850 truncate">
          {c.isBlocked ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" />
              Acesso temporariamente bloqueado
            </span>
          ) : (
            <span className="truncate block">
              <strong className="text-slate-300">Tarefa:</strong> {c.currentTask}
            </span>
          )}
        </div>

        {/* Card Footer: Status & Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1 text-[11px]">
          <span
            className={`font-semibold flex items-center gap-1 ${
              c.isBlocked
                ? 'text-rose-400'
                : c.status === 'Em atividade'
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            <span>
              {c.isBlocked
                ? '🔴 Bloqueado'
                : c.status === 'Em atividade'
                ? '🟢 Ativo'
                : '⚪ Ausente'}
            </span>
          </span>

          {/* Action Icons: Edit, Block/Unblock, Permissions */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEditingUser(c)}
              title="Editar usuário"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPermissionsUser(c)}
              title="Definir permissões de acesso"
              className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {!isVictor && (
              <button
                onClick={() => handleToggleBlock(c)}
                title={c.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  c.isBlocked
                    ? 'text-emerald-400 hover:bg-emerald-950/60'
                    : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                }`}
              >
                {c.isBlocked ? (
                  <Unlock className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};
