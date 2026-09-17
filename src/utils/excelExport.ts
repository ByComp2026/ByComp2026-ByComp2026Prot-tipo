import * as XLSX from 'xlsx';
import { ActivityRecord, FormTemplate } from '../types';

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
