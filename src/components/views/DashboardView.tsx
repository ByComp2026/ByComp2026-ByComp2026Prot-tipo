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
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Database,
  Shield,
  Briefcase,
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

  const operationalKPIs = [
    {
      id: 'kpi-colabs',
      title: 'Colaboradores Ativos',
      value: '37',
      label: '4 ausentes • 7 intervalo (48 total)',
      icon: Users,
      action: 'colaboradores' as ViewScreen
    },
    {
      id: 'kpi-tarefas',
      title: 'Tarefas Ativas',
      value: '126',
      label: '18 pendentes • 3 atrasadas • 58 feitas',
      icon: CheckSquare,
      action: 'meu_kanban' as ViewScreen
    },
    {
      id: 'kpi-demandas',
      title: 'Demandas & Chamados',
      value: '32',
      label: '14 abertas • 12 andamento • 6 resolvidas',
      icon: PhoneCall,
      action: 'chamados' as ViewScreen
    },
    {
      id: 'kpi-ponto',
      title: 'Controle de Ponto',
      value: '44',
      label: 'Presentes hoje • 3 atrasos • 5 HE',
      icon: Clock,
      action: 'registro_ponto' as ViewScreen
    },
    {
      id: 'kpi-horas',
      title: 'Horas Apontadas',
      value: '296h',
      label: 'Atividades registradas na semana',
      icon: Activity,
      action: 'planilhas' as ViewScreen
    },
    {
      id: 'kpi-produtividade',
      title: 'Produtividade Geral',
      value: '93.2%',
      label: 'SLA consolidado da TI ByComp',
      icon: TrendingUp,
      action: 'relatorios' as ViewScreen
    }
  ];

  const executivePillars = [
    {
      id: 'exec-empresa',
      pillar: 'EMPRESA',
      title: 'Colaboradores Ativos',
      metric: '37 / 48 em Produção',
      subtext: '4 Ausentes • 7 em Intervalo • 100% dos 7 setores operando',
      icon: Users,
      badge: 'Normal',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
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
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
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
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
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
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
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
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      action: 'planilhas' as ViewScreen
    }
  ];

  const totalTasks = TASK_STATUS_BREAKDOWN.reduce((acc, curr) => acc + curr.count, 0);

  const timeClockStats = [
    { label: 'Presentes', count: 44, icon: UserCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Ausentes', count: 4, icon: UserX, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    { label: 'Atrasados', count: 3, icon: AlertCircle, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Em Intervalo', count: 7, icon: Coffee, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
    { label: 'Hora Extra', count: 5, icon: Flame, color: 'text-rose-700 bg-rose-50 border-rose-200' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="main-dashboard-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#37558d] tracking-tight">
              ByComp — Gestão Integrada
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#7da2ca]/20 text-[#37558d] border border-[#7da2ca]/40">
              100% Monitorada
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Painel unificado conectando Administração, Suporte, Desenvolvimento, Dados e Segurança.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setDashboardMode('operacional')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-bold ${
                dashboardMode === 'operacional'
                  ? 'bg-[#37558d] text-white shadow-xs'
                  : 'text-[#37558d] hover:bg-[#37558d]/10'
              }`}
            >
              Visão Operacional
            </button>
            <button
              type="button"
              onClick={() => setDashboardMode('executivo')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-bold ${
                dashboardMode === 'executivo'
                  ? 'bg-[#37558d] text-white shadow-xs'
                  : 'text-[#37558d] hover:bg-[#37558d]/10'
              }`}
            >
              Visão Executiva (Gestão)
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('organograma')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#37558d] border border-slate-200 text-[#37558d] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs group"
          >
            <Network className="w-3.5 h-3.5 text-[#37558d] group-hover:text-white transition-colors" />
            <span>Organograma</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('colaboradores')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#37558d] border border-slate-200 text-[#37558d] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs group"
          >
            <Shield className="w-3.5 h-3.5 text-[#37558d] group-hover:text-white transition-colors" />
            <span>Colaboradores</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {operationalKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => onNavigate(kpi.action)}
              className="p-4 rounded-2xl border border-[#37558d] bg-[#37558d] hover:bg-[#2c4472] transition-all cursor-pointer group shadow-xs hover:shadow-md relative overflow-hidden flex flex-col justify-between text-left w-full"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white truncate">
                    {kpi.title}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/20 text-white shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {kpi.value}
                </div>
              </div>
              <p className="text-[11px] text-blue-100 font-medium mt-2 truncate">
                {kpi.label}
              </p>
            </button>
          );
        })}
      </div>

      {dashboardMode === 'executivo' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#37558d]" />
                <h2 className="text-sm font-black text-[#37558d] uppercase tracking-wider">
                  Os 8 Pilares da Gestão Executiva ByComp
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitoramento consolidado para tomada de decisão ágil sem ruído técnico.
              </p>
            </div>

            <span className="text-xs font-mono text-[#37558d] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-bold">
              Visão Gerencial Ativa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {executivePillars.map((ep) => {
              const Icon = ep.icon;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => onNavigate(ep.action)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#37558d] hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between group text-left w-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-black tracking-widest text-[#37558d] uppercase">
                        {ep.pillar}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${ep.badgeColor}`}>
                        {ep.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#37558d] shrink-0">
                        <Icon className="w-5 h-5 text-[#37558d]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {ep.title}
                        </h3>
                        <div className="text-lg font-black text-[#37558d] mt-0.5">
                          {ep.metric}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
                      {ep.subtext}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#37558d]">
                    <span className="text-[11px] font-bold">Explorar módulo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#37558d] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#37558d]" />
              <h3 className="text-sm font-black text-[#37558d] uppercase tracking-wider">
                Status do Ponto Eletrônico Hoje (48 Colaboradores)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Jornada de trabalho acompanhada em tempo real com tolerância legal de 10 min.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('gestao_ponto')}
            className="text-xs text-[#37558d] hover:text-[#1e3a6c] font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>Gerenciar Ponto (Admin)</span>
            <ArrowRight className="w-3 h-3 text-[#37558d]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {timeClockStats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${item.color} flex items-center justify-between shadow-2xs`}
              >
                <div>
                  <span className="text-xs font-bold block opacity-90">{item.label}</span>
                  <div className="text-xl font-black mt-0.5">{item.count}</div>
                </div>
                <Icon className="w-5 h-5 opacity-90" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#37558d]" />
                  <h3 className="font-black text-sm text-[#37558d]">PRODUTIVIDADE POR SETOR (SLA)</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  N1, N2, N3, Front-End, Back-End, Cyber Security e DBA
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#37558d] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                7 Setores Ativos
              </span>
            </div>

            <div className="space-y-3.5 my-2">
              {SECTOR_PRODUCTIVITY.map((sec) => (
                <div
                  key={sec.sector}
                  onMouseEnter={() => setSelectedSector(sec.sector)}
                  onMouseLeave={() => setSelectedSector(null)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    selectedSector === sec.sector ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{sec.sector}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({sec.tasksDone} concluídas • {sec.inProgress} em curso)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500">Meta: {sec.SLA}</span>
                      <span className="font-mono font-bold text-[#37558d] text-xs">
                        {sec.score}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className="h-full bg-[#37558d] rounded-full transition-all duration-500"
                      style={{ width: `${sec.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium mt-4">
            <span>Média geral da TI: <strong className="text-[#37558d] font-mono font-bold">93.2%</strong></span>
            <button
              type="button"
              onClick={() => onNavigate('relatorios')}
              className="text-[#37558d] hover:text-[#1e3a6c] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver relatório consolidado</span>
              <ArrowRight className="w-3 h-3 text-[#37558d]" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#37558d]" />
                <h3 className="font-black text-sm text-[#37558d]">STATUS DAS TAREFAS (126 TOTAL)</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#37558d] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                100% Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Distribuição: Pendentes, Em andamento, Em revisão, Concluídas e Atrasadas
            </p>

            <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden flex mb-5 shadow-inner border border-slate-200">
              {TASK_STATUS_BREAKDOWN.map((st) => {
                const pct = totalTasks > 0 ? ((st.count / totalTasks) * 100).toFixed(1) : '0';
                return (
                  <div
                    key={st.name}
                    aria-label={`${st.name}: ${st.count} (${pct}%)`}
                    title={`${st.name}: ${st.count} (${pct}%)`}
                    style={{ width: `${pct}%`, backgroundColor: st.color }}
                    className="h-full hover:opacity-80 transition-opacity"
                  ></div>
                );
              })}
            </div>

            <div className="space-y-2">
              {TASK_STATUS_BREAKDOWN.map((st) => {
                const pct = totalTasks > 0 ? ((st.count / totalTasks) * 100).toFixed(0) : '0';
                return (
                  <div
                    key={st.name}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: st.color }}
                      ></span>
                      <span className="font-bold text-slate-800">{st.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#37558d] font-bold">{st.count}</span>
                      <span className="text-slate-500 text-[11px] w-10 text-right font-medium">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">Ciclo médio de entrega: <strong className="text-[#37558d] font-bold">1.8 dias</strong></span>
            <button
              type="button"
              onClick={() => onNavigate('meu_kanban')}
              className="text-[#37558d] hover:text-[#1e3a6c] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Meu Kanban</span>
              <ArrowRight className="w-3 h-3 text-[#37558d]" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#37558d]" />
              <h3 className="font-black text-sm text-[#37558d]">ATIVIDADES DA SEMANA & REGISTROS</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('planilhas')}
              className="text-xs text-[#37558d] hover:text-[#1e3a6c] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Base Completa de Atividades</span>
              <ArrowRight className="w-3 h-3 text-[#37558d]" />
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
              >
                <span className="font-mono text-xs font-bold text-[#37558d] px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 shrink-0">
                  {act.time}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {act.text}
                  </p>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-[#37558d] border border-blue-200 shrink-0">
                  {act.sector}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#37558d]" />
                <h3 className="font-black text-sm text-[#37558d]">AGENDA DO DIA</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('agenda')}
                className="text-[11px] text-[#37558d] font-bold hover:underline cursor-pointer"
              >
                Ver calendário
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {MOCK_CALENDAR_EVENTS.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{ev.title}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{ev.location} • {ev.type}</span>
                  </div>
                  <span className="font-mono text-[#37558d] font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px]">
                    {ev.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-black text-sm text-[#37558d]">ALERTAS & NOTIFICAÇÕES</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </div>

            <div className="space-y-2.5">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-xs">{alert.text}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('auditoria')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#37558d] hover:text-white text-xs font-bold text-[#37558d] flex items-center justify-center gap-1.5 transition-all border border-slate-200 cursor-pointer shadow-2xs group"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#37558d] group-hover:text-white transition-colors" />
            <span>Consultar Log de Auditoria & Segurança</span>
          </button>
        </div>
      </div>
    </div>
  );
};