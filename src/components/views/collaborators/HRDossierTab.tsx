import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Eye,
  EyeOff,
  Search,
  Filter,
  ShieldCheck,
  Stethoscope,
  Clock,
  Briefcase,
  DollarSign,
  HeartPulse,
  BadgeCheck,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Lock,
  Layers,
  FileText
} from 'lucide-react';
import { Collaborator } from '../../../types';
import { exportPrivateHRDossierToExcel } from '../../../utils/excelExport';

interface HRDossierTabProps {
  collaborators: Collaborator[];
  onSelectCollaborator: (c: Collaborator) => void;
  showToast: (msg: string) => void;
}

export const HRDossierTab: React.FC<HRDossierTabProps> = ({
  collaborators,
  onSelectCollaborator,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [contractFilter, setContractFilter] = useState<'TODOS' | 'CLT' | 'PJ' | 'Estágio'>('TODOS');
  const [asoFilter, setAsoFilter] = useState<'TODOS' | 'Em dia' | 'A renovar'>('TODOS');
  const [showSalaries, setShowSalaries] = useState(false);

  // Filtered dataset
  const filtered = collaborators.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.sector && c.sector.toLowerCase().includes(search.toLowerCase())) ||
      (c.cpfMasked && c.cpfMasked.includes(search));

    const matchContract = contractFilter === 'TODOS' || c.contractType === contractFilter;
    const matchAso = asoFilter === 'TODOS' || c.asoStatus === asoFilter;

    return matchSearch && matchContract && matchAso;
  });

  // Calculate stats
  const totalCount = collaborators.length;
  const cltCount = collaborators.filter(c => c.contractType === 'CLT').length;
  const pjCount = collaborators.filter(c => c.contractType === 'PJ').length;
  const estagioCount = collaborators.filter(c => c.contractType === 'Estágio').length;
  const asoOkCount = collaborators.filter(c => c.asoStatus === 'Em dia').length;
  const asoPendingCount = collaborators.filter(c => c.asoStatus === 'A renovar').length;

  const handleExportExcel = () => {
    exportPrivateHRDossierToExcel(collaborators);
    showToast('✓ Dossiê Confidencial de RH exportado com sucesso em Excel (.xlsx)!');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* KPI Cards: Resumo de Pessoal & Saúde Ocupacional */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Total Colaboradores */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Quadro Ativo</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{totalCount}</span>
            <span className="text-xs text-slate-400 ml-1.5">profissionais</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            <span>100% integrados</span>
          </div>
        </div>

        {/* Regimes Contratuais */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Regimes</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-white">{cltCount} CLT</span>
            <span className="text-xs text-slate-400 ml-1.5">• {pjCount} PJ</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            <span>{estagioCount} Estagiários corporativos</span>
          </div>
        </div>

        {/* Saúde Ocupacional ASO */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Exames ASO</span>
            <Stethoscope className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400">{asoOkCount}</span>
            <span className="text-xs text-slate-400 ml-1.5">em dia</span>
          </div>
          <div className="text-[10px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{asoPendingCount} renovações próximas</span>
          </div>
        </div>

        {/* Retenção Corporativa */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Retenção de Talentos</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-cyan-400">97.8%</span>
            <span className="text-xs text-slate-400 ml-1.5">índice 2026</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            <span>Turnover anual de 2.2%</span>
          </div>
        </div>

        {/* Governança Salarial */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Política Salarial</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xs font-mono font-bold text-amber-300">
              {showSalaries ? 'Tabela Aberta' : 'Sigilo Ativo (••••)'}
            </span>
          </div>
          <button
            onClick={() => setShowSalaries(!showSalaries)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline text-left mt-1 cursor-pointer"
          >
            {showSalaries ? 'Ocultar Valores' : 'Revelar Valores'}
          </button>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, cargo, matrícula, e-mail ou setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle Show Salaries */}
            <button
              onClick={() => setShowSalaries(!showSalaries)}
              id="btn-toggle-salarios"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showSalaries
                  ? 'bg-amber-950/70 border-amber-600 text-amber-300 hover:bg-amber-900/80'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
              title="Alternar sigilo visual das faixas salariais na tela"
            >
              {showSalaries ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ocultar Salários</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Revelar Salários</span>
                </>
              )}
            </button>

            {/* Export Excel (.xlsx) */}
            <button
              onClick={handleExportExcel}
              id="btn-export-dossie-rh"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-950/60 transition-all cursor-pointer"
              title="Gerar e baixar planilha corporativa confidencial em formato Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Exportar Dossiê (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-800">
          {/* Regime Contratual */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-purple-400" />
              Regime:
            </span>
            {(['TODOS', 'CLT', 'PJ', 'Estágio'] as const).map(regime => (
              <button
                key={regime}
                onClick={() => setContractFilter(regime)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  contractFilter === regime
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                }`}
              >
                {regime}
              </button>
            ))}
          </div>

          {/* Exame ASO */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
            <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-emerald-400" />
              Exame ASO:
            </span>
            {(['TODOS', 'Em dia', 'A renovar'] as const).map(aso => (
              <button
                key={aso}
                onClick={() => setAsoFilter(aso)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  asoFilter === aso
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                }`}
              >
                {aso}
              </button>
            ))}
          </div>

          {/* Active filters counter / clear */}
          {(contractFilter !== 'TODOS' || asoFilter !== 'TODOS' || search !== '') && (
            <button
              onClick={() => {
                setContractFilter('TODOS');
                setAsoFilter('TODOS');
                setSearch('');
              }}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium ml-auto cursor-pointer"
            >
              Limpar Filtros ({filtered.length} encontrados)
            </button>
          )}
        </div>
      </div>

      {/* Confidential Dossier Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Prontuário Funcional & Dados Contratuais de Pessoal
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {filtered.length} colaboradores listados
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Visualização Exclusiva: Gestão, Adm e RH</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-3">Cargo & Setor</th>
                <th className="py-3 px-3">Regime</th>
                <th className="py-3 px-3">Jornada</th>
                <th className="py-3 px-3">Salário Base</th>
                <th className="py-3 px-3">Admissão</th>
                <th className="py-3 px-3">ASO (Saúde)</th>
                <th className="py-3 px-3">Benefícios Ativos</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filtered.map((c, index) => {
                const matricula = `BYC-${String(202600 + index + 1).slice(-5)}`;
                const isExpiring = c.asoStatus === 'A renovar';

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectCollaborator(c)}
                  >
                    {/* Colaborador */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {c.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>Matrícula: {matricula}</span>
                            <span>• CPF: {c.cpfMasked || '***.418.902-**'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cargo & Setor */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-200 truncate max-w-[170px]">{c.role}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {c.sector}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({c.area || 'TI'})
                        </span>
                      </div>
                    </td>

                    {/* Regime */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          c.contractType === 'PJ'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : c.contractType === 'Estágio'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-sky-950 text-sky-300 border-sky-800'
                        }`}
                      >
                        {c.contractType || 'CLT'}
                      </span>
                    </td>

                    {/* Jornada */}
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {c.workSchedule || '40h semanais'}
                    </td>

                    {/* Salário Base */}
                    <td className="py-3 px-3 font-mono font-semibold">
                      {showSalaries ? (
                        <span className="text-amber-300 text-[11px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/60">
                          {c.salaryBracket || 'R$ 5.800,00'}
                        </span>
                      ) : (
                        <span className="text-slate-500 tracking-widest text-xs">
                          •••••••••
                        </span>
                      )}
                    </td>

                    {/* Admissão */}
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {c.admissionDate || '14/03/2024'}
                    </td>

                    {/* ASO (Saúde) */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isExpiring
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {isExpiring ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>A renovar</span>
                          </>
                        ) : (
                          <>
                            <BadgeCheck className="w-3 h-3 text-emerald-400" />
                            <span>Em dia</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Benefícios */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
                        {(c.benefits || ['VR R$ 45/d', 'VT', 'Saúde']).slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 truncate"
                          >
                            {b}
                          </span>
                        ))}
                        {(c.benefits?.length || 3) > 2 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            +{(c.benefits?.length || 3) - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCollaborator(c);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Ver dossiê funcional completo do colaborador"
                      >
                        <span>Prontuário</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
