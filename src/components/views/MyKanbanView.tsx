import React, { useState, useEffect } from 'react';
import {
  Kanban as KanbanIcon,
  Plus,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Filter,
  Layers,
  Sparkles,
  Trash2,
  Database
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { Task, TaskStatus, Priority, Collaborator } from '../../types';
import { taskService } from '../../services/taskService';

interface MyKanbanViewProps {
  currentUser?: Collaborator;
}

export const MyKanbanView: React.FC<MyKanbanViewProps> = ({
  currentUser = CURRENT_USER
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Média');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Subscribe in real-time to Firebase Firestore tasks
  useEffect(() => {
    const unsubscribe = taskService.subscribeTasks((allTasks) => {
      // Filter tasks assigned to current user or related to their sector
      const myTasks = allTasks.filter(
        t => t.assigneeName === currentUser.name ||
             (t.sector && currentUser.sector && t.sector.toLowerCase() === currentUser.sector.toLowerCase()) ||
             t.assigneeName === 'Victor Estevão' ||
             currentUser.userRole === 'SUPER_ADMIN'
      );
      setTasks(myTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const columns: { id: TaskStatus; label: string; countColor: string }[] = [
    { id: 'BACKLOG', label: 'BACKLOG', countColor: 'bg-slate-800 text-slate-400' },
    { id: 'A_FAZER', label: 'A FAZER', countColor: 'bg-blue-950 text-blue-300 border border-blue-800' },
    { id: 'EM_ANDAMENTO', label: 'EM ANDAMENTO', countColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800' },
    { id: 'EM_REVISAO', label: 'EM REVISÃO', countColor: 'bg-amber-950 text-amber-300 border border-amber-800' },
    { id: 'CONCLUIDO', label: 'CONCLUÍDO', countColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800' }
  ];

  const moveTask = async (taskId: string, targetStatus: TaskStatus) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));
    const movedTask = tasks.find(t => t.id === taskId);
    setFeedback(`✓ "${movedTask?.title || 'Tarefa'}" movido para ${targetStatus.replace('_', ' ')} (Firebase sincronizado)`);
    setTimeout(() => setFeedback(null), 3500);

    try {
      await taskService.updateTaskStatus(taskId, targetStatus);
    } catch (err) {
      console.error('Erro ao atualizar status no Firebase:', err);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (colId: TaskStatus) => {
    if (draggedTaskId) {
      moveTask(draggedTaskId, colId);
      setDraggedTaskId(null);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const created = await taskService.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || 'Nova tarefa inserida no fluxo de trabalho individual.',
        sector: (currentUser.sector as any) || 'Suporte N2',
        assigneeName: currentUser.name,
        priority: newTaskPriority,
        status: 'A_FAZER',
        deadline: new Date(Date.now() + 3 * 86400000).toLocaleDateString('pt-BR'),
        tag: currentUser.sector || 'Operação',
        commentsCount: 0,
        subtasks: []
      });

      setTasks(prev => [created, ...prev]);
      setNewTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setFeedback('✓ Nova tarefa gravada com sucesso no Firebase Firestore!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      setFeedback('Erro ao salvar no Firebase. Verifique conexão.');
    }
  };

  const handleDeleteTask = async (taskId: string, title: string) => {
    if (!window.confirm(`Excluir a tarefa "${title}" do Firebase?`)) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await taskService.deleteTask(taskId);
      setFeedback(`✓ Tarefa "${title}" removida do Firebase.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <KanbanIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Meu Kanban</h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {currentUser.name} • {currentUser.sector}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Firebase Firestore 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Quadro pessoal de atividades, prazos e prioridades operacionais
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewTaskModal(true)}
            id="btn-nova-tarefa-meu-kanban"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 5 Columns Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col, cIdx) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 flex flex-col min-h-[550px] shadow-lg transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    id={`task-card-${task.id}`}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all shadow-md group cursor-grab active:cursor-grabbing relative"
                  >
                    {/* Top row: Priority & Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        task.priority === 'Urgente'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : task.priority === 'Alta'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : task.priority === 'Média'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800/70 px-1.5 py-0.5 rounded">
                          {task.tag}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id, task.title);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Excluir tarefa do Firebase"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Footer: Responsável & Prazo */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-cyan-600 text-[10px] font-bold flex items-center justify-center text-white">
                          VE
                        </div>
                        <span className="text-[11px] text-slate-300 truncate max-w-[80px]">
                          {task.assigneeName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{task.deadline}</span>
                      </div>
                    </div>

                    {/* Quick Move Arrows for ease of presentation */}
                    <div className="mt-2 pt-1 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        disabled={cIdx === 0}
                        onClick={() => moveTask(task.id, columns[cIdx - 1]?.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 text-[10px] flex items-center gap-0.5"
                        title="Mover para esquerda"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[9px] text-slate-500 font-mono">Arraste ou clique</span>
                      <button
                        type="button"
                        disabled={cIdx === columns.length - 1}
                        onClick={() => moveTask(task.id, columns[cIdx + 1]?.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 text-[10px] flex items-center gap-0.5"
                        title="Mover para direita"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                    Arraste cards para cá
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: + Nova Tarefa */}
      {newTaskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Nova Tarefa no Meu Kanban
              </h3>
              <button
                onClick={() => setNewTaskModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Auditoria de logs do servidor"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
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

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewTaskModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
