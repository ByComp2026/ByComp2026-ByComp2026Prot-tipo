import {
  Collaborator,
  Task,
  ActivityRecord,
  AttendanceRecord,
  CalendarEvent,
  AuditLog,
  FormTemplate,
  WhatsAppContact,
  Sector,
  UserRole,
  UserRolePermissions,
  OrganizationalSector
} from '../types';

export const ORGANIZATIONAL_AREAS = [
  'SUPORTE',
  'DESENVOLVIMENTO',
  'SEGURANÇA',
  'DADOS',
  'ADMINISTRATIVO'
];

export const INITIAL_ORGANIZATIONAL_SECTORS: OrganizationalSector[] = [
  // SUPORTE: N1, N2, N3
  { id: 'sec-1', name: 'N1', area: 'SUPORTE', leaderName: 'Mariana Castro', collaboratorsCount: 6, slaTarget: '99.0%', description: 'Triagem de chamados, primeiro contato e atendimento ao usuário' },
  { id: 'sec-2', name: 'N2', area: 'SUPORTE', leaderName: 'Juliana Pires', collaboratorsCount: 6, slaTarget: '97.5%', description: 'Resolução técnica avançada de redes, sistemas e SO' },
  { id: 'sec-3', name: 'N3', area: 'SUPORTE', leaderName: 'Carlos Eduardo', collaboratorsCount: 5, slaTarget: '98.5%', description: 'Infraestrutura crítica, switches core, telecom e escalonamentos' },
  
  // DESENVOLVIMENTO: Front-End, Back-End
  { id: 'sec-4', name: 'Front-End', area: 'DESENVOLVIMENTO', leaderName: 'Beatriz Lima', collaboratorsCount: 6, slaTarget: '99.5%', description: 'Aplicações web, interfaces do usuário, mobile e acessibilidade' },
  { id: 'sec-5', name: 'Back-End', area: 'DESENVOLVIMENTO', leaderName: 'Rodrigo Fontes', collaboratorsCount: 7, slaTarget: '99.0%', description: 'Microsserviços, APIs REST/gRPC, integrações bancárias e mensageria' },
  
  // SEGURANÇA: Cyber Security
  { id: 'sec-6', name: 'Cyber Security', area: 'SEGURANÇA', leaderName: 'Lucas Martins', collaboratorsCount: 5, slaTarget: '99.9%', description: 'SOC, pentest, conformidade LGPD, resposta a incidentes e firewall' },
  
  // DADOS: DBA
  { id: 'sec-7', name: 'DBA', area: 'DADOS', leaderName: 'Camila Rocha', collaboratorsCount: 5, slaTarget: '99.8%', description: 'Bancos de dados relacionais e NoSQL, replicação, backups e otimização' },
  
  // ADMINISTRATIVO: RH, Financeiro, Gestão, Administrativo
  { id: 'sec-8', name: 'RH', area: 'ADMINISTRATIVO', leaderName: 'Helena Santos', collaboratorsCount: 3, slaTarget: '99.0%', description: 'Recrutamento, departamento pessoal, benefícios e clima organizacional' },
  { id: 'sec-9', name: 'Financeiro', area: 'ADMINISTRATIVO', leaderName: 'Priscila Dias', collaboratorsCount: 2, slaTarget: '99.5%', description: 'Contas a pagar/receber, conciliação e faturamento corporativo' },
  { id: 'sec-10', name: 'Gestão', area: 'ADMINISTRATIVO', leaderName: 'Victor Estevão', collaboratorsCount: 2, slaTarget: '100%', description: 'Diretoria executiva, governança corporativa e planejamento estratégico' },
  { id: 'sec-11', name: 'Administrativo', area: 'ADMINISTRATIVO', leaderName: 'Fernanda Souza', collaboratorsCount: 3, slaTarget: '98.0%', description: 'Facilities, compras de insumos, patrimônio e contratos' }
];

export const ROLE_DEFINITIONS: UserRolePermissions[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'SUPER ADMINISTRADOR',
    description: 'Acesso completo ao sistema.',
    allowedActions: [
      'Visualizar todos os setores',
      'Criar usuários',
      'Editar usuários',
      'Bloquear usuários',
      'Criar setores',
      'Definir permissões',
      'Visualizar todos os Kanbans',
      'Visualizar todos os registros de ponto',
      'Acessar relatórios',
      'Acessar auditoria',
      'Configurar integrações',
      'Configurar IA',
      'Configurar WhatsApp',
      'Configurar redes sociais',
      'Acessar configurações gerais'
    ]
  },
  {
    role: 'ADMINISTRATIVO',
    label: 'ADMINISTRATIVO',
    description: 'Responsável operacional e de suporte à gestão corporativa.',
    allowedActions: [
      'Cadastro de colaboradores',
      'Documentos corporativos',
      'Formulários padronizados',
      'Planilhas e relatórios operacionais',
      'Agenda e reuniões corporativas',
      'Controle de ponto eletrônico',
      'Relatórios administrativos',
      'Acompanhamento das equipes'
    ]
  },
  {
    role: 'GESTOR',
    label: 'GESTOR',
    description: 'Liderança setorial. Acompanha sua equipe técnica sem acesso automático aos dados de outros setores.',
    allowedActions: [
      'Acompanhar sua equipe',
      'Tarefas da equipe',
      'Kanban do setor',
      'Produtividade setorial',
      'Agenda da equipe',
      'Registros de atividades do setor',
      'Indicadores de SLA do setor'
    ]
  },
  {
    role: 'COLABORADOR',
    label: 'COLABORADOR',
    description: 'Operação individual focada em suas demandas atribuídas.',
    allowedActions: [
      'Suas informações cadastrais',
      'Seu Kanban individual',
      'Suas tarefas atribuídas',
      'Suas atividades e apontamentos',
      'Seu registro de ponto eletrônico',
      'Sua agenda pessoal',
      'Informações compartilhadas pela equipe'
    ]
  }
];

export const SECTORS: Sector[] = [
  'Administrativo',
  'RH',
  'Financeiro',
  'Gestão',
  'N1',
  'N2',
  'N3',
  'Front-End',
  'Back-End',
  'DBA',
  'Cyber Security'
];

export const CURRENT_USER: Collaborator = {
  id: 'colab-1',
  name: 'Victor Estevão',
  role: 'Diretor de Operações & TI (Super Admin)',
  userRole: 'SUPER_ADMIN',
  area: 'ADMINISTRATIVO',
  sector: 'Gestão',
  email: 'victor.estevao@bycomp.com.br',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'Em atividade',
  currentTask: 'Supervisão executiva e governança completa da plataforma',
  phone: '(11) 98765-4321',
  admissionDate: '10/02/2024'
};

