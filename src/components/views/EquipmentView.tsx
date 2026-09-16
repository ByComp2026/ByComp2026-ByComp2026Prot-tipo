import React, { useState } from 'react';
import {
  Laptop,
  Plus,
  Search,
  Server,
  Monitor,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Cpu
} from 'lucide-react';
import { EQUIPMENT_DATA } from '../../data/mockData';
import { EquipmentItem } from '../../types';

export const EquipmentView: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(EQUIPMENT_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item state
  const [newTag, setNewTag] = useState('PAT-0143');
  const [newType, setNewType] = useState('Notebook');
  const [newModel, setNewModel] = useState('Dell Latitude 5540 i7 32GB');
  const [newAssignee, setNewAssignee] = useState('Victor Estevão');

  const filtered = equipmentList.filter(item => {
    const matchSearch = 
      item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'TODOS' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: EquipmentItem = {
      id: `eq-${Date.now()}`,
      tag: newTag,
      type: newType,
      model: newModel,
      assignee: newAssignee,
      status: 'Em uso',
      deliveryDate: '16/09/2026'
    };
    setEquipmentList([newItem, ...equipmentList]);
    setIsModalOpen(false);
    setToastMessage(`✓ Equipamento ${newTag} tombado e vinculado ao colaborador.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Controle de Equipamentos & Patrimônio
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inventário corporativo de hardware, termos de custódia e ciclo de vida de ativos
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="btn-cadastrar-equipamento"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar equipamento</span>
        </button>
      </div>

      {/* 4 Cards Requested by User:
          - Total de itens: 142
          - Em uso: 118
          - Em estoque: 19
          - Em manutenção: 5 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Total de itens</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-white">142</span>
            <span className="text-[10px] text-slate-400 font-mono">100% Tombados</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Em uso</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">118</span>
            <span className="text-[10px] text-emerald-400 font-mono">83.1% alocados</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Em estoque</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-cyan-400">19</span>
            <span className="text-[10px] text-cyan-400 font-mono">Prontos para setup</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Em manutenção</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-amber-400">5</span>
            <span className="text-[10px] text-amber-400 font-mono">Garantia / Reparo</span>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por tag de patrimônio, modelo ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
        >
          <option value="TODOS">Status: Todos</option>
          <option value="Em uso">Em uso</option>
          <option value="Estoque">Estoque</option>
          <option value="Manutenção">Manutenção</option>
        </select>
      </div>

      {/* Table: Patrimônio, Tipo, Modelo, Responsável / Setor, Status, Data de entrega */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Patrimônio</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 min-w-[200px]">Modelo</th>
                <th className="py-3 px-4">Responsável / Setor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data de entrega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-cyan-400 font-bold">{item.tag}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    <span className="flex items-center gap-1.5">
                      {item.type === 'Notebook' && <Laptop className="w-3.5 h-3.5 text-cyan-400" />}
                      {item.type === 'Servidor' && <Server className="w-3.5 h-3.5 text-indigo-400" />}
                      {item.type === 'Switch' && <HardDrive className="w-3.5 h-3.5 text-amber-400" />}
                      {item.type === 'Monitor' && <Monitor className="w-3.5 h-3.5 text-emerald-400" />}
                      {item.type === 'Headset' && <Headphones className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{item.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-white">{item.model}</td>
                  <td className="py-3 px-4 font-sans text-slate-300">{item.assignee}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'Em uso'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.status === 'Estoque'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: + Cadastrar equipamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Cadastrar Ativo de Patrimônio
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tag de Patrimônio
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipo de Equipamento
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Notebook">Notebook</option>
                  <option value="Servidor">Servidor</option>
                  <option value="Switch">Switch</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Headset">Headset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Modelo e Especificação
                </label>
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Responsável / Custodiante
                </label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
                >
                  Cadastrar Ativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
