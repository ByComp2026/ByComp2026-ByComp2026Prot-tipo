import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Coffee,
  CheckSquare,
  AlertCircle,
  PhoneCall,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Play,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Kanban,
  ShieldCheck,
  Calendar,
  Layers,
  Database,
  Shield,
  FileSpreadsheet,
  Briefcase,
  SlidersHorizontal,
  Flame,
  Network
} from 'lucide-react';
import { ViewScreen } from '../../types';
import {
  SECTOR_PRODUCTIVITY,
  TASK_STATUS_BREAKDOWN,
  RECENT_ACTIVITIES,
  MOCK_ALERTS,
  MOCK_CALENDAR_EVENTS
} from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (screen: ViewScreen) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [dashboardMode, setDashboardMode] = useState<'operacional' | 'executivo'>('operacional');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // General KPIs
  const operationalKPIs = [
    {
      id: 'kpi-colabs',
      title: 'Colaboradores Ativos',
      value: '37',
      label: '4 ausentes • 7 intervalo (48 total)',
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-cyan-400',
      action: 'colaboradores' as ViewScreen
    },
    {
      id: 'kpi-tarefas',
      title: 'Tarefas Ativas',
      value: '126',
      label: '18 pendentes • 3 atrasadas • 58 feitas',
      icon: CheckSquare,
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
      action: 'meu_kanban' as ViewScreen
    },
    {
      id: 'kpi-demandas',
      title: 'Demandas & Chamados',
      value: '32',
      label: '14 abertas • 12 andamento • 6 resolvidas',
      icon: PhoneCall,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      action: 'chamados' as ViewScreen
    },
    {
      id: 'kpi-ponto',
      title: 'Controle de Ponto',
      value: '44',
      label: 'Presentes hoje • 3 atrasos • 5 HE',
      icon: Clock,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      action: 'registro_ponto' as ViewScreen
    },
    {
      id: 'kpi-horas',
      title: 'Horas Apontadas',
      value: '296h',
      label: 'Atividades registradas na semana',
      icon: Activity,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
      action: 'planilhas' as ViewScreen
    },
    {
      id: 'kpi-produtividade',
      title: 'Produtividade Geral',
      value: '93.2%',
      label: 'SLA consolidado da TI ByComp',
      icon: TrendingUp,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      action: 'relatorios' as ViewScreen
    }
  ];

  // Executive Pillars (Requirement 28: Dashboard Executivo para Gestores)
  const executivePillars = [
    {
      id: 'exec-empresa',
      pillar: 'EMPRESA',
      title: 'Colaboradores Ativos',
      metric: '37 / 48 em Produção',
      subtext: '4 Ausentes • 7 em Intervalo • 100% dos 7 setores operando',
      icon: Users,
      badge: 'Normal',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      action: 'colaboradores' as ViewScreen
    },
    {
      id: 'exec-operacao',
      pillar: 'OPERAÇÃO',
      title: 'Chamados & SLA',
      metric: '32 Demandas Ativas',
      subtext: 'SLA médio consolidado em 97.4% • 0 chamados críticos sem técnico',
      icon: PhoneCall,
      badge: '97.4% SLA',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      action: 'chamados' as ViewScreen
    },
    {
      id: 'exec-produtividade',
      pillar: 'PRODUTIVIDADE',
      title: 'Tarefas & Entregas',
      metric: '58 Entregas na Semana',
      subtext: '18 Pendências • 3 Atrasadas leves • Ciclo médio 1.8 dias',
      icon: CheckSquare,
      badge: 'Alta Performance',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      action: 'meu_kanban' as ViewScreen
    },
    {
      id: 'exec-ponto',
      pillar: 'PONTO ELETRÔNICO',
      title: 'Presença & Assiduidade',
      metric: '91.8% Frequência',
      subtext: '44 Presentes • 3 Atrasos justificados • 5 Horas Extras autorizadas',
      icon: Clock,
      badge: 'Auditado',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      action: 'espelho_ponto' as ViewScreen
    },
    {
      id: 'exec-dev',
      pillar: 'DESENVOLVIMENTO',
      title: 'Projetos em Curso',
      metric: '4 Sprints em Andamento',
      subtext: 'Portal ByComp, Core API v2, Mobile App e Mensageria Kafka',
      icon: Layers,
      badge: 'Sprint 14',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
      action: 'kanban_equipe' as ViewScreen
    },
    {
      id: 'exec-seguranca',
      pillar: 'SEGURANÇA (SOC)',
      title: 'Alertas & Integridade',
      metric: '0 Incidentes Críticos',
      subtext: 'Firewalls e VPNs 100% estáveis • 2 avisos de latência BGP tratados',
      icon: Shield,
      badge: 'SOC Ativo',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      action: 'auditoria' as ViewScreen
    },
    {
      id: 'exec-dba',
      pillar: 'BANCO DE DADOS',
      title: 'Status dos Bancos',
      metric: 'PostgreSQL 99.98% Up',
      subtext: 'Replicação MongoDB OK • Particionamento executado • Backup 100%',
      icon: Database,
      badge: 'Saudável',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
      action: 'planilhas' as ViewScreen
    },
    {
      id: 'exec-adm',
      pillar: 'ADMINISTRATIVO',
      title: 'Pendências Corporativas',
      metric: '1 Folha em Aprovação',
      subtext: '2 Formulários de reembolso e 1 solicitação de insumo pendente',
      icon: Briefcase,
      badge: 'RH / Financeiro',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      action: 'formularios' as ViewScreen
    }
  ];

  const totalTasks = TASK_STATUS_BREAKDOWN.reduce((acc, curr) => acc + curr.count, 0);

  // Breakdown of electronic time clock for today
  const timeClockStats = [
    { label: 'Presentes', count: 44, icon: UserCheck, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    { label: 'Ausentes', count: 4, icon: UserX, color: 'text-slate-400 bg-slate-900 border-slate-800' },
    { label: 'Atrasados', count: 3, icon: AlertCircle, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { label: 'Em Intervalo', count: 7, icon: Coffee, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' },
    { label: 'Hora Extra', count: 5, icon: Flame, color: 'text-rose-400 bg-rose-950/60 border-rose-800' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="main-dashboard-container">
      {/* Welcome Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              ByComp — Gestão Integrada
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              100% Monitorada
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Painel unificado conectando Administração, Suporte, Desenvolvimento, Dados e Segurança.
          </p>
        </div>

        {/* Mode Toggle & UX/UI Shortcut */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dashboard Mode Selector */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setDashboardMode('operacional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dashboardMode === 'operacional'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visão Operacional
            </button>
            <button
              onClick={() => setDashboardMode('executivo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dashboardMode === 'executivo'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visão Executiva (Gestão)
            </button>
          </div>

          <button
            onClick={() => onNavigate('design_system')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold transition-all cursor-pointer"
            title="Acessar Wireframes, Mapa de Navegação e Design System (Fase 2)"
          >
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            <span>Fase 2: UX/UI Design</span>
          </button>

          <button
            onClick={() => onNavigate('organograma')}
            id="btn-dashboard-organograma"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-bold transition-all cursor-pointer"
            title="Acessar Organograma Institucional, Estrutura e Linhas de Comando (Fase 3)"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fase 3: Organograma</span>
          </button>

          <button
            onClick={() => onNavigate('colaboradores')}
            id="btn-dashboard-colaboradores-fase4"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-md"
            title="Acessar Área Privada de Colaboradores e Dossiê RH (Fase 4 • Gestão, Adm e RH)"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fase 4: Colaboradores (Privada)</span>
          </button>
        </div>
      </div>

      {/* 6 KEY OPERATIONAL KPIS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {operationalKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              onClick={() => onNavigate(kpi.action)}
              className="p-4 rounded-2xl border bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                  {kpi.title}
                </span>
                <div className={`p-1.5 rounded-lg bg-slate-800 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                {kpi.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* CONDITIONAL RENDERING: VISÃO EXECUTIVA (GESTOR/DIRETORIA) */}
      {dashboardMode === 'executivo' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="executive-pillars-grid">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Os 8 Pilares da Gestão Executiva ByComp
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoramento consolidado para tomada de decisão ágil sem ruído técnico.
              </p>
            </div>

            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
              Visão Gerencial Ativa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {executivePillars.map((ep) => {
              const Icon = ep.icon;
              return (
                <div
                  key={ep.id}
                  onClick={() => onNavigate(ep.action)}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        {ep.pillar}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ep.badgeColor}`}>
                        {ep.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {ep.title}
                        </h3>
                        <div className="text-lg font-black text-slate-100 mt-0.5">
                          {ep.metric}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      {ep.subtext}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] group-hover:text-slate-300">Explorar módulo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTROLE DE PONTO ELETRÔNICO HOJE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Status do Ponto Eletrônico Hoje (48 Colaboradores)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Jornada de trabalho acompanhada em tempo real com tolerância legal de 10 min.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gestao_ponto')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 self-start sm:self-center"
          >
            <span>Gerenciar Ponto (Admin)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {timeClockStats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${item.color} flex items-center justify-between`}
              >
                <div>
                  <span className="text-xs font-semibold block opacity-80">{item.label}</span>
                  <div className="text-xl font-black text-white mt-0.5">{item.count}</div>
                </div>
                <Icon className="w-5 h-5 opacity-80" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRÁFICO — PRODUTIVIDADE POR SETOR (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">PRODUTIVIDADE POR SETOR (SLA)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                N1, N2, N3, Front-End, Back-End, Cyber Security e DBA
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
              7 Setores Ativos
            </span>
          </div>

          {/* Visual Sector Bar Chart */}
          <div className="space-y-3.5 my-2">
            {SECTOR_PRODUCTIVITY.map((sec) => (
              <div
                key={sec.sector}
                onMouseEnter={() => setSelectedSector(sec.sector)}
                onMouseLeave={() => setSelectedSector(null)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  selectedSector === sec.sector ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{sec.sector}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({sec.tasksDone} concluídas • {sec.inProgress} em curso)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400">Meta: {sec.SLA}</span>
                    <span className="font-mono font-bold text-cyan-400 text-xs">
                      {sec.score}%
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${sec.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Média geral da TI: <strong className="text-emerald-400 font-mono">93.2%</strong></span>
            <button
              onClick={() => onNavigate('relatorios')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Ver relatório consolidado</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* GRÁFICO — STATUS DAS TAREFAS (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">STATUS DAS TAREFAS (126 TOTAL)</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                100% Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Distribuição: Pendentes, Em andamento, Em revisão, Concluídas e Atrasadas
            </p>

            {/* Visual breakdown horizontal stacked meter */}
            <div className="w-full h-4 bg-slate-800 rounded-lg overflow-hidden flex mb-5 shadow-inner">
              {TASK_STATUS_BREAKDOWN.map((st) => {
                const pct = ((st.count / totalTasks) * 100).toFixed(1);
                return (
                  <div
                    key={st.name}
                    title={`${st.name}: ${st.count} (${pct}%)`}
                    style={{ width: `${pct}%`, backgroundColor: st.color }}
                    className="h-full hover:opacity-80 transition-opacity"
                  ></div>
                );
              })}
            </div>

            {/* Legend & Breakdown rows */}
            <div className="space-y-2">
              {TASK_STATUS_BREAKDOWN.map((st) => {
                const pct = ((st.count / totalTasks) * 100).toFixed(0);
                return (
                  <div
                    key={st.name}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: st.color }}
                      ></span>
                      <span className="font-semibold text-slate-300">{st.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-white font-bold">{st.count}</span>
                      <span className="text-slate-400 text-[11px] w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Ciclo médio de entrega: <strong>1.8 dias</strong></span>
            <button
              onClick={() => onNavigate('meu_kanban')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Abrir Meu Kanban</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: ATIVIDADES DA SEMANA & AGENDA & ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ATIVIDADES RECENTES (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">ATIVIDADES DA SEMANA & REGISTROS</h3>
            </div>
            <button
              onClick={() => onNavigate('planilhas')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Base Completa de Atividades</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 shrink-0">
                  {act.time}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {act.text}
                  </p>
                </div>

                <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                  {act.sector}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AGENDA DO DIA & ALERTAS (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            {/* AGENDA HOJE */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">AGENDA DO DIA</h3>
              </div>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-[11px] text-teal-400 hover:underline"
              >
                Ver calendário
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {MOCK_CALENDAR_EVENTS.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{ev.title}</span>
                    <span className="text-[11px] text-slate-400">{ev.location} • {ev.type}</span>
                  </div>
                  <span className="font-mono text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-950/80 border border-teal-800 text-[10px]">
                    {ev.time}
                  </span>
                </div>
              ))}
            </div>

            {/* ALERTAS */}
            <div className="flex items-center justify-between mb-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">ALERTAS & NOTIFICAÇÕES</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            </div>

            <div className="space-y-2.5">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    alert.type === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-xs">{alert.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('auditoria')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consultar Log de Auditoria & Segurança</span>
          </button>
        </div>
      </div>
    </div>
  );
};