export const MOCK_COLLABORATORS: Collaborator[] = [
  CURRENT_USER,
  {
    id: 'colab-2',
    name: 'Carlos Silva',
    role: 'Analista de Suporte N1',
    userRole: 'COLABORADOR',
    area: 'SUPORTE',
    sector: 'N1',
    email: 'carlos.silva@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Triagem de chamados N1 e primeiro atendimento ao cliente',
    phone: '(11) 98111-2233',
    admissionDate: '15/05/2023'
  },
  {
    id: 'colab-3',
    name: 'Carlos Eduardo',
    role: 'Especialista em Redes e Infra N3',
    userRole: 'GESTOR',
    area: 'SUPORTE',
    sector: 'N3',
    email: 'carlos.eduardo@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Failover de switch core datacenter secundário',
    phone: '(11) 98222-3344',
    admissionDate: '01/08/2022'
  },
  {
    id: 'colab-4',
    name: 'Mariana Santos',
    role: 'Engenheira Front-End Sênior',
    userRole: 'COLABORADOR',
    area: 'DESENVOLVIMENTO',
    sector: 'Front-End',
    email: 'mariana.santos@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Design System ByComp e acessibilidade web',
    phone: '(11) 98333-4455',
    admissionDate: '12/01/2023'
  },
  {
    id: 'colab-5',
    name: 'Rafael Oliveira',
    role: 'Senior Backend Engineer',
    userRole: 'COLABORADOR',
    area: 'DESENVOLVIMENTO',
    sector: 'Back-End',
    email: 'rafael.oliveira@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Implementação de microsserviços e mensageria de fila',
    phone: '(11) 98444-5566',
    admissionDate: '03/03/2022'
  },
  {
    id: 'colab-6',
    name: 'Lucas Almeida',
    role: 'Database Administrator (DBA)',
    userRole: 'COLABORADOR',
    area: 'DADOS',
    sector: 'DBA',
    email: 'lucas.almeida@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Otimização de índices e particionamento PostgreSQL',
    phone: '(11) 98555-6677',
    admissionDate: '20/09/2021'
  },
  {
    id: 'colab-7',
    name: 'Fernanda Costa',
    role: 'Especialista em Cyber Security',
    userRole: 'COLABORADOR',
    area: 'SEGURANÇA',
    sector: 'Cyber Security',
    email: 'fernanda.costa@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Auditoria de vulnerabilidades em containers e firewall',
    phone: '(11) 98666-7788',
    admissionDate: '05/11/2023'
  },
  {
    id: 'colab-8',
    name: 'Helena Santos',
    role: 'Gerente Geral Administrativa & RH',
    userRole: 'ADMINISTRATIVO',
    area: 'ADMINISTRATIVO',
    sector: 'RH',
    email: 'helena.santos@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Fechamento de folha e aprovações de faturamento',
    phone: '(11) 98777-8899',
    admissionDate: '01/02/2021'
  },
  {
    id: 'colab-9',
    name: 'Gabriel Ribeiro',
    role: 'Analista de Suporte N1',
    userRole: 'COLABORADOR',
    area: 'SUPORTE',
    sector: 'N1',
    email: 'gabriel.ribeiro@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'Intervalo',
    currentTask: 'Atendimento Helpdesk chat online',
    phone: '(11) 98888-9900',
    admissionDate: '10/06/2024'
  },
  {
    id: 'colab-10',
    name: 'Juliana Pires',
    role: 'Analista Suporte N2',
    userRole: 'GESTOR',
    area: 'SUPORTE',
    sector: 'N2',
    email: 'juliana.pires@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Configuração de VPN IPSec para cliente corporativo',
    phone: '(11) 98999-0011',
    admissionDate: '01/04/2023'
  },
  {
    id: 'colab-11',
    name: 'Felipe Santana',
    role: 'Engenheiro Frontend React',
    userRole: 'COLABORADOR',
    area: 'DESENVOLVIMENTO',
    sector: 'Front-End',
    email: 'felipe.santana@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Design System e componentes de acessibilidade',
    phone: '(11) 97111-2233',
    admissionDate: '15/07/2023'
  },
  {
    id: 'colab-12',
    name: 'Larissa Alencar',
    role: 'Engenheira Backend Node/Go',
    userRole: 'COLABORADOR',
    area: 'DESENVOLVIMENTO',
    sector: 'Back-End',
    email: 'larissa.alencar@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Webhook pipeline de integração bancária',
    phone: '(11) 97222-3344',
    admissionDate: '10/10/2022'
  },
  {
    id: 'colab-13',
    name: 'Thiago Nogueira',
    role: 'Especialista em SIEM & SOC',
    userRole: 'COLABORADOR',
    area: 'SEGURANÇA',
    sector: 'Cyber Security',
    email: 'thiago.nogueira@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Análise de telemetria de tráfego anômalo no firewall',
    phone: '(11) 97333-4455',
    admissionDate: '08/01/2024'
  },
  {
    id: 'colab-14',
    name: 'Daniela Viana',
    role: 'Analista de Gestão & RH',
    userRole: 'ADMINISTRATIVO',
    area: 'ADMINISTRATIVO',
    sector: 'Gestão',
    email: 'daniela.viana@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'Ausente',
    currentTask: 'Processo seletivo novos desenvolvedores N2',
    phone: '(11) 97444-5566',
    admissionDate: '14/09/2022'
  },
  {
    id: 'colab-15',
    name: 'Renato Silveira',
    role: 'Database Administrator MySQL/NoSQL',
    userRole: 'COLABORADOR',
    area: 'DADOS',
    sector: 'DBA',
    email: 'renato.silveira@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Replicação de dados em cluster MongoDB',
    phone: '(11) 97555-6677',
    admissionDate: '05/05/2023'
  },
  {
    id: 'colab-16',
    name: 'Aline Ferreira',
    role: 'Analista Suporte N3 DevOps',
    userRole: 'COLABORADOR',
    area: 'SUPORTE',
    sector: 'N3',
    email: 'aline.ferreira@bycomp.com.br',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    status: 'Em atividade',
    currentTask: 'Automação de deploy com Terraform e Ansible',
    phone: '(11) 97666-7788',
    admissionDate: '19/11/2022'
  }
];

// Generate additional mock collaborators up to 48
const generateAdditionalCollaborators = (): Collaborator[] => {
  const extra: Collaborator[] = [];
  const rolesBySector: Record<Sector, string[]> = {
    'Administrativo': ['Analista Financeiro', 'Assistente de Departamento Pessoal', 'Controler Interno', 'Assistente Administrativo'],
    'Suporte N1': ['Técnico de Suporte N1', 'Agente de Helpdesk', 'Atendente N1', 'Técnico de Campo'],
    'Suporte N2': ['Analista de Sistemas N2', 'Técnico de Redes N2', 'Analista Cloud N2', 'Especialista em SO'],
    'Suporte N3': ['Arquiteto de Infraestrutura', 'Especialista em Telecom', 'SysAdmin Linux', 'Engenheiro de Confiabilidade'],
    'Front-End': ['Desenvolvedor UI/UX', 'Desenvolvedor Vue.js', 'Engenheiro Mobile Flutter', 'Desenvolvedor Next.js'],
    'Back-End': ['Engenheiro de APIs Java', 'Desenvolvedor Python/FastAPI', 'Arquiteto de Microsserviços', 'Engenheiro C# .NET'],
    'DBA': ['Engenheiro de Dados ETL', 'Administrador Oracle', 'Especialista em Redis/Elastic', 'Analista de Modelagem'],
    'Cyber Security': ['Analista de Resposta a Incidentes', 'Engenheiro de Conformidade LGPD', 'Auditor de Segurança', 'Analista Threat Intelligence']
  };

  const names = [
    'Marcos Vinicius', 'Priscila Dias', 'Leonardo Prado', 'Fernanda Souza', 'Bruno Toledo',
    'Tatiane Carvalho', 'Eduardo Ramos', 'Vanessa Borges', 'Guilherme Macedo', 'Tatiana Freitas',
    'Igor Carvalho', 'Sabrina Gomes', 'Matheus Costa', 'Renata Moura', 'André Barbosa',
    'Jessica Moreira', 'Diego Azevedo', 'Luana Pacheco', 'Gustavo Paiva', 'Monique Farias',
    'Lucas Barreto', 'Evelyn Vasconcelos', 'Caio Mendonça', 'Debora Duarte', 'Vitor Hugo',
    'Patricia Nogueira', 'Otavio Silva', 'Isabela Guimarães', 'Rodrigo Antunes', 'Valeria Meireles',
    'Fabio Antunes', 'Carolina Esteves'
  ];

  const getAreaForSector = (s: string): string => {
    if (['N1', 'N2', 'N3', 'Suporte N1', 'Suporte N2', 'Suporte N3'].includes(s)) return 'SUPORTE';
    if (['Front-End', 'Back-End'].includes(s)) return 'DESENVOLVIMENTO';
    if (['Cyber Security', 'Segurança'].includes(s)) return 'SEGURANÇA';
    if (['DBA', 'Dados'].includes(s)) return 'DADOS';
    return 'ADMINISTRATIVO';
  };

  names.forEach((name, idx) => {
    const id = `colab-${idx + 17}`;
    const sector = SECTORS[idx % SECTORS.length];
    const roleList = rolesBySector[sector] || ['Especialista Técnico'];
    const role = roleList[idx % roleList.length];
    const statusPool: ('Em atividade' | 'Intervalo' | 'Ausente' | 'Férias')[] = [
      'Em atividade', 'Em atividade', 'Em atividade', 'Em atividade', 'Intervalo', 'Em atividade'
    ];

    extra.push({
      id,
      name,
      role,
      userRole: 'COLABORADOR',
      area: getAreaForSector(sector),
      sector,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@bycomp.com.br`,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + (idx * 98765)}?w=150&auto=format&fit=crop&q=80`,
      status: idx === 10 ? 'Férias' : idx === 14 ? 'Ausente' : statusPool[idx % statusPool.length],
      currentTask: `Processo operacional do setor ${sector} (#00${idx + 20})`,
      phone: `(11) 97000-${(1000 + idx).toString().slice(0, 4)}`,
      admissionDate: '2024-03-15'
    });
  });

  return extra;
};

