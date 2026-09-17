import * as XLSX from 'xlsx';
import { ActivityRecord, FormTemplate, Collaborator } from '../types';

/**
 * Generates and triggers actual browser download of an Excel (.xlsx) file
 * containing the Smart Spreadsheet (Base de Atividades) database.
 */
export function exportActivitiesToExcel(
  activities: ActivityRecord[],
  filename = 'Base_de_Atividades_ByComp.xlsx'
) {
  // Format data cleanly for spreadsheet rows
  const formattedRows = activities.map((item, index) => ({
    'ID': item.id,
    'Índice': index + 1,
    'Data': item.date,
    'Hora': item.time,
    'Colaborador': item.collaborator,
    'Setor': item.sector,
    'Título da Atividade': item.activity,
    'Prioridade': item.priority,
    'Status': item.status,
    'Tempo Gasto': item.timeSpent,
    'Observações Técnicas': item.observation || '',
    'Anexo': item.attachment || 'Sem anexo'
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Auto-fit column widths
  const columnWidths = [
    { wch: 12 }, // ID
    { wch: 8 },  // Index
    { wch: 14 }, // Data
    { wch: 10 }, // Hora
    { wch: 22 }, // Colaborador
    { wch: 18 }, // Setor
    { wch: 45 }, // Título da Atividade
    { wch: 14 }, // Prioridade
    { wch: 16 }, // Status
    { wch: 14 }, // Tempo Gasto
    { wch: 50 }, // Observações Técnicas
    { wch: 25 }  // Anexo
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Base de Atividades');

  // Trigger real file download
  XLSX.writeFile(workbook, filename);
}

export interface FormSubmissionRecord {
  id: string;
  formId: string;
  formTitle: string;
  submittedAt: string;
  submittedBy: string;
  status: 'Aprovado' | 'Pendente' | 'Processado' | 'Em Análise';
  values: Record<string, string>;
}

/**
 * Generates and triggers download of Excel (.xlsx) file for a specific Form Database
 * including all custom fields defined in that form template!
 */
export function exportFormSubmissionsToExcel(
  template: FormTemplate,
  submissions: FormSubmissionRecord[],
  filename?: string
) {
  const actualFilename = filename || `Banco_de_Dados_${template.title.replace(/\s+/g, '_')}_ByComp.xlsx`;

  const rows = submissions.map((sub, idx) => {
    const row: Record<string, any> = {
      'Protocolo / ID': sub.id,
      'Seq': idx + 1,
      'Data de Envio': sub.submittedAt,
      'Submetido Por': sub.submittedBy,
      'Status': sub.status,
    };

    // Dynamically add all template fields in order
    template.fields.forEach(field => {
      row[field.label] = sub.values[field.id] || '-';
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set friendly column widths
  const colWidths = [
    { wch: 16 }, // Protocolo
    { wch: 6 },  // Seq
    { wch: 20 }, // Data de Envio
    { wch: 22 }, // Submetido Por
    { wch: 14 }, // Status
    ...template.fields.map(f => ({ wch: Math.max(f.label.length + 5, 20) }))
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, template.title.substring(0, 31));

  XLSX.writeFile(workbook, actualFilename);
}

/**
 * Generates and triggers actual browser download of the complete
 * Organograma / Corporate Structure (.xlsx) with 2 sheets: Setores and Colaboradores
 */
export function exportOrganogramaToExcel(
  collaborators: any[],
  sectors: any[],
  filename = 'Organograma_Estrutura_Corporativa_ByComp.xlsx'
) {
  // Sheet 1: Colaboradores da Estrutura
  const colabRows = collaborators.map((c, idx) => ({
    'Ordem': idx + 1,
    'ID': c.id,
    'Nome Completo': c.name,
    'Cargo': c.role,
    'Nível de Acesso (RBAC)': c.userRole || 'COLABORADOR',
    'Macro-Área': c.area || '-',
    'Setor': c.sector,
    'Status Atual': c.status,
    'E-mail Corporativo': c.email,
    'Telefone / Ramal': c.phone,
    'Data de Admissão': c.admissionDate,
    'Atividade Atual': c.currentTask
  }));
  const colabSheet = XLSX.utils.json_to_sheet(colabRows);
  colabSheet['!cols'] = [
    { wch: 8 },  // Ordem
    { wch: 12 }, // ID
    { wch: 26 }, // Nome
    { wch: 32 }, // Cargo
    { wch: 22 }, // Nível
    { wch: 18 }, // Área
    { wch: 16 }, // Setor
    { wch: 14 }, // Status
    { wch: 30 }, // Email
    { wch: 16 }, // Telefone
    { wch: 16 }, // Admissão
    { wch: 45 }  // Atividade
  ];

  // Sheet 2: Setores e Lideranças
  const sectorRows = sectors.map((s, idx) => ({
    'Seq': idx + 1,
    'ID Setor': s.id,
    'Nome do Setor': s.name,
    'Macro-Área': s.area,
    'Líder Responsável': s.leaderName || 'A definir',
    'Total de Colaboradores': s.collaboratorsCount,
    'Meta SLA': s.slaTarget || '98.0%',
    'Missão / Descrição': s.description || ''
  }));
  const sectorSheet = XLSX.utils.json_to_sheet(sectorRows);
  sectorSheet['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 20 },
    { wch: 18 },
    { wch: 24 },
    { wch: 22 },
    { wch: 12 },
    { wch: 50 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, colabSheet, 'Colaboradores (48)');
  XLSX.utils.book_append_sheet(workbook, sectorSheet, 'Setores e Lideranças (11)');

  XLSX.writeFile(workbook, filename);
}

/**
 * Generates and triggers actual browser download of the Confidential HR & Administration Dossier
 * for ByComp's Management, HR and Administrative executives (Fase 4 - Área Privada).
 */
export function exportPrivateHRDossierToExcel(
  collaborators: Collaborator[],
  filename = 'ByComp_Dossie_RH_Privado_Fase4.xlsx'
) {
  const dossierRows = collaborators.map((c, idx) => ({
    'Seq': idx + 1,
    'ID': c.id,
    'Nome Completo': c.name,
    'Cargo Corporativo': c.role,
    'Perfil de Acesso (RBAC)': c.userRole || 'COLABORADOR',
    'Macro-Área': c.area || 'TI',
    'Setor': c.sector,
    'Regime Contratual': c.contractType || 'CLT',
    'Jornada Semanal': c.workSchedule || '40h semanais',
    'Faixa Salarial Base': c.salaryBracket || 'R$ 4.500 - R$ 7.200',
    'Data de Admissão': c.admissionDate,
    'Status Atual': c.status,
    'Bloqueio de Acesso': c.isBlocked ? 'BLOQUEADO' : 'ATIVO',
    'Exame Médico (ASO)': c.asoStatus || 'Em dia',
    'Benefícios Ativos': Array.isArray(c.benefits) ? c.benefits.join(', ') : 'VR, VT, Plano de Saúde, Seguro de Vida',
    'E-mail Corporativo': c.email,
    'Telefone / WhatsApp': c.phone,
    'Atividade Atual': c.currentTask,
    'Classificação de Sigilo': 'CONFIDENCIAL (RH / GESTÃO / ADMINISTRAÇÃO)'
  }));

  const dossierSheet = XLSX.utils.json_to_sheet(dossierRows);
  dossierSheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 28 },
    { wch: 32 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 24 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 45 },
    { wch: 32 },
    { wch: 18 },
    { wch: 45 },
    { wch: 40 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, dossierSheet, 'Dossiê RH Confidencial');
  XLSX.writeFile(workbook, filename);
}

export const exportHierarchyToExcel = exportOrganogramaToExcel;

