import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckSquare
} from 'lucide-react';
import { WEEKLY_PLANNING_DAYS } from '../../data/mockData';

export const WeeklyPlanningView: React.FC = () => {
  const indicators = [
    {
      title: 'Tarefas planejadas',
      value: '42',
      icon: Target,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
    },
    {
      title: 'Tarefas concluídas',
      value: '29',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
    },
    {
      title: 'Tarefas atrasadas',
      value: '3',
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/60'
    },
    {
      title: 'Horas estimadas',
      value: '168h',
      icon: Clock,
      color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Planejamento Semanal</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
            <span className="font-semibold text-cyan-300">Semana:</span>
            <span>14/09/2026 — 20/09/2026</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-emerald-400">Sprint 34 em andamento</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Meta da Sprint: 85% Conclusão</span>
        </div>
      </div>

      {/* 4 Indicadores solicitados pelo usuário */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indicators.map((ind, idx) => {
          const Icon = ind.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400">{ind.title}</span>
                <p className="text-2xl font-black text-white font-mono mt-1">{ind.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${ind.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 5 Days Grid: SEG, TER, QUA, QUI, SEX */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {WEEKLY_PLANNING_DAYS.map((dayPlan) => (
          <div
            key={dayPlan.day}
            className={`rounded-2xl border p-4 flex flex-col min-h-[440px] shadow-lg transition-all ${
              dayPlan.isToday
                ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900/90 border-cyan-500/80 ring-1 ring-cyan-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-wider">
                  {dayPlan.day}
                </span>
                <span className="text-xs font-mono text-slate-400">{dayPlan.date}</span>
              </div>

              {dayPlan.isToday && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950">
                  Hoje
                </span>
              )}
            </div>

            {/* Activities list for the day */}
            <div className="space-y-3 flex-1">
              {dayPlan.tasks.map((task, tIdx) => (
                <div
                  key={tIdx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">{task.time}</span>
                    <span className="text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                      {task.duration}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 leading-snug">
                    {task.title}
                  </h4>

                  <span className="inline-block text-[10px] font-medium text-slate-400">
                    Setor: <strong className="text-slate-300">{task.sector}</strong>
                  </span>
                </div>
              ))}
            </div>

            {/* Day footer */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 text-center">
              {dayPlan.tasks.length} atividades alocadas
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