export const ALL_COLLABORATORS: Collaborator[] = [
  ...MOCK_COLLABORATORS,
  ...generateAdditionalCollaborators()
];

export const RECENT_ACTIVITIES: { time: string; text: string; sector: Sector; icon: string }[] = [
  { time: '08:02', text: 'Victor registrou entrada', sector: 'Suporte N2', icon: 'clock' },
  { time: '08:15', text: 'Suporte N2 iniciou tarefa', sector: 'Suporte N2', icon: 'play' },
  { time: '08:30', text: 'Front-End concluiu atividade', sector: 'Front-End', icon: 'check-circle' },
  { time: '09:00', text: 'Nova tarefa atribuída ao Back-End', sector: 'Back-End', icon: 'arrow-right' },
  { time: '09:15', text: 'DBA atualizou atividade', sector: 'DBA', icon: 'refresh-cw' },
  { time: '09:30', text: 'Reunião iniciada', sector: 'Administrativo', icon: 'users' },
  { time: '09:42', text: 'Cyber Security finalizou varredura de portas', sector: 'Cyber Security', icon: 'shield-check' },
  { time: '09:55', text: 'Suporte N1 escalou chamado crítico #2049 para N3', sector: 'Suporte N1', icon: 'alert-triangle' }
];

export const MOCK_ALERTS = [
  { id: '1', type: 'warning', text: '⚠ 3 tarefas próximas do vencimento', time: 'Há 12 minutos' },
  { id: '2', type: 'warning', text: '⚠ 2 chamados aguardando atendimento', time: 'Há 25 minutos' },
  { id: '3', type: 'success', text: '✓ 12 tarefas concluídas hoje', time: 'Atualizado agora' }
];

export const SECTOR_PRODUCTIVITY = [
  { sector: 'Suporte N1', score: 94, tasksDone: 28, inProgress: 6, SLA: '98.4%' },
  { sector: 'Suporte N2', score: 91, tasksDone: 22, inProgress: 8, SLA: '96.8%' },
  { sector: 'Suporte N3', score: 88, tasksDone: 14, inProgress: 4, SLA: '95.2%' },
  { sector: 'Front-End', score: 96, tasksDone: 19, inProgress: 5, SLA: '99.1%' },
  { sector: 'Back-End', score: 93, tasksDone: 25, inProgress: 9, SLA: '97.5%' },
  { sector: 'DBA', score: 89, tasksDone: 12, inProgress: 3, SLA: '99.8%' },
  { sector: 'Cyber Security', score: 97, tasksDone: 16, inProgress: 2, SLA: '100%' }
];

export const TASK_STATUS_BREAKDOWN = [
  { name: 'A fazer', count: 34, color: '#94a3b8' },
  { name: 'Em andamento', count: 42, color: '#38bdf8' },
  { name: 'Em revisão', count: 20, color: '#fbbf24' },
  { name: 'Concluídas', count: 58, color: '#34d399' },
  { name: 'Atrasadas', count: 8, color: '#f87171' }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Atualizar documentação do ambiente',
    description: 'Revisar manuais de topologia de rede e runbooks do Suporte N2.',
    sector: 'Suporte N2',
    assigneeName: 'Victor Estevão',
    priority: 'Média',
    status: 'A_FAZER',
    deadline: '18/09/2026',
    tag: 'Documentação',
    commentsCount: 3,
    subtasks: [
      { id: 's1', title: 'Diagrama de rede atualizado', done: true },
      { id: 's2', title: 'Procedimento de restore de backup', done: false },
      { id: 's3', title: 'Validação com coordenação', done: false }
    ]
  },
  {
    id: 't-2',
    title: 'Resolver chamado #2048',
    description: 'Diagnóstico de latência excessiva no gateway de autenticação dos clientes corporativos.',
    sector: 'Suporte N2',
    assigneeName: 'Victor Estevão',
    priority: 'Urgente',
    status: 'EM_ANDAMENTO',
    deadline: '16/09/2026',
    tag: 'Suporte N2',
    commentsCount: 7,
    subtasks: [
      { id: 's1', title: 'Coleta de logs NGINX', done: true },
      { id: 's2', title: 'Análise de traces no Grafana', done: true },
      { id: 's3', title: 'Aplicação de patch no proxy reverso', done: false }
    ]
  },
  {
    id: 't-3',
    title: 'Revisar configuração do servidor',
    description: 'Auditar parâmetros do kernel Linux nos servidores de aplicação de alta disponibilidade.',
    sector: 'Suporte N3',
    assigneeName: 'Victor Estevão',
    priority: 'Alta',
    status: 'EM_REVISAO',
    deadline: '17/09/2026',
    tag: 'Infraestrutura',
    commentsCount: 4,
    subtasks: [
      { id: 's1', title: 'Sysctl hardening', done: true },
      { id: 's2', title: 'Benchmark de throughput', done: true }
    ]
  },
  {
    id: 't-4',
    title: 'Finalizar relatório semanal',
    description: 'Consolidar indicadores operacionais e volume de chamados da semana para diretoria.',
    sector: 'Administrativo',
    assigneeName: 'Victor Estevão',
    priority: 'Média',
    status: 'CONCLUIDO',
    deadline: '15/09/2026',
    tag: 'Gestão',
    commentsCount: 2,
    subtasks: [
      { id: 's1', title: 'Gráficos de SLA gerados', done: true },
      { id: 's2', title: 'Envio para gerência executiva', done: true }
    ]
  },
  {
    id: 't-5',
    title: 'Definição de arquitetura de microsserviços',
    description: 'Mapeamento de domínios e contratos gRPC para módulo de faturamento.',
    sector: 'Back-End',
    assigneeName: 'Rodrigo Fontes',
    priority: 'Alta',
    status: 'BACKLOG',
    deadline: '22/09/2026',
    tag: 'Arquitetura',
    commentsCount: 5,
    subtasks: [
      { id: 's1', title: 'Spec OpenAPI / Proto', done: false },
      { id: 's2', title: 'Reunião com DBA', done: false }
    ]
  },
  {
    id: 't-6',
    title: 'Auditoria de chaves SSL e certificados TLS',
    description: 'Substituição preventiva de certificados de borda com expiração em 30 dias.',
    sector: 'Cyber Security',
    assigneeName: 'Lucas Martins',
    priority: 'Média',
    status: 'EM_ANDAMENTO',
    deadline: '19/09/2026',
    tag: 'Segurança',
    commentsCount: 1,
    subtasks: [
      { id: 's1', title: 'Emissão Let’s Encrypt Wildcard', done: true },
      { id: 's2', title: 'Deploy no cluster ingress', done: false }
    ]
  },
  {
    id: 't-7',
    title: 'Otimização de consultas lentas no Postgres',
    description: 'Análise de EXPLAIN ANALYZE no schema de faturamento e criação de índices parciais.',
    sector: 'DBA',
    assigneeName: 'Camila Rocha',
    priority: 'Alta',
    status: 'EM_ANDAMENTO',
    deadline: '17/09/2026',
    tag: 'Performance',
    commentsCount: 6,
    subtasks: [
      { id: 's1', title: 'Identificação de full-table scans', done: true },
      { id: 's2', title: 'Aplicação de índice B-Tree composto', done: false }
    ]
  },
  {
    id: 't-8',
    title: 'Refatoração da tela de login e multi-fator',
    description: 'Implementar fluxo de TOTP com autenticador móvel e layout responsivo.',
    sector: 'Front-End',
    assigneeName: 'Beatriz Lima',
    priority: 'Média',
    status: 'CONCLUIDO',
    deadline: '14/09/2026',
    tag: 'Frontend',
    commentsCount: 3,
    subtasks: [
      { id: 's1', title: 'Telas Figma aprovadas', done: true },
      { id: 's2', title: 'Testes de acessibilidade WCAG', done: true }
    ]
  },
  {
    id: 't-9',
    title: 'Monitoramento de fila de chamados N1',
    description: 'Atendimento contínuo ao backlog de chamados de usuários finais.',
    sector: 'Suporte N1',
    assigneeName: 'Mariana Castro',
    priority: 'Urgente',
    status: 'EM_ANDAMENTO',
    deadline: '16/09/2026',
    tag: 'Operação',
    commentsCount: 9,
    subtasks: [
      { id: 's1', title: 'Zerar fila prioritária', done: false },
      { id: 's2', title: 'Envio de comunicados de status', done: true }
    ]
  }
];

