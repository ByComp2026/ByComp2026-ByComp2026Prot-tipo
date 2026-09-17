import React, { useState, useMemo } from 'react';
import {
  Network,
  Users,
  Crown,
  Shield,
  UserCog,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Layers,
  Briefcase,
  Building2,
  Sparkles,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  ExternalLink,
  Eye,
  Phone,
  Mail,
  Clock,
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SlidersHorizontal,
  UserCheck,
  AlertCircle,
  X,
  Workflow,
  Check,
  Share2
} from 'lucide-react';
import { ALL_COLLABORATORS, INITIAL_ORGANIZATIONAL_SECTORS } from '../../data/mockData';
import { Collaborator, OrganizationalSector, UserRole, ViewScreen } from '../../types';
import { exportOrganogramaToExcel } from '../../utils/excelExport';
import { PrivateAccessLock } from './collaborators/PrivateAccessLock';

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
  // Check access: Only GESTOR, ADMINISTRATIVO and SUPER_ADMIN are authorized
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

  // State for collaborators and sectors (supporting interactive restructuring simulation)
  const [collaborators, setCollaborators] = useState<Collaborator[]>(ALL_COLLABORATORS);
  const [sectors, setSectors] = useState<OrganizationalSector[]>(INITIAL_ORGANIZATIONAL_SECTORS);

  // Active viewing mode
  const [activeTab, setActiveTab] = useState<'arvore' | 'matriz_setores' | 'linha_comando' | 'simulador'>('arvore');

  // Filters & search
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('TODOS');
  const [selectedRole, setSelectedRole] = useState<string>('TODOS');

  // Interactive Tree state: expanded sectors
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

  // Selected collaborator for profile drawer
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);

  // Line of command selected collaborator
  const [reportingSubjectId, setReportingSubjectId] = useState<string>('colab-1'); // Victor Estevão default

  // Simulator form state
  const [simColabId, setSimColabId] = useState<string>(ALL_COLLABORATORS[1]?.id || 'colab-2');
  const [simNewSector, setSimNewSector] = useState<string>('Suporte N2');
  const [simNewRole, setSimNewRole] = useState<string>('Analista Sênior');
  const [simNewAccess, setSimNewAccess] = useState<UserRole>('GESTOR');
  const [simSuccessToast, setSimSuccessToast] = useState<string | null>(null);

  // Zoom level for the visual tree (90% to 120%)
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Export notification
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Macro-areas definitions
  const MACRO_AREAS = [
    {
      id: 'SUPORTE',
      name: 'Operações de TI & Suporte',
      sectors: ['N1', 'N2', 'N3'],
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-400',
      badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      leader: 'Carlos Eduardo / Juliana Pires'
    },
    {
      id: 'DESENVOLVIMENTO',
      name: 'Engenharia de Software & Web',
      sectors: ['Front-End', 'Back-End'],
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      leader: 'Beatriz Lima / Rodrigo Fontes'
    },
    {
      id: 'SEGURANÇA',
      name: 'Cyber Security & Defesa Cibernética',
      sectors: ['Cyber Security'],
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      leader: 'Lucas Martins'
    },
    {
      id: 'DADOS',
      name: 'Governança & Arquitetura de Dados',
      sectors: ['DBA'],
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      leader: 'Camila Rocha'
    },
    {
      id: 'ADMINISTRATIVO',
      name: 'Administração, Gestão & Pessoas',
      sectors: ['RH', 'Financeiro', 'Gestão', 'Administrativo'],
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      leader: 'Helena Santos / Victor Estevão'
    }
  ];

  // Filtered collaborators
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

  // Expand / collapse all sectors
  const toggleAllSectors = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    sectors.forEach(s => {
      updated[s.name] = expand;
    });
    // Also include normalized sector names
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

  // Trigger real Excel file export
  const handleExportExcel = () => {
    try {
      exportOrganogramaToExcel(collaborators, sectors);
      setExportNotice('Planilha corporativa .xlsx do Organograma gerada com sucesso com 48 colaboradores e 11 setores!');
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error('Erro ao exportar organograma:', err);
    }
  };

  // Helper for Role metadata badge
  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'SUPER ADMIN', badgeClass: 'bg-purple-950 border-purple-500/60 text-purple-300', icon: Crown };
      case 'ADMINISTRATIVO':
        return { label: 'ADMINISTRATIVO', badgeClass: 'bg-sky-950 border-sky-500/60 text-sky-300', icon: UserCog };
      case 'GESTOR':
        return { label: 'GESTOR', badgeClass: 'bg-emerald-950 border-emerald-500/60 text-emerald-300', icon: Shield };
      case 'COLABORADOR':
      default:
        return { label: 'COLABORADOR', badgeClass: 'bg-slate-900 border-slate-700 text-slate-300', icon: Users };
    }
  };

  // Helper for Status indicator
  const getStatusDot = (status: Collaborator['status']) => {
    switch (status) {
      case 'Em atividade':
        return { dot: 'bg-emerald-400', label: 'Em atividade', text: 'text-emerald-400' };
      case 'Intervalo':
        return { dot: 'bg-amber-400', label: 'Intervalo', text: 'text-amber-400' };
      case 'Férias':
        return { dot: 'bg-blue-400', label: 'Férias', text: 'text-blue-400' };
      case 'Ausente':
      case 'Bloqueado':
      default:
        return { dot: 'bg-rose-400', label: status, text: 'text-rose-400' };
    }
  };

  // Executive Top Node: Victor Estevão
  const executiveLeader = collaborators.find(c => c.userRole === 'SUPER_ADMIN') || ALL_COLLABORATORS[0];

  // Reporting line calculation for Tab 3
  const reportingSubject = collaborators.find(c => c.id === reportingSubjectId) || executiveLeader;

  // Find superior and subordinates for the selected subject
  const reportingHierarchy = useMemo(() => {
    if (!reportingSubject) return { superior: null, peers: [], subordinates: [] };

    let superior: Collaborator | null = null;
    let subordinates: Collaborator[] = [];

    if (reportingSubject.userRole === 'SUPER_ADMIN') {
      // Top of company, reports to board; all area managers report to him
      superior = null;
      subordinates = collaborators.filter(c => c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO');
    } else if (reportingSubject.userRole === 'GESTOR' || reportingSubject.userRole === 'ADMINISTRATIVO') {
      // Reports to Super Admin (Victor)
      superior = executiveLeader;
      // Subordinates are collaborators in their sector
      subordinates = collaborators.filter(c => 
        (c.sector === reportingSubject.sector || c.area === reportingSubject.area) && 
        c.id !== reportingSubject.id && 
        c.userRole === 'COLABORADOR'
      );
    } else {
      // Regular collaborator reports to their sector Gestor or Super Admin
      superior = collaborators.find(c => 
        (c.sector === reportingSubject.sector || c.area === reportingSubject.area) && 
        (c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO')
      ) || executiveLeader;

      // Regular collaborator has no direct subordinates
      subordinates = [];
    }

    const peers = collaborators.filter(c => 
      c.sector === reportingSubject.sector && 
      c.id !== reportingSubject.id &&
      c.userRole === reportingSubject.userRole
    );

    return { superior, peers, subordinates };
  }, [reportingSubject, collaborators, executiveLeader]);

  // Simulator apply restructuring
  const handleApplyRestructure = (e: React.FormEvent) => {
    e.preventDefault();
    const target = collaborators.find(c => c.id === simColabId);
    if (!target) return;

    // Determine area
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
      {/* Header Banner - Phase 3 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                FASE 3 • TELA PRIVADA (GESTÃO, ADM & RH)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
                LGPD ART. 46
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono font-bold">
                48 Colaboradores
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-bold">
                11 Setores • 5 Macro-Áreas
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300 text-[11px] font-mono font-bold">
                4 Níveis Hierárquicos
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Network className="w-7 h-7 text-cyan-400 shrink-0" />
              Organograma Institucional & Linhas de Comando
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Ambiente confidencial restrito a Gestão, Administração e RH: da Diretoria Executiva às equipes técnicas, com cadeias de subordinação, metas de SLA setorial e simulador de movimentação.
            </p>

            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 w-fit text-xs text-slate-300 mt-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <span>
                  Operador Autorizado: <strong className="text-white">{currentUser.name}</strong>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentUser.userRole}
                </span>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            <button
              onClick={handleExportExcel}
              id="btn-exportar-organograma-excel"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              title="Exportar hierarquia completa em arquivo Excel .xlsx com 2 abas"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel (.xlsx)</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('colaboradores')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
                title="Ir para o Quadro de Colaboradores"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Quadro Completo</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('arvore')}
            id="tab-arvore-organograma"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'arvore'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>1. Árvore Hierárquica Visual</span>
          </button>

          <button
            onClick={() => setActiveTab('matriz_setores')}
            id="tab-matriz-setores"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matriz_setores'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Matriz de Áreas & Setores (11)</span>
          </button>

          <button
            onClick={() => setActiveTab('linha_comando')}
            id="tab-linha-comando"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'linha_comando'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>3. Cadeia de Comando & Subordinação</span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            id="tab-simulador-reestruturacao"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulador'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>4. Simulador de Reestruturação</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-700">
              Interativo
            </span>
          </button>
        </div>
      </div>

      {/* Export Toast Banner */}
      {exportNotice && (
        <div 
          id="organograma-export-toast"
          className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center justify-between shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{exportNotice}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-emerald-300">
            Download Concluído
          </span>
        </div>
      )}

      {/* Simulator Success Toast */}
      {simSuccessToast && (
        <div 
          className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 flex items-center justify-between shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold">{simSuccessToast}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-900 border border-cyan-700 text-cyan-300">
            Organograma Atualizado
          </span>
        </div>
      )}

      {/* SEARCH AND FILTER BAR (Active on Tree & Matrix) */}
      {(activeTab === 'arvore' || activeTab === 'matriz_setores') && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por colaborador, cargo ou setor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
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
              className="px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="TODOS">Todos os Papéis</option>
              <option value="SUPER_ADMIN">Super Administrador</option>
              <option value="ADMINISTRATIVO">Administrativo</option>
              <option value="GESTOR">Gestores / Líderes</option>
              <option value="COLABORADOR">Colaboradores</option>
            </select>
          </div>

          {activeTab === 'arvore' && (
            <div className="flex items-center gap-2 self-end md:self-auto">
              <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                  title="Diminuir Zoom"
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-2 text-slate-400">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 10, 130))}
                  title="Aumentar Zoom"
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  title="Resetar Zoom"
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors border-l border-slate-800 ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => toggleAllSectors(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Expandir Tudo
              </button>
              <button
                onClick={() => toggleAllSectors(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Recolher Tudo
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ÁRVORE HIERÁRQUICA VISUAL (INTERACTIVE ORG TREE) */}
      {/* ========================================================================= */}
      {activeTab === 'arvore' && (
        <div 
          className="bg-slate-950/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 overflow-x-auto shadow-inner"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
        >
          <div className="min-w-[980px] flex flex-col items-center">
            {/* LEVEL 1: EXECUTIVE PRESIDENCY / SUPER ADMIN */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => setSelectedColab(executiveLeader)}
                className="group cursor-pointer relative p-5 rounded-2xl bg-gradient-to-b from-purple-950/90 to-slate-900 border-2 border-purple-500/80 shadow-2xl shadow-purple-950/50 hover:border-purple-400 transition-all hover:scale-105 max-w-sm w-80 text-center"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white font-mono font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3" />
                  Nível 1 • Diretoria Executiva
                </div>

                <div className="flex flex-col items-center mt-1">
                  <div className="relative">
                    <img
                      src={executiveLeader.avatar}
                      alt={executiveLeader.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 shadow-md group-hover:ring-4 group-hover:ring-purple-500/40 transition-all"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
                  </div>

                  <h2 className="text-base font-extrabold text-white mt-2 group-hover:text-purple-300 transition-colors">
                    {executiveLeader.name}
                  </h2>
                  <p className="text-xs font-semibold text-purple-300 mt-0.5">
                    {executiveLeader.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    {executiveLeader.email}
                  </p>

                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-purple-900/60 w-full justify-center">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800 text-[10px] font-bold">
                      SUPER ADMINISTRADOR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      Gestão Global
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical connector from Level 1 */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-500"></div>
            </div>

            {/* LEVEL 1.5: STAFF & GOVERNANCE BAR */}
            <div className="relative flex items-center justify-center my-1 w-full max-w-2xl">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-800"></div>
              <div className="relative z-10 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2 shadow-lg">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Conselho Consultivo • Comitê de Segurança & LGPD • Governança ByComp</span>
              </div>
            </div>

            {/* Vertical connector down to Areas */}
            <div className="w-0.5 h-8 bg-slate-800"></div>

            {/* LEVEL 2: 5 MACRO-AREAS (HORIZONTAL BRANCHING) */}
            <div className="relative w-full">
              {/* Horizontal crossbar connecting all 5 macro-areas */}
              <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-slate-700"></div>

              <div className="grid grid-cols-5 gap-4 pt-6">
                {MACRO_AREAS.map((area) => {
                  const areaColabs = collaborators.filter(c => {
                    const s = c.sector;
                    return area.sectors.some(sec => s === sec || s.includes(sec));
                  });
                  const isVisible = selectedArea === 'TODOS' || selectedArea === area.id;

                  if (!isVisible) return null;

                  return (
                    <div key={area.id} className="flex flex-col items-center relative">
                      {/* Vertical line from crossbar to area card */}
                      <div className="absolute -top-6 w-0.5 h-6 bg-slate-700"></div>

                      {/* Area Header Card */}
                      <div className={`w-full p-3.5 rounded-2xl border ${area.color} shadow-lg text-center flex flex-col items-center relative group`}>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-1 border ${area.badgeColor}`}>
                          {area.id}
                        </span>
                        <h3 className="text-xs font-extrabold text-white leading-tight">
                          {area.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Líder: <strong className="text-slate-200">{area.leader}</strong>
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                          {areaColabs.length} Colaboradores
                        </div>
                      </div>

                      {/* Line to sectors */}
                      <div className="w-0.5 h-6 bg-slate-800"></div>

                      {/* LEVEL 3: SECTORS UNDER THIS MACRO-AREA */}
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
                              {/* Sector Card */}
                              <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-slate-700 transition-all">
                                <div 
                                  onClick={() => toggleSector(sectorName)}
                                  className="p-3 bg-slate-950/80 cursor-pointer hover:bg-slate-800/40 flex items-center justify-between border-b border-slate-800/80 transition-colors"
                                >
                                  <div className="text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                      <span className="text-xs font-bold text-white tracking-tight">
                                        {sectorName}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block font-mono">
                                      {sectorColabs.length} membros • SLA {secMeta?.slaTarget || '98%'}
                                    </span>
                                  </div>

                                  <button className="text-slate-400 hover:text-white p-1">
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                {/* Sector Leader Summary */}
                                {sectorLeader && (
                                  <div 
                                    onClick={() => setSelectedColab(sectorLeader)}
                                    className="p-2.5 bg-slate-900/60 flex items-center gap-2 hover:bg-slate-800/50 cursor-pointer border-b border-slate-800/60"
                                    title="Líder do Setor - Clique para ver perfil completo"
                                  >
                                    <img
                                      src={sectorLeader.avatar}
                                      alt={sectorLeader.name}
                                      className="w-7 h-7 rounded-full object-cover border border-cyan-500/60"
                                    />
                                    <div className="text-left overflow-hidden">
                                      <p className="text-[11px] font-bold text-slate-200 truncate">
                                        {sectorLeader.name}
                                      </p>
                                      <span className="text-[9px] font-mono text-cyan-400 block">
                                        ★ Líder Setorial
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* LEVEL 4: EXPANDED COLLABORATORS LIST */}
                                {isExpanded && (
                                  <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto bg-slate-950/40">
                                    {sectorColabs.map((colab) => {
                                      const statusInfo = getStatusDot(colab.status);
                                      return (
                                        <div
                                          key={colab.id}
                                          onClick={() => setSelectedColab(colab)}
                                          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between gap-2"
                                        >
                                          <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="relative shrink-0">
                                              <img
                                                src={colab.avatar}
                                                alt={colab.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                              />
                                              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${statusInfo.dot}`}></span>
                                            </div>
                                            <div className="overflow-hidden text-left">
                                              <p className="text-[11px] font-semibold text-slate-200 truncate">
                                                {colab.name}
                                              </p>
                                              <p className="text-[9px] text-slate-400 truncate">
                                                {colab.role}
                                              </p>
                                            </div>
                                          </div>

                                          <span className="text-[9px] font-mono text-slate-500 shrink-0">
                                            {colab.userRole === 'GESTOR' ? 'Líder' : 'Nível 4'}
                                          </span>
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

      {/* ========================================================================= */}
      {/* TAB 2: MATRIZ DE ÁREAS & SETORES (BENTO GRID) */}
      {/* ========================================================================= */}
      {activeTab === 'matriz_setores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((sec) => {
              const secColabs = collaborators.filter(c => 
                c.sector === sec.name || 
                (sec.name === 'N1' && c.sector === 'Suporte N1') ||
                (sec.name === 'N2' && c.sector === 'Suporte N2') ||
                (sec.name === 'N3' && c.sector === 'Suporte N3')
              );
              const leader = secColabs.find(c => c.userRole === 'GESTOR' || c.userRole === 'ADMINISTRATIVO') || secColabs[0];
              const activeCount = secColabs.filter(c => c.status === 'Em atividade').length;

              return (
                <div
                  key={sec.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                          {sec.area}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          Setor {sec.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {sec.slaTarget || '98.5%'}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">Meta SLA</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      {sec.description || 'Setor técnico corporativo integrado à operação da ByComp.'}
                    </p>

                    {/* Leader card */}
                    {leader && (
                      <div 
                        onClick={() => setSelectedColab(leader)}
                        className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-cyan-500/50 transition-colors"
                      >
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                            Líder do Setor
                          </span>
                          <p className="text-xs font-bold text-white truncate">{leader.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{leader.role}</p>
                        </div>
                      </div>
                    )}

                    {/* Members preview */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Equipe ({secColabs.length} profissionais):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {secColabs.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedColab(c)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-cyan-500 transition-colors"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(c.status).dot}`}></span>
                            <span className="truncate max-w-[120px]">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Ativos agora: <strong className="text-emerald-400">{activeCount}/{secColabs.length}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedArea(sec.area);
                        setActiveTab('arvore');
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Ver na Árvore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CADEIA DE COMANDO & SUBORDINAÇÃO DIRETA */}
      {/* ========================================================================= */}
      {activeTab === 'linha_comando' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-cyan-400" />
                  Rastreador de Cadeia de Comando (Reporting Line)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Selecione qualquer um dos 48 profissionais para auditar sua linha direta de reporte ascendente e descendente.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-300 shrink-0">Colaborador:</label>
                <select
                  value={reportingSubjectId}
                  onChange={(e) => setReportingSubjectId(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {collaborators.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sector} • {c.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Reporting Line Breadcrumb Chain */}
            <div className="space-y-8">
              {/* STEP 1: SUPERIOR / REPORTING TO */}
              {reportingHierarchy.superior ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={reportingHierarchy.superior.avatar}
                      alt={reportingHierarchy.superior.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase font-bold">
                        Reporta Diretamente Para (Superior Imediato)
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{reportingHierarchy.superior.name}</h4>
                      <p className="text-xs text-slate-400">{reportingHierarchy.superior.role} • {reportingHierarchy.superior.sector}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setReportingSubjectId(reportingHierarchy.superior!.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-medium transition-colors"
                  >
                    Auditar Superior
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-700/60 text-purple-200 flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Topo da Cadeia Corporativa</h4>
                    <p className="text-xs text-purple-300/80">Este profissional é o Diretor Executivo (Super Admin). Responde diretamente ao Conselho Consultivo da ByComp.</p>
                  </div>
                </div>
              )}

              {/* Vertical arrow connector */}
              <div className="flex justify-center -my-3">
                <div className="p-2 rounded-full bg-cyan-600 text-white shadow-lg">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* STEP 2: CURRENT SELECTED SUBJECT (CENTRAL FOCUS) */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border-2 border-cyan-500 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={reportingSubject.avatar}
                      alt={reportingSubject.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{reportingSubject.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadge(reportingSubject.userRole).badgeClass}`}>
                          {getRoleBadge(reportingSubject.userRole).label}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-300 font-semibold mt-0.5">{reportingSubject.role}</p>
                      <p className="text-xs text-slate-400 mt-1">Setor: <strong className="text-slate-200">{reportingSubject.sector}</strong> • Macro-Área: <strong className="text-slate-200">{reportingSubject.area || 'Operações'}</strong></p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{reportingSubject.email} • {reportingSubject.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedColab(reportingSubject)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ficha Completa</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Vertical arrow connector */}
              <div className="flex justify-center -my-3">
                <div className="p-2 rounded-full bg-cyan-600 text-white shadow-lg">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* STEP 3: SUBORDINATES (REPORTING DIRECTLY TO THIS PERSON) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Subordinados Diretos ({reportingHierarchy.subordinates.length})
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Linha de comando descendente</span>
                </div>

                {reportingHierarchy.subordinates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {reportingHierarchy.subordinates.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setReportingSubjectId(sub.id)}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center gap-3 group"
                      >
                        <img
                          src={sub.avatar}
                          alt={sub.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400"
                        />
                        <div className="overflow-hidden text-left">
                          <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{sub.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{sub.role}</p>
                          <span className="text-[9px] font-mono text-slate-500">{sub.sector}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    Este profissional é um especialista técnico individual e não possui subordinados diretos formalizados na base.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SIMULADOR DE REESTRUTURAÇÃO & MOVIMENTAÇÃO */}
      {/* ========================================================================= */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4 mb-5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold">
                  Laboratório de Reestruturação
                </span>
                <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                  Simular Promoção ou Transferência Setorial
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mude um colaborador de setor ou altere seu papel hierárquico para verificar instantaneamente o impacto na árvore do organograma.
                </p>
              </div>

              <form onSubmit={handleApplyRestructure} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Selecione o Colaborador
                  </label>
                  <select
                    value={simColabId}
                    onChange={(e) => {
                      setSimColabId(e.target.value);
                      const c = collaborators.find(x => x.id === e.target.value);
                      if (c) {
                        setSimNewSector(c.sector);
                        setSimNewRole(c.role);
                        setSimNewAccess(c.userRole || 'COLABORADOR');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} — Atual: {c.sector} ({c.userRole || 'COLABORADOR'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Novo Setor de Destino
                    </label>
                    <select
                      value={simNewSector}
                      onChange={(e) => setSimNewSector(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="Suporte N1">Suporte N1</option>
                      <option value="Suporte N2">Suporte N2</option>
                      <option value="Suporte N3">Suporte N3</option>
                      <option value="Front-End">Front-End</option>
                      <option value="Back-End">Back-End</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="DBA">DBA</option>
                      <option value="RH">RH</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Gestão">Gestão</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nível Hierárquico (RBAC)
                    </label>
                    <select
                      value={simNewAccess}
                      onChange={(e) => setSimNewAccess(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="COLABORADOR">Colaborador (Nível 4)</option>
                      <option value="GESTOR">Gestor Setorial (Nível 3)</option>
                      <option value="ADMINISTRATIVO">Administrativo (Nível 2)</option>
                      <option value="SUPER_ADMIN">Super Administrador (Nível 1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Novo Título do Cargo
                  </label>
                  <input
                    type="text"
                    value={simNewRole}
                    onChange={(e) => setSimNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="Ex: Coordenador de Suporte N2"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aplicar Reestruturação no Organograma</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Pré-visualização do Impacto Estrutural
              </h4>

              {(() => {
                const target = collaborators.find(c => c.id === simColabId);
                if (!target) return null;

                return (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <img
                        src={target.avatar}
                        alt={target.name}
                        className="w-14 h-14 rounded-full object-cover border border-cyan-400"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{target.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="text-slate-400 line-through">{target.sector}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{simNewSector}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className="text-slate-400 line-through">{target.role}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-bold">{simNewRole}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-700/40 text-xs text-cyan-200/90 space-y-2">
                      <p className="font-bold flex items-center gap-1.5 text-cyan-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        Consequências Automáticas da Movimentação:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                        <li>O colaborador será realocado imediatamente na aba <strong>1. Árvore Hierárquica Visual</strong>.</li>
                        <li>A contagem de headcount do setor <strong>{simNewSector}</strong> será recalculada em tempo real.</li>
                        <li>Todas as exportações para <strong>Excel (.xlsx)</strong> refletirão a nova estrutura imediatamente.</li>
                        <li>Permissões e acessos de tela serão ajustados de acordo com a regra de perfil ({simNewAccess}).</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER LATERAL: FICHA COMPLETA DO COLABORADOR NO ORGANOGRAMA */}
      {/* ========================================================================= */}
      {selectedColab && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-slate-900 border-l border-slate-700 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-bold">
                  Prontuário Funcional • Organograma
                </span>
                <button
                  onClick={() => setSelectedColab(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedColab.avatar}
                    alt={selectedColab.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                  />
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusDot(selectedColab.status).dot}`}></span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedColab.name}</h3>
                  <p className="text-xs font-semibold text-cyan-400">{selectedColab.role}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${getRoleBadge(selectedColab.userRole).badgeClass}`}>
                      {getRoleBadge(selectedColab.userRole).label}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${getStatusDot(selectedColab.status).text}`}>
                      ● {getStatusDot(selectedColab.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Setor</span>
                  <strong className="text-white font-mono">{selectedColab.sector}</strong>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Macro-Área</span>
                  <strong className="text-white font-mono">{selectedColab.area || 'Operações'}</strong>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">E-mail</span>
                  <a href={`mailto:${selectedColab.email}`} className="text-cyan-400 font-mono hover:underline truncate max-w-[200px]">
                    {selectedColab.email}
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Telefone / Ramal</span>
                  <span className="text-white font-mono">{selectedColab.phone}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Admissão</span>
                  <span className="text-slate-300 font-mono">{selectedColab.admissionDate}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Atividade Técnica Atual</span>
                  <p className="text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
                    {selectedColab.currentTask || 'Sem demanda alocada no momento.'}
                  </p>
                </div>
              </div>

              {/* Reporting Shortcut */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-cyan-400 block">Linha de Subordinação</span>
                  <span className="text-[11px] text-slate-400">Auditar a cadeia de comando deste profissional</span>
                </div>
                <button
                  onClick={() => {
                    setReportingSubjectId(selectedColab.id);
                    setActiveTab('linha_comando');
                    setSelectedColab(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Ver Cadeia
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedColab(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Fechar Ficha
              </button>
              {onNavigate && (
                <button
                  onClick={() => {
                    setSelectedColab(null);
                    onNavigate('meu_kanban');
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 transition-colors cursor-pointer"
                >
                  Ver no Kanban
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
