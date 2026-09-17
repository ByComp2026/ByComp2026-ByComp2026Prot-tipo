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
  Check
} from 'lucide-react';
import {
  ALL_COLLABORATORS,
  INITIAL_ORGANIZATIONAL_SECTORS,
  ORGANIZATIONAL_AREAS,
  ROLE_DEFINITIONS
} from '../../data/mockData';
import { Collaborator, UserRole, OrganizationalSector } from '../../types';

export const CollaboratorsView: React.FC = () => {
  // Local state for collaborators and sectors so additions and modifications persist in this session
  const [collaborators, setCollaborators] = useState<Collaborator[]>(ALL_COLLABORATORS);
  const [sectors, setSectors] = useState<OrganizationalSector[]>(INITIAL_ORGANIZATIONAL_SECTORS);

  // Active view tab: 'hierarchy' (grouped by the 4 roles in exact order), 'sectors' (organizational areas), or 'rbac_matrix'
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'sectors' | 'rbac_matrix'>('hierarchy');

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

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRoleTitle, setNewUserRoleTitle] = useState('Analista de TI');
  const [newUserAccessRole, setNewUserAccessRole] = useState<UserRole>('COLABORADOR');
  const [newUserArea, setNewUserArea] = useState<string>('SUPORTE');
  const [newUserSector, setNewUserSector] = useState<string>('N1');
  const [newUserPhone, setNewUserPhone] = useState('(11) 98877-0000');

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
  // 1. SUPER ADMINISTRADOR
  // 2. ADMINISTRATIVO
  // 3. GESTOR
  // 4. COLABORADOR
  const superAdmins = filtered.filter(c => c.userRole === 'SUPER_ADMIN');
  const administratives = filtered.filter(c => c.userRole === 'ADMINISTRATIVO');
  const gestores = filtered.filter(c => c.userRole === 'GESTOR');
  const colaboradores = filtered.filter(c => c.userRole === 'COLABORADOR' || !c.userRole);

  // Handler: Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEmail = newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@bycomp.com.br`;

    const newUser: Collaborator = {
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
      isBlocked: false
    };

    setCollaborators([newUser, ...collaborators]);
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`✓ Usuário ${newUser.name} cadastrado com perfil ${newUserAccessRole}.`);
  };

  // Handler: Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setCollaborators(collaborators.map(c => (c.id === editingUser.id ? editingUser : c)));
    showToast(`✓ Dados de ${editingUser.name} atualizados com sucesso.`);
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
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Gestão de Usuários, Papéis & Estrutura Organizacional
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Hierarquia oficial de acessos: <strong className="text-purple-400">Super Administrador</strong> • <strong className="text-sky-400">Administrativo</strong> • <strong className="text-emerald-400">Gestor</strong> • <strong className="text-slate-300">Colaborador</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total: <strong className="text-white">{collaborators.length} usuários</strong></span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Setores: <strong className="text-white">{sectors.length} cadastrados</strong></span>
            </span>
            <span className="flex items-center gap-1.5 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800 text-purple-300">
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>Super Admin: <strong className="text-white">Victor Estevão</strong></span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Criar Usuário & Criar Setor */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewSectorModalOpen(true)}
            id="btn-cadastrar-novo-setor"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>+ Cadastrar Setor</span>
          </button>

          <button
            onClick={() => setIsNewUserModalOpen(true)}
            id="btn-novo-usuario"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Usuário</span>
          </button>
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

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('hierarchy')}
          id="tab-hierarquia-usuarios"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Hierarquia de Usuários (Ordem Oficial)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
            {filtered.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          id="tab-estrutura-setores"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

        <button
          onClick={() => setActiveTab('rbac_matrix')}
          id="tab-matriz-permissoes"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                      <span>ADMINISTRATIVO</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-300 border border-sky-700 font-mono">
                        {administratives.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Cadastro de colaboradores, documentos, formulários, planilhas, agenda, ponto e relatórios
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
                      <span>GESTOR</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-mono">
                        {gestores.length} usuário(s)
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Acompanha sua equipe, tarefas, Kanban, produtividade e SLA. <em>Sem acesso automático a outros setores.</em>
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

      {/* VIEW TAB 2: ESTRUTURA ORGANIZACIONAL (SUPORTE, DESENVOLVIMENTO, SEGURANÇA, DADOS, ADMINISTRATIVO) */}
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
            const totalMembers = areaSectors.reduce((acc, s) => {
              const membersCount = collaborators.filter((c) => c.sector === s.name || c.area === areaName).length;
              return acc + (s.collaboratorsCount || membersCount);
            }, 0);

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
                        className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-cyan-500/50 transition-all shadow-sm group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {sec.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              SLA {sec.slaTarget || '99.0%'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {sec.description || 'Setor técnico operacional'}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Líder Responsável:</span>
                            <span className="font-semibold text-slate-200">
                              {sec.leaderName || 'A definir'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-400">
                            <span>Integrantes Ativos:</span>
                            <span className="font-mono text-cyan-400 font-bold">
                              {sectorCollaborators.length > 0 ? sectorCollaborators.length : sec.collaboratorsCount} membros
                            </span>
                          </div>

                          {/* Avatars Preview */}
                          <div className="flex items-center gap-1 pt-1">
                            {sectorCollaborators.slice(0, 4).map((m) => (
                              <img
                                key={m.id}
                                src={m.avatar}
                                alt={m.name}
                                title={`${m.name} (${m.role})`}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                              />
                            ))}
                            {sectorCollaborators.length > 4 && (
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] text-slate-300 flex items-center justify-center font-mono">
                                +{sectorCollaborators.length - 4}
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

      {/* VIEW TAB 3: MATRIZ DE PERMISSÕES (RBAC) */}
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

      {/* MODAL: + NOVO USUÁRIO */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Criar Novo Usuário / Colaborador
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
                    Telefone / WhatsApp
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
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO (Pessoas, Docs, Planilhas)</option>
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
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Cadastrar Usuário
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
                Editar Usuário: {editingUser.name}
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
                  Perfil de Acesso
                </label>
                <select
                  value={editingUser.userRole || 'COLABORADOR'}
                  onChange={(e) => setEditingUser({ ...editingUser, userRole: e.target.value as UserRole })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="SUPER_ADMIN">SUPER ADMINISTRADOR</option>
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                  <option value="GESTOR">GESTOR</option>
                  <option value="COLABORADOR">COLABORADOR</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Área
                  </label>
                  <select
                    value={editingUser.area || 'SUPORTE'}
                    onChange={(e) => setEditingUser({ ...editingUser, area: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ORGANIZATIONAL_AREAS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Setor
                  </label>
                  <select
                    value={editingUser.sector}
                    onChange={(e) => setEditingUser({ ...editingUser, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {sectors.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
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

      {/* MODAL: DEFINIR PERMISSÕES ESPECÍFICAS */}
      {permissionsUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Definir Permissões: {permissionsUser.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Perfil atual: <strong className="text-cyan-300">{permissionsUser.userRole || 'COLABORADOR'}</strong> • Setor: {permissionsUser.sector}
                </p>
              </div>
              <button
                onClick={() => setPermissionsUser(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Abaixo estão as permissões herdadas do perfil e customizações individuais:
              </p>

              <div className="space-y-2">
                {[
                  'Visualizar todos os setores',
                  'Criar e editar usuários',
                  'Bloquear usuários',
                  'Criar novos setores organizacionais',
                  'Visualizar todos os Kanbans da empresa',
                  'Visualizar registros de ponto de outras equipes',
                  'Acessar relatórios executivos',
                  'Acessar logs de auditoria do sistema',
                  'Configurar integrações (WhatsApp, IA, Redes)',
                  'Acessar configurações gerais'
                ].map((perm, idx) => {
                  const isRoleSuper = permissionsUser.userRole === 'SUPER_ADMIN';
                  const isRoleAdmin = permissionsUser.userRole === 'ADMINISTRATIVO';
                  const isAllowedByDefault =
                    isRoleSuper ||
                    (isRoleAdmin && idx < 6) ||
                    (!isRoleSuper && !isRoleAdmin && idx >= 4 && idx <= 5);

                  return (
                    <label
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer"
                    >
                      <span className="text-xs text-slate-300">{perm}</span>
                      <input
                        type="checkbox"
                        defaultChecked={isAllowedByDefault}
                        disabled={isRoleSuper}
                        className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPermissionsUser(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`✓ Permissões de ${permissionsUser.name} atualizadas.`);
                  setPermissionsUser(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper render of user card with full actions (Editar, Bloquear, Permissões)
  function renderUserCard(c: Collaborator) {
    const meta = getRoleBadge(c.userRole);
    const RoleIcon = meta.icon;
    const isVictor = c.name.toLowerCase().includes('victor estevão');

    return (
      <div
        key={c.id}
        id={`colab-card-${c.id}`}
        className={`p-4 rounded-2xl bg-slate-900/90 border transition-all shadow-md flex flex-col justify-between space-y-3 group ${
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
          <div className="flex items-center gap-1">
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
