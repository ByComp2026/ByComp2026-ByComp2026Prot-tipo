import React, { useState } from 'react';
import {
  Kanban as KanbanIcon,
  Filter,
  Calendar,
  MessageSquare,
  CheckSquare,
  Clock,
  Plus,
  Users,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_TASKS, SECTORS, MOCK_COLLABORATORS } from '../../data/mockData';
import { Task, TaskStatus, Sector } from '../../types';

export const TeamKanbanView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<Sector>('Suporte N2');
  const [selectedWeek, setSelectedWeek] = useState('14/09/2026 → 20/09/2026');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);

  const teamColumns: { id: TaskStatus; label: string }[] = [
    { id: 'A_FAZER', label: 'A FAZER' },
    { id: 'EM_ANDAMENTO', label: 'EM ANDAMENTO' },
    { id: 'EM_REVISAO', label: 'EM REVISÃO' },
    { id: 'CONCLUIDO', label: 'CONCLUÍDO' }
  ];

  // Sector members
  const sectorMembers = MOCK_COLLABORATORS.filter(c => c.sector === selectedSector);

  const currentSectorTasks = tasks.filter(t => 
    selectedSector === 'Suporte N2' ? true : t.sector === selectedSector
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Selectors requested by user */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Kanban da Equipe</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fluxo coletivo de trabalho, distribuição de chamados e colaboração em tempo real
          </p>
        </div>

        {/* Setor & Semana Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Setor Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-400">Setor:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as Sector)}
              id="select-setor-kanban-equipe"
              className="bg-transparent text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec} className="bg-slate-900 text-white">
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Semana Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400">Semana:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer font-mono"
            >
              <option value="14/09/2026 → 20/09/2026" className="bg-slate-900">
                14/09/2026 → 20/09/2026
              </option>
              <option value="21/09/2026 → 27/09/2026" className="bg-slate-900">
                21/09/2026 → 27/09/2026
              </option>
            </select>
          </div>

          {/* Sector Members Avatars */}
          <div className="hidden lg:flex items-center -space-x-2 pl-2">
            {sectorMembers.slice(0, 4).map((m) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
              />
            ))}
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
              +{sectorMembers.length > 4 ? sectorMembers.length - 4 : 2}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Team Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamColumns.map((col) => {
          const colTasks = currentSectorTasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-[500px] shadow-lg"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => {
                  const doneSubtasks = task.subtasks.filter(s => s.done).length;
                  const totalSubtasks = task.subtasks.length || 3;
                  const completedCount = task.subtasks.length > 0 ? doneSubtasks : (col.id === 'CONCLUIDO' ? totalSubtasks : 1);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setActiveTaskDetail(task)}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-sm cursor-pointer space-y-2.5"
                    >
                      {/* Priority & Tag */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          task.priority === 'Urgente'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : task.priority === 'Alta'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}>
                          {task.priority}
                        </span>

                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.deadline}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {task.title}
                      </h4>

                      {/* Subtasks Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <CheckSquare className="w-3 h-3 text-cyan-400" />
                            <span>Subtarefas</span>
                          </span>
                          <span>{completedCount}/{totalSubtasks}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full transition-all"
                            style={{ width: `${(completedCount / totalSubtasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer: Responsável & Comentários */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-[10px] font-bold text-white flex items-center justify-center ring-1 ring-cyan-500">
                            {task.assigneeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-[11px] font-medium text-slate-300 truncate max-w-[90px]">
                            {task.assigneeName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          <span>{task.commentsCount}</span>
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

      {/* Detail Modal if clicked */}
      {activeTaskDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  {activeTaskDetail.sector} • ID: {activeTaskDetail.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeTaskDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {activeTaskDetail.description || 'Descrição detalhada do fluxo operacional atribuído à equipe de TI.'}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Responsável</span>
                <span className="font-semibold text-white">{activeTaskDetail.assigneeName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Prazo de Entrega</span>
                <span className="font-semibold text-cyan-400 font-mono">{activeTaskDetail.deadline}</span>
              </div>
            </div>

            {/* Subtasks checklist */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Checklist de Subtarefas:</span>
              <div className="space-y-1.5">
                {activeTaskDetail.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 text-xs">
                    <CheckCircle2 className={`w-4 h-4 ${st.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={st.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
