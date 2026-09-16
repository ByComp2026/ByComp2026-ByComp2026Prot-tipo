import React, { useState } from 'react';
import {
  Users,
  UserCheck,
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
  ShieldCheck
} from 'lucide-react';
import { ViewScreen } from '../../types';
import {
  SECTOR_PRODUCTIVITY,
  TASK_STATUS_BREAKDOWN,
  RECENT_ACTIVITIES,
  MOCK_ALERTS
} from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (screen: ViewScreen) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const kpis = [
    {
      id: 'kpi-colabs',
      title: 'Colaboradores',
      value: '48',
      label: '7 setores cadastrados',
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-cyan-400',
      action: 'colaboradores' as ViewScreen
    },
    {
      id: 'kpi-atividade',
      title: 'Em atividade',
      value: '37',
      label: '77% da equipe em produção',
      icon: UserCheck,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      action: 'colaboradores' as ViewScreen
    },
    {
      id: 'kpi-tarefas',
      title: 'Tarefas',
      value: '126',
      label: '58 concluídas esta semana',
      icon: CheckSquare,
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
      action: 'meu_kanban' as ViewScreen
    },
    {
      id: 'kpi-pendencias',
      title: 'Pendências',
      value: '18',
      label: '3 prioritárias hoje',
      icon: AlertCircle,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      action: 'meu_kanban' as ViewScreen
    },
    {
      id: 'kpi-chamados',
      title: 'Chamados',
      value: '32',
      label: 'SLA médio 97.4%',
      icon: PhoneCall,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      action: 'kanban_equipe' as ViewScreen
    },
    {
      id: 'kpi-presenca',
      title: 'Presença',
      value: '91%',
      label: 'Índice de assiduidade',
      icon: Activity,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
      action: 'espelho_ponto' as ViewScreen
    }
  ];

  const totalTasks = TASK_STATUS_BREAKDOWN.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Bom dia, Victor 👋
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Gestão Ativa
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Aqui está o panorama da empresa hoje.
          </p>
        </div>

        {/* Action shortcut pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('registro_atividades')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Registrar Atividade</span>
          </button>

          <button
            onClick={() => onNavigate('kanban_equipe')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Kanban className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quadro da Equipe</span>
          </button>

          <button
            onClick={() => onNavigate('ai_hub')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Consultar AI Hub</span>
          </button>
        </div>
      </div>

      {/* 6 Key KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              onClick={() => onNavigate(kpi.action)}
              className={`p-4 rounded-xl border bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden`}
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

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRÁFICO — PRODUTIVIDADE POR SETOR (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">PRODUTIVIDADE POR SETOR</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Desempenho operacional, entregas concluídas e SLA médio
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-md">
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
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
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
                    <span className="text-[11px] font-mono text-slate-400">SLA: {sec.SLA}</span>
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
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">STATUS DAS TAREFAS</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                Total: {totalTasks}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Distribuição de demandas em todo o pipeline
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
            <div className="space-y-2.5">
              {TASK_STATUS_BREAKDOWN.map((st) => {
                const pct = ((st.count / totalTasks) * 100).toFixed(0);
                return (
                  <div
                    key={st.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs"
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

      {/* Bottom Row: ATIVIDADES RECENTES (8 cols) & ALERTAS (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ATIVIDADES RECENTES */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">ATIVIDADES RECENTES</h3>
            </div>
            <button
              onClick={() => onNavigate('planilhas')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Ver todas na Base de Atividades</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 shrink-0">
                  {act.time}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {act.text}
                  </p>
                </div>

                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                  {act.sector}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTAS */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">ALERTAS ATIVOS</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            </div>

            <div className="space-y-3">
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
                    <p className="font-semibold text-sm">{alert.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Ação Preventiva Sugerida:</span>
              <span>
                Atribuir chamado crítico pendente ao Suporte N3 e antecipar revisão de backup.
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('auditoria')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consultar Log de Auditoria</span>
          </button>
        </div>
      </div>
    </div>
  );
};
