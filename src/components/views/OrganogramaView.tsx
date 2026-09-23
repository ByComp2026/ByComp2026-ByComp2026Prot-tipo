import React, { useState, useMemo, useEffect } from 'react';
import {
  Network,
  Users,
  Crown,
  Shield,
  UserCog,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Layers,
  Building2,
  Sparkles,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Eye,
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  X,
  Workflow,
  Check
} from 'lucide-react';
import { ALL_COLLABORATORS, INITIAL_ORGANIZATIONAL_SECTORS } from '../../data/mockData';
import { Collaborator, OrganizationalSector, UserRole, ViewScreen } from '../../types';
import { exportOrganogramaToExcel } from '../../utils/excelExport';
import { PrivateAccessLock } from './collaborators/PrivateAccessLock';
import { dbService } from '../../services/dbService';

interface OrganogramaViewProps {
  onNavigate?: (screen: ViewScreen) => void;
  currentUser?: Collaborator;
  onSwitchUser?: (user: Collaborator) => void;
}

export const OrganogramaView: React.FC<OrganogramaViewProps> = ({
  onNavigate,
  currentUser,
  onSwitchUser
}) => {
  // Verificação de acesso: GESTOR, ADMINISTRATIVO e SUPER_ADMIN
  const activeUserRole = currentUser?.userRole || 'COLABORADOR';
  const isAllowed =
    activeUserRole === 'SUPER_ADMIN' ||
    activeUserRole === 'ADMINISTRATIVO' ||
    activeUserRole === 'GESTOR';

  if (!isAllowed) {
    return (
      <PrivateAccessLock
        phaseNumber={3}
        currentUser={currentUser}
        onSwitchUser={onSwitchUser}
        onNavigate={onNavigate}
      />
    );
  }

  // Estados dos colaboradores e setores
  const [collaborators, setCollaborators] = useState<Collaborator[]>(ALL_COLLABORATORS);
  const [sectors, setSectors] = useState<OrganizationalSector[]>(INITIAL_ORGANIZATIONAL_SECTORS);

  // Sincronização em tempo real com o Firebase Firestore
  useEffect(() => {
    const unsubUsers = dbService.subscribeUsers((dbUsers) => {
      if (dbUsers && dbUsers.length > 0) {
        setCollaborators((prev) => {
          const map = new Map<string, Collaborator>();
          prev.forEach((c) => map.set(c.id, c));
          dbUsers.forEach((u) => {
            const existing = map.get(u.id);
            map.set(u.id, {
              id: u.id,
              name: u.name,
              role: u.role,
              userRole: u.userRole,
              area: u.area,
              sector: u.sector,
              email: u.email,
              avatar: u.avatar || existing?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              status: u.status,
              currentTask: u.currentTask || existing?.currentTask || 'Atividades operacionais ByComp',
              phone: u.phone,
              admissionDate: u.admissionDate || existing?.admissionDate || '16/09/2026',
              contractType: u.contractType || existing?.contractType || 'CLT',
              salaryBracket: u.salaryBracket || existing?.salaryBracket || 'R$ 4.800,00',
              workSchedule: u.workSchedule || existing?.workSchedule || '40h semanais',
              emergencyContact: u.emergencyContact || existing?.emergencyContact,
              cpfMasked: u.cpfMasked || existing?.cpfMasked,
              asoStatus: u.asoStatus || existing?.asoStatus || 'Em dia',
              benefits: u.benefits || existing?.benefits
            });
          });
          return Array.from(map.values());
        });
      }
    });

    const unsubSectors = dbService.subscribeSectors((dbSectors) => {
      if (dbSectors && dbSectors.length > 0) {
        setSectors(dbSectors);
      }
    });

    return () => {
      unsubUsers();
      unsubSectors();
    };
  }, []);

  // Aba ativa
  const [activeTab, setActiveTab] = useState<'arvore' | 'matriz_setores' | 'linha_comando' | 'simulador'>('arvore');

  // Filtros & pesquisa
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('TODOS');
  const [selectedRole, setSelectedRole] = useState<string>('TODOS');

  // Árvore interativa: setores expandidos
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({
    'N1': true,
    'N2': true,
    'N3': true,
    'Front-End': true,
    'Back-End': true,
    'Cyber Security': true,
    'DBA': true,
    'RH': true,
    'Financeiro': true,
    'Gestão': true,
    'Administrativo': true
  });

  // Colaborador selecionado no drawer lateral
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);

  // Seleção na linha de comando
  const [reportingSubjectId, setReportingSubjectId] = useState<string>('colab-1');

  // Estado do formulário do simulador
  const [simColabId, setSimColabId] = useState<string>(ALL_COLLABORATORS[1]?.id || 'colab-2');
  const [simNewSector, setSimNewSector] = useState<string>('Suporte N2');
  const [simNewRole, setSimNewRole] = useState<string>('Analista Sênior');
  const [simNewAccess, setSimNewAccess] = useState<UserRole>('GESTOR');
  const [simSuccessToast, setSimSuccessToast] = useState<string | null>(null);

  // Nível de Zoom para a árvore (80% a 130%)
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Notificação de exportação
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Definições de Macro-Áreas com cores alinhadas com o Dashboard
  const MACRO_AREAS = [
    {
      id: 'SUPORTE',
      name: 'Operações de TI & Suporte',
      sectors: ['N1', 'N2', 'N3'],
      color: 'border-slate-200 bg-slate-50/50 text-[#37558d]',
      badgeColor: 'bg-[#37558d]/10 text-[#37558d] border-[#37558d]/20',
      leader: 'Carlos Eduardo / Juliana Pires'
    },
    {
      id: 'DESENVOLVIMENTO',
      name: 'Engenharia de Software & Web',
      sectors: ['Front-End', 'Back-End'],
      color: 'border-slate-200 bg-slate-50/50 text-[#37558d]',
      badgeColor: 'bg-[#37558d]/10 text-[#37558d] border-[#37558d]/20',
      leader: 'Beatriz Lima / Rodrigo Fontes'
    },
    {
      id: 'SEGURANÇA',
      name: 'Cyber Security & Defesa Cibernética',
      sectors: ['Cyber Security'],
      color: 'border-slate-200 bg-slate-50/50 text-[#37558d]',
      badgeColor: 'bg-[#37558d]/10 text-[#37558d] border-[#37558d]/20',
      leader: 'Lucas Martins'
    },
    {
      id: 'DADOS',
      name: 'Governança & Arquitetura de Dados',
      sectors: ['DBA'],
      color: 'border-slate-200 bg-slate-50/50 text-[#37558d]',
      badgeColor: 'bg-[#37558d]/10 text-[#37558d] border-[#37558d]/20',
      leader: 'Camila Rocha'
    },
    {
      id: 'ADMINISTRATIVO',
      name: 'Administração, Gestão & Pessoas',
      sectors: ['RH', 'Financeiro', 'Gestão', 'Administrativo'],
      color: 'border-slate-200 bg-slate-50/50 text-[#37558d]',
      badgeColor: 'bg-[#37558d]/10 text-[#37558d] border-[#37558d]/20',
      leader: 'Helena Santos / Victor Estevão'
    }
  ];

  // Colaboradores filtrados
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.sector.toLowerCase().includes(search.toLowerCase()) ||
        (c.area && c.area.toLowerCase().includes(search.toLowerCase()));

      const matchArea = selectedArea === 'TODOS' || c.area === selectedArea;
      const matchRole = selectedRole === 'TODOS' || c.userRole === selectedRole;

      return matchSearch && matchArea && matchRole;
    });
  }, [collaborators, search, selectedArea, selectedRole]);

  // Expandir / recolher todos
  const toggleAllSectors = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    sectors.forEach(s => {
      updated[s.name] = expand;
    });
    ['N1', 'N2', 'N3', 'Suporte N1', 'Suporte N2', 'Suporte N3', 'Front-End', 'Back-End', 'DBA', 'Cyber Security', 'RH', 'Financeiro', 'Gestão', 'Administrativo'].forEach(name => {
      updated[name] = expand;
    });
    setExpandedSectors(updated);
  };

  const toggleSector = (sectorName: string) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  };

  // Exportação para Excel
  const handleExportExcel = () => {
    try {
      exportOrganogramaToExcel(collaborators, sectors);
      setExportNotice('Planilha corporativa .xlsx do Organograma gerada com sucesso!');
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error('Erro ao exportar organograma:', err);
    }
  };

  // Auxiliares de Papéis e Status
  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'SUPER ADMIN', badgeClass: 'bg-[#37558d] text-white border border-[#37558d]', icon: Crown };
      case 'ADMINISTRATIVO':
        return { label: 'ADMINISTRATIVO', badgeClass: 'bg-[#7da2ca]/20 text-[#37558d] border border-[#7da2ca]/40', icon: UserCog };
      case 'GESTOR':
        return { label: 'GESTOR', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: Shield };
      case 'COLABORADOR':
      default:
        return { label: 'COLABORADOR', badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200', icon: Users };
    }
  };

  const getStatusDot = (status: Collaborator['status']) => {
    switch (status) {
      case 'Em atividade':
        return { dot: 'bg-emerald-500', label: 'Em atividade', text: 'text-emerald-600' };
      case 'Intervalo':
        return { dot: 'bg-amber-500', label: 'Intervalo', text: 'text-amber-600' };
      case 'Férias':
        return { dot: 'bg-blue-500', label: 'Férias', text: 'text-blue-600' };
      case 'Ausente':
      case 'Bloqueado':
      default:
        return { dot: 'bg-rose-500', label: status, text: 'text-rose-600' };
    }
  };

  const executiveLeader = collaborators.find(c => c.userRole === 'SUPER_ADMIN') || ALL_COLLABORATORS[0];
  const reportingSubject = collaborators.find(c => c.id === reportingSubjectId) || executiveLeader;

  const reportingHierarchy = useMemo(() => {
    if (!reportingSubject) return { superior: null, peers: [], subordinates: [] };

    let superior: Collaborator | null = null;
    let subordinates: Collaborator[] = [];

    if (reportingSubject.userRole === 'SUPER_ADMIN') {
      superior = null;
      subordinates = collaborators.filter(c => c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO');
    } else if (reportingSubject.userRole === 'GESTOR' || reportingSubject.userRole === 'ADMINISTRATIVO') {
      superior = executiveLeader;
      subordinates = collaborators.filter(c => 
        (c.sector === reportingSubject.sector || c.area === reportingSubject.area) && 
        c.id !== reportingSubject.id && 
        c.userRole === 'COLABORADOR'
      );
    } else {
      superior = collaborators.find(c => 
        (c.sector === reportingSubject.sector || c.area === reportingSubject.area) && 
        (c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO')
      ) || executiveLeader;

      subordinates = [];
    }

    const peers = collaborators.filter(c => 
      c.sector === reportingSubject.sector && 
      c.id !== reportingSubject.id &&
      c.userRole === reportingSubject.userRole
    );

    return { superior, peers, subordinates };
  }, [reportingSubject, collaborators, executiveLeader]);

  const handleApplyRestructure = (e: React.FormEvent) => {
    e.preventDefault();
    const target = collaborators.find(c => c.id === simColabId);
    if (!target) return;

    let assignedArea = 'SUPORTE';
    if (simNewSector.includes('Front') || simNewSector.includes('Back')) assignedArea = 'DESENVOLVIMENTO';
    else if (simNewSector.includes('Security')) assignedArea = 'SEGURANÇA';
    else if (simNewSector.includes('DBA')) assignedArea = 'DADOS';
    else if (['RH', 'Financeiro', 'Gestão', 'Administrativo'].includes(simNewSector)) assignedArea = 'ADMINISTRATIVO';

    setCollaborators(prev => prev.map(c => {
      if (c.id === simColabId) {
        return {
          ...c,
          sector: simNewSector,
          area: assignedArea,
          role: simNewRole,
          userRole: simNewAccess
        };
      }
      return c;
    }));

    setSimSuccessToast(`Movimentação de ${target.name} para ${simNewSector} (${simNewAccess}) aplicada com sucesso!`);
    setTimeout(() => setSimSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12" id="organograma-view-container">
      {/* Cabeçalho no estilo Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              48 Colaboradores
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              11 Setores
            </span>
          </div>

          <h1 className="text-2xl font-black text-[#37558d] tracking-tight flex items-center gap-2.5">
            <Network className="w-7 h-7 text-[#37558d] shrink-0" />
            Organograma Hierárquico Corporativo
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Estrutura organizacional unificada, linhas de comando e simulação de equipes.
          </p>

          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-fit text-xs text-slate-600 mt-3 font-medium">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-[#37558d]"
              />
              <span>
                Operador: <strong className="text-slate-800">{currentUser.name}</strong>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#37558d] text-white">
                {currentUser.userRole}
              </span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#37558d] hover:bg-[#2c4472] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#37558d]" />
              <span>Voltar ao Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('arvore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'arvore'
              ? 'bg-[#37558d] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:bg-slate-50'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>1. Árvore Hierárquica</span>
        </button>

        <button
          onClick={() => setActiveTab('matriz_setores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'matriz_setores'
              ? 'bg-[#37558d] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Matriz de Setores (11)</span>
        </button>

        <button
          onClick={() => setActiveTab('linha_comando')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'linha_comando'
              ? 'bg-[#37558d] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>3. Cadeia de Comando</span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'simulador'
              ? 'bg-[#37558d] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>4. Simulador de Estrutura</span>
        </button>
      </div>

      {/* Avisos Toast */}
      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold">{exportNotice}</span>
          </div>
        </div>
      )}

      {simSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-[#37558d] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#37558d]" />
            <span className="text-xs font-bold">{simSuccessToast}</span>
          </div>
        </div>
      )}

      {/* Barra de Busca e Filtros */}
      {(activeTab === 'arvore' || activeTab === 'matriz_setores') && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar colaborador, cargo ou setor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#37558d]"
              />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#37558d] font-medium"
            >
              <option value="TODOS">Todas as Áreas (5)</option>
              <option value="SUPORTE">Suporte Técnico</option>
              <option value="DESENVOLVIMENTO">Desenvolvimento</option>
              <option value="SEGURANÇA">Cyber Security</option>
              <option value="DADOS">DBA & Dados</option>
              <option value="ADMINISTRATIVO">Administrativo & RH</option>
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#37558d] font-medium"
            >
              <option value="TODOS">Todos os Papéis</option>
              <option value="SUPER_ADMIN">Super Administrador</option>
              <option value="ADMINISTRATIVO">Administrativo</option>
              <option value="GESTOR">Gestores / Líderes</option>
              <option value="COLABORADOR">Colaboradores</option>
            </select>
          </div>

          {activeTab === 'arvore' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold px-2 text-slate-600">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 10, 130))}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 text-slate-500 hover:text-slate-800 border-l border-slate-200 ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => toggleAllSectors(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Expandir
              </button>
              <button
                onClick={() => toggleAllSectors(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Recolher
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABA 1: ÁRVORE HIERÁRQUICA */}
      {activeTab === 'arvore' && (
        <div 
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 overflow-x-auto shadow-xs"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
        >
          <div className="min-w-[980px] flex flex-col items-center">
            {/* Nível 1: Diretoria Executiva */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => setSelectedColab(executiveLeader)}
                className="group cursor-pointer relative p-5 rounded-2xl bg-[#37558d] text-white border border-[#37558d] shadow-md hover:bg-[#2c4472] transition-all max-w-sm w-80 text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#7da2ca] text-white font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <Crown className="w-3 h-3" />
                  Diretoria Executiva
                </div>

                <div className="flex flex-col items-center mt-1">
                  <img
                    src={executiveLeader.avatar}
                    alt={executiveLeader.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
                  />
                  <h2 className="text-base font-black mt-2">{executiveLeader.name}</h2>
                  <p className="text-xs text-blue-100 font-medium">{executiveLeader.role}</p>
                </div>
              </div>

              <div className="w-0.5 h-8 bg-slate-300"></div>
            </div>

            {/* Conselho */}
            <div className="relative flex items-center justify-center my-1 w-full max-w-xl">
              <div className="relative z-10 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-[#37558d]" />
                <span>Conselho Consultivo & Governança ByComp</span>
              </div>
            </div>

            <div className="w-0.5 h-8 bg-slate-300"></div>

            {/* Nível 2: Macro-Áreas */}
            <div className="relative w-full">
              <div className="grid grid-cols-5 gap-4 pt-4">
                {MACRO_AREAS.map((area) => {
                  const areaColabs = collaborators.filter(c => {
                    const s = c.sector;
                    return area.sectors.some(sec => s === sec || s.includes(sec));
                  });
                  const isVisible = selectedArea === 'TODOS' || selectedArea === area.id;

                  if (!isVisible) return null;

                  return (
                    <div key={area.id} className="flex flex-col items-center relative">
                      <div className={`w-full p-3.5 rounded-2xl border ${area.color} shadow-xs text-center flex flex-col items-center bg-slate-50`}>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1 border ${area.badgeColor}`}>
                          {area.id}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 leading-tight">
                          {area.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                          Líder: <strong className="text-slate-700">{area.leader}</strong>
                        </p>
                      </div>

                      <div className="w-0.5 h-6 bg-slate-300"></div>

                      {/* Nível 3: Setores */}
                      <div className="w-full space-y-4">
                        {area.sectors.map(sectorName => {
                          const secMeta = sectors.find(s => s.name === sectorName);
                          const sectorColabs = collaborators.filter(c => 
                            c.sector === sectorName || 
                            (sectorName === 'N1' && c.sector === 'Suporte N1') ||
                            (sectorName === 'N2' && c.sector === 'Suporte N2') ||
                            (sectorName === 'N3' && c.sector === 'Suporte N3')
                          );
                          const isExpanded = !!expandedSectors[sectorName];
                          const sectorLeader = sectorColabs.find(c => c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO') || sectorColabs[0];

                          return (
                            <div key={sectorName} className="flex flex-col items-center">
                              <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-[#37558d] transition-all">
                                <div 
                                  onClick={() => toggleSector(sectorName)}
                                  className="p-3 bg-slate-50 cursor-pointer hover:bg-slate-100/80 flex items-center justify-between border-b border-slate-200"
                                >
                                  <div className="text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-[#37558d]"></span>
                                      <span className="text-xs font-bold text-slate-800">
                                        {sectorName}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {sectorColabs.length} membros
                                    </span>
                                  </div>

                                  <button className="text-slate-400 hover:text-slate-600">
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                {sectorLeader && (
                                  <div 
                                    onClick={() => setSelectedColab(sectorLeader)}
                                    className="p-2.5 bg-white flex items-center gap-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                                  >
                                    <img
                                      src={sectorLeader.avatar}
                                      alt={sectorLeader.name}
                                      className="w-7 h-7 rounded-full object-cover border border-[#37558d]"
                                    />
                                    <div className="text-left overflow-hidden">
                                      <p className="text-[11px] font-bold text-slate-800 truncate">
                                        {sectorLeader.name}
                                      </p>
                                      <span className="text-[9px] font-bold text-[#37558d]">
                                        Líder Setorial
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {isExpanded && (
                                  <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto bg-slate-50/50">
                                    {sectorColabs.map((colab) => {
                                      const statusInfo = getStatusDot(colab.status);
                                      return (
                                        <div
                                          key={colab.id}
                                          onClick={() => setSelectedColab(colab)}
                                          className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all flex items-center justify-between gap-2"
                                        >
                                          <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="relative shrink-0">
                                              <img
                                                src={colab.avatar}
                                                alt={colab.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                              />
                                              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                                            </div>
                                            <div className="overflow-hidden text-left">
                                              <p className="text-[11px] font-bold text-slate-800 truncate">
                                                {colab.name}
                                              </p>
                                              <p className="text-[9px] text-slate-500 truncate">
                                                {colab.role}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: MATRIZ DE SETORES */}
      {activeTab === 'matriz_setores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectors.map((sec) => {
            const secColabs = collaborators.filter(c => 
              c.sector === sec.name || 
              (sec.name === 'N1' && c.sector === 'Suporte N1') ||
              (sec.name === 'N2' && c.sector === 'Suporte N2') ||
              (sec.name === 'N3' && c.sector === 'Suporte N3')
            );
            const leader = secColabs.find(c => c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO') || secColabs[0];

            return (
              <div
                key={sec.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#7da2ca]/20 text-[#37558d] border border-[#7da2ca]/40 uppercase">
                        {sec.area}
                      </span>
                      <h3 className="text-base font-bold text-[#37558d] mt-1.5 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#37558d]" />
                        Setor {sec.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 font-medium">
                    {sec.description || 'Setor técnico corporativo integrado à operação.'}
                  </p>

                  {leader && (
                    <div 
                      onClick={() => setSelectedColab(leader)}
                      className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-[#37558d] transition-colors"
                    >
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#37558d]"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-[#37558d] font-bold uppercase block">
                          Líder do Setor
                        </span>
                        <p className="text-xs font-bold text-slate-800 truncate">{leader.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{leader.role}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Equipe: <strong className="text-[#37558d] font-bold">{secColabs.length} membros</strong></span>
                  <button
                    onClick={() => {
                      setSelectedArea(sec.area);
                      setActiveTab('arvore');
                    }}
                    className="text-[#37558d] font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Ver na Árvore</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ABA 3: CADEIA DE COMANDO */}
      {activeTab === 'linha_comando' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-bold text-[#37558d] flex items-center gap-2">
                <Workflow className="w-5 h-5 text-[#37558d]" />
                Rastreador de Cadeia de Comando
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Selecione um profissional para auditar a sua linha de reporte.
              </p>
            </div>

            <select
              value={reportingSubjectId}
              onChange={(e) => setReportingSubjectId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#37558d]"
            >
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.sector} • {c.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {/* Superior */}
            {reportingHierarchy.superior ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={reportingHierarchy.superior.avatar}
                    alt={reportingHierarchy.superior.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#37558d]"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#37558d] text-white uppercase">
                      Superior Imediato
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">{reportingHierarchy.superior.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{reportingHierarchy.superior.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#37558d] text-white flex items-center gap-3 shadow-xs">
                <Crown className="w-5 h-5 text-white" />
                <div>
                  <h4 className="text-xs font-bold uppercase">Topo da Cadeia Corporativa</h4>
                  <p className="text-xs text-blue-100">Direção Executiva Super Admin.</p>
                </div>
              </div>
            )}

            {/* Foco Central */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-[#37558d] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={reportingSubject.avatar}
                    alt={reportingSubject.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#37558d]"
                  />
                  <div>
                    <h3 className="text-lg font-black text-[#37558d]">{reportingSubject.name}</h3>
                    <p className="text-xs text-slate-600 font-bold">{reportingSubject.role}</p>
                    <p className="text-xs text-slate-500 mt-1">Setor: {reportingSubject.sector}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedColab(reportingSubject)}
                  className="px-4 py-2 rounded-xl bg-[#37558d] hover:bg-[#2c4472] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha</span>
                </button>
              </div>
            </div>

            {/* Subordinados */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#37558d]" />
                Subordinados Diretos ({reportingHierarchy.subordinates.length})
              </span>

              {reportingHierarchy.subordinates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {reportingHierarchy.subordinates.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setReportingSubjectId(sub.id)}
                      className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#37558d] cursor-pointer transition-all flex items-center gap-3"
                    >
                      <img
                        src={sub.avatar}
                        alt={sub.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{sub.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{sub.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  Nenhum subordinado direto associado.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: SIMULADOR DE REESTRUTURAÇÃO */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-[#37558d] flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-[#37558d]" />
              Simular Transferência ou Promoção
            </h3>

            <form onSubmit={handleApplyRestructure} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Colaborador
                </label>
                <select
                  value={simColabId}
                  onChange={(e) => setSimColabId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#37558d]"
                >
                  {collaborators.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Setor de Destino
                  </label>
                  <select
                    value={simNewSector}
                    onChange={(e) => setSimNewSector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#37558d]"
                  >
                    <option value="Suporte N1">Suporte N1</option>
                    <option value="Suporte N2">Suporte N2</option>
                    <option value="Suporte N3">Suporte N3</option>
                    <option value="Front-End">Front-End</option>
                    <option value="Back-End">Back-End</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="DBA">DBA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nível de Acesso (RBAC)
                  </label>
                  <select
                    value={simNewAccess}
                    onChange={(e) => setSimNewAccess(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#37558d]"
                  >
                    <option value="COLABORADOR">Colaborador</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Novo Título do Cargo
                </label>
                <input
                  type="text"
                  value={simNewRole}
                  onChange={(e) => setSimNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#37558d]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#37558d] hover:bg-[#2c4472] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Reestruturação</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h4 className="text-sm font-bold text-[#37558d] border-b border-slate-100 pb-3">
              Impacto no Organograma
            </h4>

            {(() => {
              const target = collaborators.find(c => c.id === simColabId);
              if (!target) return null;

              return (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <img
                      src={target.avatar}
                      alt={target.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#37558d]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{target.name}</h4>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="text-slate-400 line-through">{target.sector}</span>
                        <ArrowRight className="w-3 h-3 text-[#37558d]" />
                        <span className="text-[#37558d] font-bold">{simNewSector}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* DRAWER LATERAL DO PERFIL */}
      {selectedColab && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#7da2ca]/20 text-[#37558d] uppercase">
                  Ficha do Colaborador
                </span>
                <button
                  onClick={() => setSelectedColab(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selectedColab.avatar}
                  alt={selectedColab.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#37558d]"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedColab.name}</h3>
                  <p className="text-xs font-semibold text-[#37558d]">{selectedColab.role}</p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Setor</span>
                  <strong className="text-slate-800">{selectedColab.sector}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">E-mail</span>
                  <span className="text-slate-800">{selectedColab.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Telefone</span>
                  <span className="text-slate-800">{selectedColab.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedColab(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};