export const SMART_SPREADSHEET_DATA: ActivityRecord[] = [
  {
    id: 'act-1',
    date: '16/09/2026',
    time: '08:15',
    collaborator: 'Victor Estevão',
    sector: 'Suporte N2',
    activity: 'Investigação de latência gateway de pagamento',
    priority: 'Alta',
    status: 'Em andamento',
    timeSpent: '1h 45m',
    observation: 'Traces apontam timeout intermitente na porta 8443.',
    attachment: 'trace-logs-1609.log'
  },
  {
    id: 'act-2',
    date: '16/09/2026',
    time: '08:30',
    collaborator: 'Beatriz Lima',
    sector: 'Front-End',
    activity: 'Componentização do card de KPI executivo',
    priority: 'Média',
    status: 'Concluído',
    timeSpent: '2h 10m',
    observation: 'Componente integrado ao Design System corporativo.',
    attachment: 'kpi-card.component.tsx'
  },
  {
    id: 'act-3',
    date: '16/09/2026',
    time: '08:50',
    collaborator: 'Camila Rocha',
    sector: 'DBA',
    activity: 'Reindexação de tabelas de log operacional',
    priority: 'Alta',
    status: 'Concluído',
    timeSpent: '0h 50m',
    observation: 'Espaço em disco recuperado: 42 GB.',
    attachment: 'reindex-report.pdf'
  },
  {
    id: 'act-4',
    date: '16/09/2026',
    time: '09:00',
    collaborator: 'Rodrigo Fontes',
    sector: 'Back-End',
    activity: 'Criação de endpoint REST para integração CRM',
    priority: 'Alta',
    status: 'Em andamento',
    timeSpent: '1h 20m',
    observation: 'Middleware de autenticação Bearer validado.',
    attachment: 'swagger-crm-v1.json'
  },
  {
    id: 'act-5',
    date: '16/09/2026',
    time: '09:15',
    collaborator: 'Mariana Castro',
    sector: 'Suporte N1',
    activity: 'Reset de credenciais em lote para setor financeiro',
    priority: 'Média',
    status: 'Concluído',
    timeSpent: '0h 30m',
    observation: '12 colaboradores atendidos e validados via 2FA.',
    attachment: 'chamados-fechados.csv'
  },
  {
    id: 'act-6',
    date: '16/09/2026',
    time: '09:20',
    collaborator: 'Lucas Martins',
    sector: 'Cyber Security',
    activity: 'Varredura periódica de portas externas e IPs públicos',
    priority: 'Urgente',
    status: 'Concluído',
    timeSpent: '1h 10m',
    observation: 'Nenhuma porta não autorizada aberta detectada.',
    attachment: 'nmap-scan-prod.txt'
  },
  {
    id: 'act-7',
    date: '15/09/2026',
    time: '17:30',
    collaborator: 'Carlos Eduardo',
    sector: 'Suporte N3',
    activity: 'Configuração de redundância BGP em link dedicado',
    priority: 'Alta',
    status: 'Concluído',
    timeSpent: '3h 15m',
    observation: 'Teste de descontinuidade realizado sem perda de pacotes.',
    attachment: 'bgp-failover-log.pdf'
  },
  {
    id: 'act-8',
    date: '15/09/2026',
    time: '16:00',
    collaborator: 'Helena Santos',
    sector: 'Administrativo',
    activity: 'Homologação de propostas de fornecedores de TI',
    priority: 'Média',
    status: 'Concluído',
    timeSpent: '2h 00m',
    observation: 'Contrato de licenças Microsoft 365 renovado com desconto.',
    attachment: 'contrato-msft-2026.pdf'
  },
  {
    id: 'act-9',
    date: '15/09/2026',
    time: '14:20',
    collaborator: 'Felipe Santana',
    sector: 'Front-End',
    activity: 'Correção de bug de scroll horizontal no Safari',
    priority: 'Baixa',
    status: 'Concluído',
    timeSpent: '1h 05m',
    observation: 'Adicionado overflow-x: hidden na div pai do container.',
    attachment: 'diff-patch.txt'
  },
  {
    id: 'act-10',
    date: '15/09/2026',
    time: '11:10',
    collaborator: 'Juliana Pires',
    sector: 'Suporte N2',
    activity: 'Instalação e configuração de agente EDR nos notebooks',
    priority: 'Média',
    status: 'Em andamento',
    timeSpent: '2h 40m',
    observation: '35 de 48 computadores sincronizados com o painel central.',
    attachment: 'edr-status-deploy.csv'
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Reunião Suporte',
    time: '09:00 - 09:45',
    duration: '45m',
    date: '16/09/2026',
    sector: 'Suporte N1',
    type: 'Reunião',
    attendees: ['Mariana Castro', 'Victor Estevão', 'Gabriel Ribeiro'],
    location: 'Sala de Guerra Virtual (Meet N1)'
  },
  {
    id: 'ev-2',
    title: 'Reunião Desenvolvimento',
    time: '10:30 - 11:30',
    duration: '1h',
    date: '16/09/2026',
    sector: 'Front-End',
    type: 'Alinhamento',
    attendees: ['Beatriz Lima', 'Rodrigo Fontes', 'Felipe Santana', 'Larissa Alencar'],
    location: 'Sprint Planning Room 02'
  },
  {
    id: 'ev-3',
    title: 'Alinhamento N2/N3',
    time: '14:00 - 15:00',
    duration: '1h',
    date: '16/09/2026',
    sector: 'Suporte N2',
    type: 'Alinhamento',
    attendees: ['Victor Estevão', 'Carlos Eduardo', 'Juliana Pires', 'Aline Ferreira'],
    location: 'Sala Técnica de Infraestrutura'
  },
  {
    id: 'ev-4',
    title: 'Reunião Administrativa',
    time: '16:00 - 17:00',
    duration: '1h',
    date: '16/09/2026',
    sector: 'Administrativo',
    type: 'Reunião',
    attendees: ['Helena Santos', 'Daniela Viana', 'Victor Estevão'],
    location: 'Conselho Diretoria ByComp'
  },
  {
    id: 'ev-5',
    title: 'Plantão de Segurança & Patching',
    time: '19:00 - 21:00',
    duration: '2h',
    date: '17/09/2026',
    sector: 'Cyber Security',
    type: 'Plantão',
    attendees: ['Lucas Martins', 'Thiago Nogueira'],
    location: 'SOC Sala Segura'
  },
  {
    id: 'ev-6',
    title: 'Entrega de Release v2.4',
    time: '15:30 - 16:30',
    duration: '1h',
    date: '18/09/2026',
    sector: 'Back-End',
    type: 'Entrega',
    attendees: ['Rodrigo Fontes', 'Beatriz Lima', 'Camila Rocha'],
    location: 'Canal de Deploy Produção'
  }
];

