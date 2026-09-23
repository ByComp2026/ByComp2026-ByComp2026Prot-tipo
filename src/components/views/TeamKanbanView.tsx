import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Database,
  Trash2,
  X
} from 'lucide-react';
import { SECTORS, MOCK_COLLABORATORS, CURRENT_USER } from '../../data/mockData';
import { Task, TaskStatus, Sector, Priority, Collaborator } from '../../types';
import { taskService } from '../../services/taskService';

interface TeamKanbanViewProps {
  currentUser?: Collaborator;
}

export const TeamKanbanView: React.FC<TeamKanbanViewProps> = ({
  currentUser = CURRENT_USER
}) => {
  const [selectedSector, setSelectedSector] = useState<Sector>(
    (currentUser.sector as Sector) || 'Suporte N2'
  );
  const [selectedWeek, setSelectedWeek] = useState('14/09/2026 → 20/09/2026');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser.name);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Alta');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Subscribe in real-time to Firebase Firestore tasks
  useEffect(() => {
    const unsubscribe = taskService.subscribeTasks((allTasks) => {
      setTasks(allTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const teamColumns: { id: TaskStatus; label: string }[] = [
    { id: 'A_FAZER', label: 'A FAZER' },
    { id: 'EM_ANDAMENTO', label: 'EM ANDAMENTO' },
    { id: 'EM_REVISAO', label: 'EM REVISÃO' },
    { id: 'CONCLUIDO', label: 'CONCLUÍDO' }
  ];

  // Sector members
  const sectorMembers = MOCK_COLLABORATORS.filter(c => c.sector === selectedSector);

  const currentSectorTasks = tasks.filter(t => 
    selectedSector === 'TODOS' ? true : (t.sector && t.sector.toLowerCase() === selectedSector.toLowerCase()) || (!t.sector && selectedSector === 'Suporte N2')
  );

  const handleUpdateStatus = async (taskId: string, targetStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));
    try {
      await taskService.updateTaskStatus(taskId, targetStatus);
      setFeedback(`✓ Tarefa movida para ${targetStatus.replace('_', ' ')} (Firebase atualizado)`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleCreateTeamTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const created = await taskService.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || `Demanda atribuída à squad ${selectedSector}.`,
        sector: selectedSector,
        assigneeName: newTaskAssignee || currentUser.name,
        priority: newTaskPriority,
        status: 'A_FAZER',
        deadline: new Date(Date.now() + 4 * 86400000).toLocaleDateString('pt-BR'),
        tag: selectedSector,
        commentsCount: 0,
        subtasks: [
          { id: 'sub-1', title: 'Triagem técnica inicial', done: false },
          { id: 'sub-2', title: 'Execução e validação em homologação', done: false }
        ]
      });

      setTasks(prev => [created, ...prev]);
      setIsNewTaskModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setFeedback('✓ Nova tarefa de equipe criada e salva no Firebase Firestore!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Erro ao criar tarefa no Firebase:', err);
      setFeedback('Erro ao gravar no Firebase.');
    }
  };

  const handleDeleteTask = async (taskId: string, title: string) => {
    if (!window.confirm(`Excluir a tarefa "${title}" do Firebase?`)) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskDetail?.id === taskId) setActiveTaskDetail(null);
    try {
      await taskService.deleteTask(taskId);
      setFeedback(`✓ Tarefa "${title}" excluída com sucesso do Firebase.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Selectors requested by user */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Kanban da Equipe</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3" />
              Firebase Firestore 100%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fluxo coletivo de trabalho, distribuição de chamados e colaboração em tempo real no Firestore
          </p>
        </div>

        {/* Setor & Semana Selectors & New Task Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Create Task Button */}
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            id="btn-nova-tarefa-equipe"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Tarefa</span>
          </button>

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
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

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
                  const doneSubtasks = task.subtasks?.filter(s => s.done).length || 0;
                  const totalSubtasks = task.subtasks?.length || 2;
                  const completedCount = task.subtasks?.length ? doneSubtasks : (col.id === 'CONCLUIDO' ? totalSubtasks : 0);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setActiveTaskDetail(task)}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-sm cursor-pointer space-y-2.5"
                    >
                      {/* Priority & Tag & Delete */}
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

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{task.deadline}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id, task.title);
                            }}
                            className="text-slate-600 hover:text-rose-400 p-0.5 transition-colors"
                            title="Excluir do Firebase"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
                            style={{ width: `${(completedCount / Math.max(totalSubtasks, 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer: Responsável & Comentários */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-[10px] font-bold text-white flex items-center justify-center ring-1 ring-cyan-500">
                            {(task.assigneeName || 'TI').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-[11px] font-medium text-slate-300 truncate max-w-[90px]">
                            {task.assigneeName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          <span>{task.commentsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-slate-600 text-xs text-center p-2">
                    Nenhuma tarefa nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nova Tarefa de Equipe */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Nova Demanda no Kanban da Equipe
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeamTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Auditoria técnica e atualização do cluster"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Responsável Técnico
                </label>
                <input
                  type="text"
                  placeholder="Nome do colaborador responsável"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Setor Alvo
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value as Sector)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {SECTORS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 cursor-pointer"
                >
                  Gravar no Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="text-slate-400 hover:text-white cursor-pointer"
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

            {/* Mover Status Rápido no Firebase */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 block">Status da Demanda (Firebase):</span>
              <div className="grid grid-cols-4 gap-2">
                {teamColumns.map(col => (
                  <button
                    key={col.id}
                    onClick={() => {
                      handleUpdateStatus(activeTaskDetail.id, col.id);
                      setActiveTaskDetail({ ...activeTaskDetail, status: col.id });
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      activeTaskDetail.status === col.id
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks checklist */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Checklist de Subtarefas:</span>
              <div className="space-y-1.5">
                {(activeTaskDetail.subtasks || []).map((st) => (
                  <div key={st.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 text-xs">
                    <CheckCircle2 className={`w-4 h-4 ${st.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={st.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleDeleteTask(activeTaskDetail.id, activeTaskDetail.title)}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir do Firebase</span>
              </button>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
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
