import { FormSubmissionRecord } from '../utils/excelExport';

export const INITIAL_FORM_SUBMISSIONS: FormSubmissionRecord[] = [
  // Submissions for form-1: Registro de atividade
  {
    id: 'REG-2026-001',
    formId: 'form-1',
    formTitle: 'Registro de atividade',
    submittedAt: '16/09/2026 09:30',
    submittedBy: 'Victor Estevão (Suporte N2)',
    status: 'Aprovado',
    values: {
      f_colab: 'Victor Estevão (Suporte N2)',
      f_setor: 'Suporte N2',
      f_data: '2026-09-16',
      f_titulo: 'Investigação de latência gateway de pagamento',
      f_desc: 'Análise de traces de timeout na porta 8443 e sincronização de certificados SSL.',
      f_prioridade: 'Alta',
      f_tempo: '01h 45m',
      f_obs: 'Problema mitigado temporariamente com fallback.'
    }
  },
  {
    id: 'REG-2026-002',
    formId: 'form-1',
    formTitle: 'Registro de atividade',
    submittedAt: '16/09/2026 11:15',
    submittedBy: 'Mariana Castro (Suporte N1)',
    status: 'Aprovado',
    values: {
      f_colab: 'Mariana Castro (Suporte N1)',
      f_setor: 'Suporte N1',
      f_data: '2026-09-16',
      f_titulo: 'Atendimento e reset de credenciais VPN',
      f_desc: 'Atendimento de 12 chamados de reset de senha e liberação de token 2FA.',
      f_prioridade: 'Média',
      f_tempo: '02h 10m',
      f_obs: 'Rotina de suporte matutina concluída dentro do SLA.'
    }
  },
  {
    id: 'REG-2026-003',
    formId: 'form-1',
    formTitle: 'Registro de atividade',
    submittedAt: '16/09/2026 14:00',
    submittedBy: 'Rodrigo Fontes (Back-End)',
    status: 'Processado',
    values: {
      f_colab: 'Rodrigo Fontes (Back-End)',
      f_setor: 'Back-End',
      f_data: '2026-09-16',
      f_titulo: 'Construção de rota POST /api/export-excel',
      f_desc: 'Mapeamento de schemas DTO e exportação nativa em streaming binário xlsx.',
      f_prioridade: 'Alta',
      f_tempo: '03h 00m',
      f_obs: 'Testes de integração validados.'
    }
  },

  // Submissions for form-2: Cadastro de cliente
  {
    id: 'CLI-2026-101',
    formId: 'form-2',
    formTitle: 'Cadastro de cliente',
    submittedAt: '15/09/2026 14:20',
    submittedBy: 'Helena Santos (Comercial)',
    status: 'Aprovado',
    values: {
      f_razao: 'FinOps Brasil Tecnologia S.A.',
      f_cnpj: '34.872.190/0001-44',
      f_contato: 'Roberto Valente',
      f_email: 'roberto@finopsbrasil.com.br',
      f_telefone: '(11) 98765-4321',
      f_plano: 'Full TI Dedicado (N1+N2+N3+DevOps)',
      f_obs: 'Cliente com infraestrutura híbrida AWS + On-premise.'
    }
  },
  {
    id: 'CLI-2026-102',
    formId: 'form-2',
    formTitle: 'Cadastro de cliente',
    submittedAt: '16/09/2026 10:45',
    submittedBy: 'Helena Santos (Comercial)',
    status: 'Em Análise',
    values: {
      f_razao: 'LogiVias Logística Integrada Ltda.',
      f_cnpj: '18.324.912/0001-88',
      f_contato: 'Cláudia Mendonça',
      f_email: 'ti@logivias.com.br',
      f_telefone: '(19) 99876-1234',
      f_plano: 'Plano N1+N2 Corporativo',
      f_obs: 'Migração de ERP prevista para o final do mês.'
    }
  },

  // Submissions for form-3: Solicitação interna
  {
    id: 'SOL-2026-201',
    formId: 'form-3',
    formTitle: 'Solicitação interna',
    submittedAt: '16/09/2026 08:30',
    submittedBy: 'Beatriz Lima (Front-End)',
    status: 'Pendente',
    values: {
      f_requisitante: 'Beatriz Lima',
      f_tipo_solic: 'Compra de Hardware',
      f_justificativa: 'Necessidade de monitor secundário 4K para inspeção de UI/UX e contraste WCAG.',
      f_urgencia: 'Médio (até 48h)',
      f_aprovador: 'Helena Santos (RH & Admin)'
    }
  },
  {
    id: 'SOL-2026-202',
    formId: 'form-3',
    formTitle: 'Solicitação interna',
    submittedAt: '15/09/2026 16:50',
    submittedBy: 'Lucas Martins (Cyber Security)',
    status: 'Aprovado',
    values: {
      f_requisitante: 'Lucas Martins',
      f_tipo_solic: 'Licença de Software',
      f_justificativa: 'Renovação do scanner de vulnerabilidades SAST/DAST Burp Suite Enterprise.',
      f_urgencia: 'Alto (hoje)',
      f_aprovador: 'Victor Estevão (Gestão N2)'
    }
  },

  // Submissions for form-4: Controle de equipamento
  {
    id: 'EQ-2026-301',
    formId: 'form-4',
    formTitle: 'Controle de equipamento',
    submittedAt: '14/09/2026 11:00',
    submittedBy: 'Administração Patrimonial',
    status: 'Processado',
    values: {
      f_patrimonio: 'BYCOMP-NOTE-048',
      f_tipo_eq: 'MacBook Pro M3',
      f_serial: 'SN-C02DF9K3MD6R',
      f_responsavel: 'Beatriz Lima',
      f_estado: 'Novo lacrado',
      f_data_entrega: '2026-09-14'
    }
  },
  {
    id: 'EQ-2026-302',
    formId: 'form-4',
    formTitle: 'Controle de equipamento',
    submittedAt: '12/09/2026 15:30',
    submittedBy: 'Administração Patrimonial',
    status: 'Processado',
    values: {
      f_patrimonio: 'BYCOMP-NOTE-032',
      f_tipo_eq: 'Notebook Dell Latitude',
      f_serial: 'SN-DELL7420-X89',
      f_responsavel: 'Mariana Castro',
      f_estado: 'Excelente',
      f_data_entrega: '2026-09-12'
    }
  },

  // Submissions for form-5: Registro administrativo
  {
    id: 'ADM-2026-401',
    formId: 'form-5',
    formTitle: 'Registro administrativo',
    submittedAt: '15/09/2026 17:00',
    submittedBy: 'Helena Santos',
    status: 'Aprovado',
    values: {
      f_titulo_doc: 'Faturamento Mensal Contratos TI - Lote 09/2026',
      f_tipo_doc: 'Nota Fiscal',
      f_valor: '148500.00',
      f_vencimento: '2026-09-25',
      f_observacoes: 'Lote consolidado de 18 clientes sob contrato ativo.'
    }
  }
];