export const FORMS_DATA: FormTemplate[] = [
  {
    id: 'form-1',
    title: 'Registro de atividade',
    description: 'Apontamento diário de esforço, horas produtivas e descrição técnica do processo executado.',
    category: 'Operacional',
    fieldsCount: 8,
    lastUpdated: '14/09/2026',
    iconName: 'clipboard-list',
    fields: [
      { id: 'f_colab', label: 'Colaborador', type: 'select', options: ['Victor Estevão (Suporte N2)', 'Mariana Castro (Suporte N1)', 'Carlos Eduardo (Suporte N3)', 'Beatriz Lima (Front-End)', 'Rodrigo Fontes (Back-End)'], required: true },
      { id: 'f_setor', label: 'Setor Responsável', type: 'select', options: SECTORS, required: true },
      { id: 'f_data', label: 'Data da Atividade', type: 'date', required: true },
      { id: 'f_titulo', label: 'Título da Atividade', type: 'text', placeholder: 'Ex: Resolução de incidentes de rede', required: true },
      { id: 'f_desc', label: 'Descrição Detalhada', type: 'textarea', placeholder: 'Descreva detalhadamente o procedimento executado...', required: true },
      { id: 'f_prioridade', label: 'Prioridade', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Urgente'], required: true },
      { id: 'f_tempo', label: 'Tempo Gasto (Ex: 01h 30m)', type: 'text', placeholder: '01h 30m', required: true },
      { id: 'f_obs', label: 'Observação Interna', type: 'textarea', placeholder: 'Notas complementares...' }
    ]
  },
  {
    id: 'form-2',
    title: 'Cadastro de cliente',
    description: 'Entrada de novas empresas parceiras, CNPJ, dados de faturamento e contatos operacionais.',
    category: 'Comercial & CRM',
    fieldsCount: 7,
    lastUpdated: '12/09/2026',
    iconName: 'user-plus',
    fields: [
      { id: 'f_razao', label: 'Razão Social / Empresa', type: 'text', placeholder: 'Ex: FinOps Brasil S.A.', required: true },
      { id: 'f_cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00', required: true },
      { id: 'f_contato', label: 'Contato Principal', type: 'text', placeholder: 'Nome completo', required: true },
      { id: 'f_email', label: 'E-mail Corporativo', type: 'text', placeholder: 'contato@empresa.com.br', required: true },
      { id: 'f_telefone', label: 'Telefone / WhatsApp', type: 'text', placeholder: '(11) 99999-9999', required: true },
      { id: 'f_plano', label: 'Plano de Suporte Contratado', type: 'select', options: ['Plano N1 Básico', 'Plano N1+N2 Corporativo', 'Full TI Dedicado (N1+N2+N3+DevOps)'], required: true },
      { id: 'f_obs', label: 'Observações de Onboarding', type: 'textarea', placeholder: 'Informações sobre os sistemas legados...' }
    ]
  },
  {
    id: 'form-3',
    title: 'Solicitação interna',
    description: 'Requisição de novos equipamentos, softwares, acessos privilegiados ou autorizações financeiras.',
    category: 'Administrativo',
    fieldsCount: 6,
    lastUpdated: '10/09/2026',
    iconName: 'inbox',
    fields: [
      { id: 'f_requisitante', label: 'Requisitante', type: 'text', placeholder: 'Seu nome completo', required: true },
      { id: 'f_tipo_solic', label: 'Tipo de Solicitação', type: 'select', options: ['Acesso a Servidores / VPN', 'Compra de Hardware', 'Licença de Software', 'Reembolso de Despesas', 'Outro'], required: true },
      { id: 'f_justificativa', label: 'Justificativa da Solicitação', type: 'textarea', placeholder: 'Explique a necessidade operacional...', required: true },
      { id: 'f_urgencia', label: 'Grau de Urgência', type: 'select', options: ['Baixo (até 5 dias)', 'Médio (até 48h)', 'Alto (hoje)'], required: true },
      { id: 'f_aprovador', label: 'Aprovador Imediato', type: 'select', options: ['Helena Santos (RH & Admin)', 'Victor Estevão (Gestão N2)', 'Carlos Eduardo (N3)'], required: true }
    ]
  },
  {
    id: 'form-4',
    title: 'Controle de equipamento',
    description: 'Termo de cautela, inventário patrimonial, entrega e recolhimento de computadores e periféricos.',
    category: 'Patrimônio',
    fieldsCount: 7,
    lastUpdated: '08/09/2026',
    iconName: 'laptop',
    fields: [
      { id: 'f_patrimonio', label: 'Número de Patrimônio / Tag', type: 'text', placeholder: 'BYCOMP-NOTE-048', required: true },
      { id: 'f_tipo_eq', label: 'Tipo de Equipamento', type: 'select', options: ['Notebook Dell Latitude', 'MacBook Pro M3', 'Monitor Dell 27 4K', 'Switch Cisco', 'Firewall Fortinet'], required: true },
      { id: 'f_serial', label: 'Número de Série', type: 'text', placeholder: 'S/N: ABC12345XYZ', required: true },
      { id: 'f_responsavel', label: 'Colaborador Custodiante', type: 'select', options: ['Victor Estevão', 'Mariana Castro', 'Rodrigo Fontes', 'Beatriz Lima', 'Outro'], required: true },
      { id: 'f_estado', label: 'Estado de Conservação', type: 'select', options: ['Novo lacrado', 'Excelente', 'Bom', 'Com marcas de uso'], required: true },
      { id: 'f_data_entrega', label: 'Data de Entrega', type: 'date', required: true }
    ]
  },
  {
    id: 'form-5',
    title: 'Registro administrativo',
    description: 'Protocolo de contratos, emissão de certidões, lançamentos fiscais e correspondências oficiais.',
    category: 'Administrativo',
    fieldsCount: 6,
    lastUpdated: '05/09/2026',
    iconName: 'file-text',
    fields: [
      { id: 'f_titulo_doc', label: 'Título do Registro', type: 'text', placeholder: 'Ex: Emissão de NFSe Mensal Clientes', required: true },
      { id: 'f_tipo_doc', label: 'Classificação do Documento', type: 'select', options: ['Nota Fiscal', 'Comprovante Bancário', 'Contrato Social', 'Certidão Negativa de Débitos', 'Relatório Fiscal'], required: true },
      { id: 'f_valor', label: 'Valor Associado (R$)', type: 'number', placeholder: '0.00' },
      { id: 'f_vencimento', label: 'Data de Referência / Vencimento', type: 'date', required: true },
      { id: 'f_observacoes', label: 'Observações Fiscais', type: 'textarea', placeholder: 'Informações adicionais para auditoria...' }
    ]
  }
];

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    collaboratorId: 'colab-1',
    collaboratorName: 'Victor Estevão',
    sector: 'Suporte N2',
    date: '16/09/2026',
    entry: '08:02',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:02',
    totalHours: '08h 00m',
    status: 'Em expediente'
  },
  {
    id: 'att-2',
    collaboratorId: 'colab-2',
    collaboratorName: 'Mariana Castro',
    sector: 'Suporte N1',
    date: '16/09/2026',
    entry: '07:58',
    breakStart: '12:05',
    breakEnd: '13:05',
    exit: '17:00',
    totalHours: '08h 00m',
    status: 'Em expediente'
  },
  {
    id: 'att-3',
    collaboratorId: 'colab-3',
    collaboratorName: 'Carlos Eduardo',
    sector: 'Suporte N3',
    date: '16/09/2026',
    entry: '08:10',
    breakStart: '12:30',
    breakEnd: '13:30',
    exit: '17:15',
    totalHours: '08h 05m',
    status: 'Em expediente'
  },
  {
    id: 'att-4',
    collaboratorId: 'colab-4',
    collaboratorName: 'Beatriz Lima',
    sector: 'Front-End',
    date: '16/09/2026',
    entry: '08:30',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:30',
    totalHours: '08h 00m',
    status: 'Em expediente'
  },
  {
    id: 'att-5',
    collaboratorId: 'colab-5',
    collaboratorName: 'Rodrigo Fontes',
    sector: 'Back-End',
    date: '16/09/2026',
    entry: '08:05',
    breakStart: '12:15',
    breakEnd: '13:15',
    exit: '17:10',
    totalHours: '08h 05m',
    status: 'Em expediente'
  },
  {
    id: 'att-6',
    collaboratorId: 'colab-6',
    collaboratorName: 'Camila Rocha',
    sector: 'DBA',
    date: '16/09/2026',
    entry: '08:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:00',
    totalHours: '08h 00m',
    status: 'Em expediente'
  },
  {
    id: 'att-7',
    collaboratorId: 'colab-7',
    collaboratorName: 'Lucas Martins',
    sector: 'Cyber Security',
    date: '16/09/2026',
    entry: '08:01',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:05',
    totalHours: '08h 04m',
    status: 'Em expediente'
  },
  {
    id: 'att-8',
    collaboratorId: 'colab-8',
    collaboratorName: 'Helena Santos',
    sector: 'Administrativo',
    date: '16/09/2026',
    entry: '07:55',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:00',
    totalHours: '08h 05m',
    status: 'Em expediente'
  },
  {
    id: 'att-9',
    collaboratorId: 'colab-9',
    collaboratorName: 'Gabriel Ribeiro',
    sector: 'Suporte N1',
    date: '16/09/2026',
    entry: '08:00',
    breakStart: '11:45',
    breakEnd: '--:--',
    exit: '--:--',
    totalHours: '03h 45m',
    status: 'Intervalo'
  },
  {
    id: 'att-10',
    collaboratorId: 'colab-14',
    collaboratorName: 'Daniela Viana',
    sector: 'Administrativo',
    date: '16/09/2026',
    entry: '08:45',
    breakStart: '12:00',
    breakEnd: '13:00',
    exit: '17:45',
    totalHours: '08h 00m',
    status: 'Atraso'
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    date: '16/09/2026',
    time: '08:02',
    user: 'Victor',
    module: 'Ponto',
    action: 'Registro de entrada',
    description: 'Ponto eletrônico registrado via aplicação web (IP 192.168.10.45)',
    status: 'Sucesso'
  },
  {
    id: 'aud-2',
    date: '16/09/2026',
    time: '08:15',
    user: 'Mariana',
    module: 'Kanban',
    action: 'Tarefa criada',
    description: 'Nova tarefa criada no quadro da equipe: Triagem de chamados N1',
    status: 'Sucesso'
  },
  {
    id: 'aud-3',
    date: '16/09/2026',
    time: '09:10',
    user: 'Carlos',
    module: 'Atividade',
    action: 'Registro atualizado',
    description: 'Atualizado status da atividade #act-7 para Concluído',
    status: 'Sucesso'
  },
  {
    id: 'aud-4',
    date: '16/09/2026',
    time: '09:22',
    user: 'Lucas',
    module: 'Segurança',
    action: 'Varredura finalizada',
    description: 'Relatório de conformidade exportado para PDF criptografado',
    status: 'Sucesso'
  },
  {
    id: 'aud-5',
    date: '16/09/2026',
    time: '09:35',
    user: 'Victor',
    module: 'CRM',
    action: 'Nova tarefa de atendimento',
    description: 'Criada tarefa comercial: "Enviar proposta comercial" para Empresa XYZ',
    status: 'Sucesso'
  },
  {
    id: 'aud-6',
    date: '16/09/2026',
    time: '09:40',
    user: 'Camila',
    module: 'Atividade',
    action: 'Otimização DBA registrada',
    description: 'Submissão de plano de execução e índice no cluster PostgreSQL',
    status: 'Sucesso'
  }
];

export const WHATSAPP_CONTACTS: WhatsAppContact[] = [
  {
    id: 'wa-1',
    name: 'Empresa XYZ',
    company: 'XYZ Soluções Logísticas',
    avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Bom dia Victor! Conseguem nos enviar a proposta com SLA de 4 horas?',
    time: '09:28',
    unread: 2,
    status: 'Em atendimento',
    customerSince: '2026',
    manager: 'Victor',
    phone: '+55 11 98877-6655',
    email: 'contato@empresaxyz.com.br',
    tasks: [
      {
        id: 'c-task-1',
        title: 'Enviar proposta comercial',
        deadline: '18/09/2026',
        done: false,
        assignee: 'Victor'
      },
      {
        id: 'c-task-2',
        title: 'Agendar call de demonstração técnica',
        deadline: '19/09/2026',
        done: true,
        assignee: 'Victor'
      }
    ],
    messages: [
      {
        id: 'm-1',
        sender: 'contact',
        text: 'Olá Victor, bom dia! Estamos avaliando migrar nosso suporte para a ByComp.',
        time: '09:15',
        status: 'read'
      },
      {
        id: 'm-2',
        sender: 'user',
        text: 'Olá! Excelente, temos pacotes com cobertura completa de N1, N2 e N3 com suporte 24/7.',
        time: '09:18',
        status: 'read'
      },
      {
        id: 'm-3',
        sender: 'contact',
        text: 'Bom dia Victor! Conseguem nos enviar a proposta com SLA de 4 horas?',
        time: '09:28'
      }
    ]
  },
  {
    id: 'wa-2',
    name: 'João',
    company: 'TechCorp Brasil',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Obrigado pelo suporte rápido de hoje cedo no firewall!',
    time: '09:05',
    unread: 0,
    status: 'Concluído',
    customerSince: '2025',
    manager: 'Victor',
    phone: '+55 11 97766-5544',
    email: 'joao@techcorp.com.br',
    tasks: [
      {
        id: 'c-task-3',
        title: 'Envio de relatório de SLA de agosto',
        deadline: '20/09/2026',
        done: true,
        assignee: 'Mariana'
      }
    ],
    messages: [
      {
        id: 'm-4',
        sender: 'contact',
        text: 'Obrigado pelo suporte rápido de hoje cedo no firewall!',
        time: '09:05',
        status: 'read'
      },
      {
        id: 'm-5',
        sender: 'user',
        text: 'Sempre à disposição, João! Monitoramento ativo 24 horas por dia.',
        time: '09:08',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'wa-3',
    name: 'Maria',
    company: 'Alpha Softwares Integrados',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Poderiam liberar o acesso do novo desenvolvedor ao repositório?',
    time: '08:42',
    unread: 1,
    status: 'Suporte N2',
    customerSince: '2024',
    manager: 'Carlos Eduardo',
    phone: '+55 11 96655-4433',
    email: 'maria@alphasoft.io',
    tasks: [
      {
        id: 'c-task-4',
        title: 'Provisionar chave SSH e MFA',
        deadline: '16/09/2026',
        done: false,
        assignee: 'Victor'
      }
    ],
    messages: [
      {
        id: 'm-6',
        sender: 'contact',
        text: 'Poderiam liberar o acesso do novo desenvolvedor ao repositório?',
        time: '08:42',
        status: 'read'
      }
    ]
  },
  {
    id: 'wa-4',
    name: 'Cliente ABC',
    company: 'FinOps Soluções Financeiras',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Confirmamos o recebimento das notas fiscais do contrato mensal.',
    time: 'Ontem',
    unread: 0,
    status: 'Proposta enviada',
    customerSince: '2025',
    manager: 'Helena Santos',
    phone: '+55 11 95544-3322',
    email: 'financeiro@finops.com.br',
    tasks: [
      {
        id: 'c-task-5',
        title: 'Renovação anual de contrato de suporte',
        deadline: '30/09/2026',
        done: false,
        assignee: 'Helena'
      }
    ],
    messages: [
      {
        id: 'm-7',
        sender: 'contact',
        text: 'Confirmamos o recebimento das notas fiscais do contrato mensal.',
        time: 'Ontem 17:40',
        status: 'read'
      }
    ]
  }
];

export const WEEKLY_PLANNING_DAYS = [
  {
    day: 'SEG',
    date: '14/09',
    tasks: [
      { title: 'Revisão de infraestrutura AWS', sector: 'Suporte N3', time: '09:00', duration: '2h' },
      { title: 'Alinhamento semanal de metas', sector: 'Administrativo', time: '11:00', duration: '1h' },
      { title: 'Deploy release Front-End v2.3', sector: 'Front-End', time: '15:00', duration: '1.5h' }
    ]
  },
  {
    day: 'TER',
    date: '15/09',
    tasks: [
      { title: 'Backup full banco de dados', sector: 'DBA', time: '04:00', duration: '3h' },
      { title: 'Atendimento chamados prioritários', sector: 'Suporte N1', time: '08:30', duration: '4h' },
      { title: 'Pentest em rotas de autenticação', sector: 'Cyber Security', time: '14:00', duration: '3h' }
    ]
  },
  {
    day: 'QUA',
    date: '16/09',
    isToday: true,
    tasks: [
      { title: 'Resolver chamado #2048 (Latência)', sector: 'Suporte N2', time: '08:15', duration: '3h' },
      { title: 'Reunião de Suporte N1/N2', sector: 'Suporte N2', time: '09:00', duration: '45m' },
      { title: 'Alinhamento N2/N3 de Infra', sector: 'Suporte N3', time: '14:00', duration: '1h' },
      { title: 'Reunião Administrativa Diretoria', sector: 'Administrativo', time: '16:00', duration: '1h' }
    ]
  },
  {
    day: 'QUI',
    date: '17/09',
    tasks: [
      { title: 'Otimização de rotas API Rest', sector: 'Back-End', time: '10:00', duration: '2h' },
      { title: 'Plantão SOC e análise de logs', sector: 'Cyber Security', time: '19:00', duration: '2h' }
    ]
  },
  {
    day: 'SEX',
    date: '18/09',
    tasks: [
      { title: 'Entrega da proposta Empresa XYZ', sector: 'Suporte N2', time: '11:00', duration: '1h' },
      { title: 'Code review geral sprint 34', sector: 'Front-End', time: '14:30', duration: '2h' },
      { title: 'Fechamento semanal de métricas', sector: 'Administrativo', time: '17:00', duration: '1h' }
    ]
  }
];

export const SOCIAL_METRICS = {
  instagram: {
    handle: '@bycomptecnologia',
    followers: '14.280',
    followersGrowth: '+840 este mês',
    engagement: '4.8%',
    avgLikes: '1.240',
    avgComments: '184',
    reach: '48.600',
    postsScheduled: 4,
    drafts: 6
  },
  tiktok: {
    handle: '@bycomptecnologia.oficial',
    followers: '28.900',
    followersGrowth: '+3.150 este mês',
    views: '142.500',
    likes: '18.900',
    comments: '950',
    shares: '2.430',
    drafts: 3,
    calendarCount: 5
  }
};

export const TIME_CARD_RECORDS = [
  { date: '01/09/2026', entry: '08:00', breakStart: '12:00', breakEnd: '13:00', exit: '17:00', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '02/09/2026', entry: '07:55', breakStart: '12:00', breakEnd: '13:00', exit: '17:05', totalHours: '08:10', balance: '+00:10', status: 'Hora Extra' },
  { date: '03/09/2026', entry: '08:00', breakStart: '12:00', breakEnd: '13:00', exit: '17:00', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '04/09/2026', entry: '08:02', breakStart: '12:00', breakEnd: '13:00', exit: '17:02', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '05/09/2026', entry: '--:--', breakStart: '--:--', breakEnd: '--:--', exit: '--:--', totalHours: '00:00', balance: '00:00', status: 'Sábado' },
  { date: '06/09/2026', entry: '--:--', breakStart: '--:--', breakEnd: '--:--', exit: '--:--', totalHours: '00:00', balance: '00:00', status: 'Domingo' },
  { date: '07/09/2026', entry: '--:--', breakStart: '--:--', breakEnd: '--:--', exit: '--:--', totalHours: '00:00', balance: '00:00', status: 'Feriado Nacional' },
  { date: '08/09/2026', entry: '08:00', breakStart: '12:00', breakEnd: '13:00', exit: '17:30', totalHours: '08:30', balance: '+00:30', status: 'Hora Extra' },
  { date: '09/09/2026', entry: '08:05', breakStart: '12:05', breakEnd: '13:05', exit: '17:05', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '10/09/2026', entry: '07:58', breakStart: '12:00', breakEnd: '13:00', exit: '17:00', totalHours: '08:02', balance: '+00:02', status: 'Normal' },
  { date: '11/09/2026', entry: '08:00', breakStart: '12:00', breakEnd: '13:00', exit: '18:00', totalHours: '09:00', balance: '+01:00', status: 'Hora Extra' },
  { date: '12/09/2026', entry: '--:--', breakStart: '--:--', breakEnd: '--:--', exit: '--:--', totalHours: '00:00', balance: '00:00', status: 'Sábado' },
  { date: '13/09/2026', entry: '--:--', breakStart: '--:--', breakEnd: '--:--', exit: '--:--', totalHours: '00:00', balance: '00:00', status: 'Domingo' },
  { date: '14/09/2026', entry: '08:00', breakStart: '12:00', breakEnd: '13:00', exit: '17:00', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '15/09/2026', entry: '08:01', breakStart: '12:00', breakEnd: '13:00', exit: '17:01', totalHours: '08:00', balance: '00:00', status: 'Normal' },
  { date: '16/09/2026', entry: '08:02', breakStart: '12:00', breakEnd: '13:00', exit: '17:02', totalHours: '08:00', balance: '00:00', status: 'Hoje' }
];

export const PONTO_ADMIN_ROWS = [
  { id: 'p-1', name: 'Victor Estevão', sector: 'Suporte N2', entry: '08:02', breakTime: '12:00 - 13:00', exit: '17:02', status: 'Presente' },
  { id: 'p-2', name: 'Mariana Castro', sector: 'Suporte N1', entry: '07:58', breakTime: '12:05 - 13:05', exit: '17:00', status: 'Presente' },
  { id: 'p-3', name: 'Carlos Eduardo', sector: 'Suporte N3', entry: '08:10', breakTime: '12:30 - 13:30', exit: '17:15', status: 'Presente' },
  { id: 'p-4', name: 'Beatriz Lima', sector: 'Front-End', entry: '08:30', breakTime: '12:00 - 13:00', exit: '17:30', status: 'Presente' },
  { id: 'p-5', name: 'Rodrigo Fontes', sector: 'Back-End', entry: '08:05', breakTime: '12:15 - 13:15', exit: '17:10', status: 'Presente' },
  { id: 'p-6', name: 'Camila Rocha', sector: 'DBA', entry: '08:00', breakTime: '12:00 - 13:00', exit: '17:00', status: 'Presente' },
  { id: 'p-7', name: 'Lucas Martins', sector: 'Cyber Security', entry: '08:01', breakTime: '12:00 - 13:00', exit: '17:05', status: 'Presente' },
  { id: 'p-8', name: 'Helena Santos', sector: 'Administrativo', entry: '07:55', breakTime: '12:00 - 13:00', exit: '17:00', status: 'Presente' },
  { id: 'p-9', name: 'Gabriel Ribeiro', sector: 'Suporte N1', entry: '08:00', breakTime: '11:45 - 12:45', exit: '--:--', status: 'Intervalo' },
  { id: 'p-10', name: 'Daniela Viana', sector: 'Administrativo', entry: '08:45', breakTime: '12:00 - 13:00', exit: '17:45', status: 'Presente' },
  { id: 'p-11', name: 'Tatiane Carvalho', sector: 'Front-End', entry: '--:--', breakTime: '--:--', exit: '--:--', status: 'Ausente' },
  { id: 'p-12', name: 'Matheus Costa', sector: 'Back-End', entry: '--:--', breakTime: '--:--', exit: '--:--', status: 'Ausente' }
];

export const AI_TOOLS_DATA = [
  {
    id: 'ai-1',
    title: 'Geração de Relatórios Executivos',
    description: 'Sintetiza métricas de SLA, tarefas e horas trabalhadas em resumos para a diretoria.',
    badge: 'Produtividade'
  },
  {
    id: 'ai-2',
    title: 'Criação de Procedimentos (POPs)',
    description: 'Transforma resoluções de chamados complexos em manuais e procedimentos técnicos padronizados.',
    badge: 'Processos'
  },
  {
    id: 'ai-3',
    title: 'Roteiros para Redes Sociais',
    description: 'Gera scripts para Reels, TikTok e LinkedIn com ganchos atrativos para marketing de TI.',
    badge: 'Conteúdo'
  },
  {
    id: 'ai-4',
    title: 'Automação de Respostas para Chamados',
    description: 'Sugere soluções de primeiro nível e respostas educadas baseadas na base de conhecimento.',
    badge: 'Help Desk'
  },
  {
    id: 'ai-5',
    title: 'Análise de Produtividade da Equipe',
    description: 'Identifica gargalos em setores técnicos e prevê sobrecargas antes que ocorra estouro de SLA.',
    badge: 'Gestão'
  },
  {
    id: 'ai-6',
    title: 'Sugestão de Melhorias em Processos',
    description: 'Avalia fluxos de formulários repetitivos e sugere simplificações ou automações via webhook.',
    badge: 'Otimização'
  }
];

export const MARKETING_VIDEOS_QUEUE = [
  {
    id: 'vid-1',
    title: 'Como funciona o suporte de TI?',
    theme: 'Help Desk & Infraestrutura',
    status: 'Roteiro pronto' as const,
    platform: 'Instagram & TikTok',
    duration: '00:58',
    scriptPreview: 'Roteiro explicativo em 3 etapas mostrando o fluxo de atendimento N1, N2 e N3 sem jargões confusos.'
  },
  {
    id: 'vid-2',
    title: 'O que faz um DBA?',
    theme: 'Bancos de Dados & Performance',
    status: 'Renderizando' as const,
    platform: 'YouTube Shorts & LinkedIn',
    duration: '01:15',
    scriptPreview: 'Por que o DBA é o guardião das informações da empresa: índices, backups de segurança e replicação em nuvem.'
  },
  {
    id: 'vid-3',
    title: 'Dicas de segurança digital',
    theme: 'Cyber Security & LGPD',
    status: 'Pronto para publicar' as const,
    platform: 'LinkedIn, TikTok & Instagram',
    duration: '00:45',
    scriptPreview: '3 hábitos simples para não cair em phishing corporativo e a importância de habilitar 2FA em todos os acessos.'
  }
];

export const SOCIAL_NETWORKS_STATUS = [
  { name: 'Instagram', account: '@bycomptecnologia', status: 'Planejado' },
  { name: 'TikTok', account: '@bycomptecnologia.oficial', status: 'Planejado' },
  { name: 'YouTube', account: 'ByComp Oficial', status: 'Planejado' },
  { name: 'LinkedIn', account: 'ByComp Soluções em TI', status: 'Planejado' }
];

export const MOCK_WHATSAPP_CONVERSATIONS = [
  {
    id: 'wa-c1',
    name: 'Cliente A — Falha no servidor',
    preview: 'Nosso link principal com o data center caiu faz 10 minutos...',
    time: '09:24',
    category: 'Suporte Crítico',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    unreadCount: 2,
    messages: [
      { id: 'm1', sender: 'Cliente A', text: 'Bom dia equipe ByComp. Identificamos lentidão extrema no ERP.', time: '09:20', isMe: false },
      { id: 'm2', sender: 'Cliente A', text: 'Nosso link principal com o data center caiu faz 10 minutos. Podem verificar?', time: '09:24', isMe: false },
      { id: 'm3', sender: 'ByComp (Atendente)', text: 'Olá! Já estamos com o Suporte N3 acionado no NOC. O link de contingência BGP está assumindo.', time: '09:25', isMe: true }
    ]
  },
  {
    id: 'wa-c2',
    name: 'Cliente B — Dúvida de acesso',
    preview: 'Como faço para redefinir o MFA no novo celular?',
    time: '09:12',
    category: 'Help Desk N1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    unreadCount: 1,
    messages: [
      { id: 'mb1', sender: 'Cliente B', text: 'Troquei de aparelho e não consigo gerar o código do Authenticator.', time: '09:10', isMe: false },
      { id: 'mb2', sender: 'Cliente B', text: 'Como faço para redefinir o MFA no novo celular?', time: '09:12', isMe: false }
    ]
  },
  {
    id: 'wa-c3',
    name: 'Colaborador — Solicitação de férias',
    preview: 'Enviei o formulário assinado para o RH.',
    time: '08:45',
    category: 'Interno DP',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    messages: [
      { id: 'mc1', sender: 'Colaborador', text: 'Bom dia Helena! Enviei o formulário assinado para o RH no módulo de processos.', time: '08:45', isMe: false },
      { id: 'mc2', sender: 'ByComp (Atendente)', text: 'Perfeito, recebido! O espelho e saldo de banco de horas foram validados.', time: '08:50', isMe: true }
    ]
  },
  {
    id: 'wa-c4',
    name: 'Fornecedor — Envio de cotação',
    preview: 'Segue a cotação dos switches Cisco Catalyst 24p.',
    time: '08:10',
    category: 'Compras',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    messages: [
      { id: 'md1', sender: 'Fornecedor', text: 'Olá Victor, bom dia! Segue a cotação dos switches Cisco Catalyst 24p com prazo de entrega de 5 dias úteis.', time: '08:10', isMe: false }
    ]
  }
];

export const CLIENTS_DATA = [
  {
    id: 'cli-1',
    name: 'TechCorp Brasil',
    plan: 'Suporte N1 + N2',
    sla: '99.5%',
    openTickets: 3,
    monthlyValue: 'R$ 14.800,00',
    contact: 'roberto@techcorp.com.br',
    status: 'Ativo'
  },
  {
    id: 'cli-2',
    name: 'LogiTrans',
    plan: 'Infraestrutura & Cloud',
    sla: '99.0%',
    openTickets: 1,
    monthlyValue: 'R$ 18.500,00',
    contact: 'ti@logitrans.com.br',
    status: 'Ativo'
  },
  {
    id: 'cli-3',
    name: 'Banco Ágata',
    plan: 'Cyber Security & DBA',
    sla: '99.9%',
    openTickets: 0,
    monthlyValue: 'R$ 42.000,00',
    contact: 'seguranca@bancoagata.com.br',
    status: 'Ativo'
  },
  {
    id: 'cli-4',
    name: 'Farmácias Viva',
    plan: 'Suporte N1 + PDV',
    sla: '98.5%',
    openTickets: 5,
    monthlyValue: 'R$ 11.200,00',
    contact: 'suporte@farmaciasviva.com.br',
    status: 'Ativo'
  },
  {
    id: 'cli-5',
    name: 'Varejo Max',
    plan: 'Full Stack & E-commerce',
    sla: '99.0%',
    openTickets: 2,
    monthlyValue: 'R$ 22.000,00',
    contact: 'operacoes@varejomax.com.br',
    status: 'Ativo'
  }
];

export const TICKETS_DATA = [
  {
    id: '#1082',
    client: 'TechCorp Brasil',
    subject: 'Falha de rota no gateway da filial SP',
    sector: 'Suporte N2' as Sector,
    priority: 'Crítica' as const,
    status: 'Em atendimento' as const,
    openTime: '42 min'
  },
  {
    id: '#1083',
    client: 'Banco Ágata',
    subject: 'Auditoria de chaves SSH no cluster de produção',
    sector: 'Cyber Security' as Sector,
    priority: 'Alta' as const,
    status: 'Em atendimento' as const,
    openTime: '1h 15m'
  },
  {
    id: '#1084',
    client: 'Farmácias Viva',
    subject: 'Impressora fiscal PDV não responde no terminal 03',
    sector: 'Suporte N1' as Sector,
    priority: 'Média' as const,
    status: 'Aberto' as const,
    openTime: '18 min'
  },
  {
    id: '#1085',
    client: 'LogiTrans',
    subject: 'Lentidão em query de rastreamento de cargas',
    sector: 'DBA' as Sector,
    priority: 'Alta' as const,
    status: 'Em atendimento' as const,
    openTime: '2h 05m'
  },
  {
    id: '#1086',
    client: 'Varejo Max',
    subject: 'Checkout acusando erro 502 no gateway Pix',
    sector: 'Back-End' as Sector,
    priority: 'Crítica' as const,
    status: 'Resolvido' as const,
    openTime: '35 min'
  },
  {
    id: '#1087',
    client: 'TechCorp Brasil',
    subject: 'Criação de 8 novas contas de e-mail corporativo',
    sector: 'Suporte N1' as Sector,
    priority: 'Baixa' as const,
    status: 'Aguardando' as const,
    openTime: '3h 40m'
  }
];

export const EQUIPMENT_DATA = [
  { id: 'eq-1', tag: 'PAT-0104', type: 'Notebook', model: 'Dell Latitude 5540 i7 32GB', assignee: 'Victor Estevão / Suporte N2', status: 'Em uso', deliveryDate: '10/01/2025' },
  { id: 'eq-2', tag: 'PAT-0082', type: 'Notebook', model: 'MacBook Pro 16 M3 Max 36GB', assignee: 'Beatriz Lima / Front-End', status: 'Em uso', deliveryDate: '15/03/2025' },
  { id: 'eq-3', tag: 'PAT-0012', type: 'Servidor', model: 'Dell PowerEdge R750 128GB', assignee: 'Datacenter SP01 / Suporte N3', status: 'Em uso', deliveryDate: '20/08/2024' },
  { id: 'eq-4', tag: 'PAT-0045', type: 'Switch', model: 'Cisco Catalyst 2960X 48P PoE', assignee: 'Rack B / Suporte N3', status: 'Em uso', deliveryDate: '05/06/2024' },
  { id: 'eq-5', tag: 'PAT-0118', type: 'Monitor', model: 'Dell UltraSharp 27 4K U2723QE', assignee: 'Camila Rocha / DBA', status: 'Em uso', deliveryDate: '12/04/2025' },
  { id: 'eq-6', tag: 'PAT-0129', type: 'Headset', model: 'Jabra Evolve2 65 Wireless', assignee: 'Mariana Castro / Suporte N1', status: 'Em uso', deliveryDate: '01/02/2026' },
  { id: 'eq-7', tag: 'PAT-0138', type: 'Notebook', model: 'ThinkPad T14s Gen 4 AMD', assignee: 'Estoque Central TI', status: 'Estoque', deliveryDate: '02/09/2026' },
  { id: 'eq-8', tag: 'PAT-0099', type: 'Notebook', model: 'Dell Inspiron 5402 i5', assignee: 'Assistência Dell (Troca de tela)', status: 'Manutenção', deliveryDate: '11/09/2026' }
];




