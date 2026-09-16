import { ViewScreen, UserRole, Collaborator } from '../types';

export interface UserCredentialAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  roleLabel: string;
  hierarchyLevel: number;
  sector: string;
  area: string;
  avatar: string;
  phone: string;
  admissionDate: string;
  status: 'Em atividade' | 'Intervalo' | 'Ausente' | 'Férias' | 'Bloqueado';
  currentTask: string;
  description: string;
  allowedScreensCount: number;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  keyPermissions: string[];
}

export const USER_CREDENTIALS: UserCredentialAccount[] = [
  {
    id: 'user-victor',
    name: 'Victor Estevão',
    email: 'victor.estevao@bycomp.com.br',
    password: 'admin@bycomp2026',
    role: 'SUPER_ADMIN',
    roleLabel: 'SUPER ADMINISTRADOR',
    hierarchyLevel: 1,
    sector: 'Gestão',
    area: 'ADMINISTRATIVO',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 98765-4321',
    admissionDate: '2021-01-10',
    status: 'Em atividade',
    currentTask: 'Supervisão executiva e governança completa da plataforma',
    description: 'Acesso irrestrito a 100% das 22 telas e módulos críticos do ecossistema.',
    allowedScreensCount: 27,
    badgeStyle: {
      bg: 'bg-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-700/80'
    },
    keyPermissions: [
      'Visualizar e gerenciar todos os setores organizacionais',
      'Criar, editar e bloquear colaboradores e credenciais',
      'Configurar matriz de permissões e políticas RBAC',
      'Acesso à Trilha de Auditoria e Logs de Conformidade',
      'Visualizar todos os Kanbans (N1, N2, N3, Devs, DBA, Sec)',
      'Gestão global de ponto de todos os 48 colaboradores',
      'Configurações de infraestrutura, IA, WhatsApp e Redes Sociais'
    ]
  },
  {
    id: 'user-helena',
    name: 'Helena Santos',
    email: 'helena.santos@bycomp.com.br',
    password: 'admin@rh2026',
    role: 'ADMINISTRATIVO',
    roleLabel: 'ADMINISTRATIVO',
    hierarchyLevel: 2,
    sector: 'RH',
    area: 'ADMINISTRATIVO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99871-0002',
    admissionDate: '2022-04-12',
    status: 'Em atividade',
    currentTask: 'Acompanhamento de ponto, colaboradores e rotinas administrativas',
    description: 'Gestão de pessoas, rotinas administrativas, controle de ponto e documentação corporativa.',
    allowedScreensCount: 22,
    badgeStyle: {
      bg: 'bg-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-700/80'
    },
    keyPermissions: [
      'Cadastro e manutenção dos 48 colaboradores',
      'Gestão corporativa de ponto e aprovação de espelhos',
      'Central de Formulários padronizados e requisições',
      'Base de Planilhas operacionais e controles administrativos',
      'Agenda corporativa e reuniões institucionais',
      'Acompanhamento de Help Desk e clientes'
    ]
  },
  {
    id: 'user-carlos',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@bycomp.com.br',
    password: 'gestor@sup2026',
    role: 'GESTOR',
    roleLabel: 'GESTOR (Suporte N3)',
    hierarchyLevel: 3,
    sector: 'N3',
    area: 'SUPORTE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99871-0003',
    admissionDate: '2022-08-01',
    status: 'Em atividade',
    currentTask: 'Gestão da fila técnica N3 e SLA de infraestrutura crítica',
    description: 'Liderança técnica da equipe de Suporte N3. Foco em produtividade, fila e SLAs setoriais.',
    allowedScreensCount: 18,
    badgeStyle: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-700/80'
    },
    keyPermissions: [
      'Kanban da equipe técnica de Suporte N3',
      'Acompanhamento de tarefas e fila de chamados críticos',
      'Indicadores de produtividade e SLA do setor',
      'Registro de ponto eletrônico individual e espelho próprio',
      'Agenda técnica e plantões da equipe N3',
      'Gestão de equipamentos e hardware de infraestrutura'
    ]
  },
  {
    id: 'user-gabriel',
    name: 'Gabriel Ribeiro',
    email: 'gabriel.ribeiro@bycomp.com.br',
    password: 'colab@n12026',
    role: 'COLABORADOR',
    roleLabel: 'COLABORADOR (Suporte N1)',
    hierarchyLevel: 4,
    sector: 'N1',
    area: 'SUPORTE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99871-0004',
    admissionDate: '2023-02-15',
    status: 'Em atividade',
    currentTask: 'Atendimento a chamados N1 e triagem de chamados',
    description: 'Operação individual focada em suas demandas atribuídas e ponto eletrônico.',
    allowedScreensCount: 9,
    badgeStyle: {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700'
    },
    keyPermissions: [
      'Meu Kanban individual e tarefas atribuídas',
      'Registro de Ponto Eletrônico biométrico diário',
      'Consulta ao espelho de horas individual',
      'Apontamento de atividades e tempo gasto',
      'Agenda pessoal de alinhamentos e compromissos',
      'Atendimento aos chamados atribuídos da fila N1'
    ]
  },
  {
    id: 'user-beatriz',
    name: 'Beatriz Lima',
    email: 'beatriz.lima@bycomp.com.br',
    password: 'dev@lead2026',
    role: 'GESTOR',
    roleLabel: 'GESTOR (Front-End)',
    hierarchyLevel: 3,
    sector: 'Front-End',
    area: 'DESENVOLVIMENTO',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99871-0005',
    admissionDate: '2022-03-20',
    status: 'Em atividade',
    currentTask: 'Sprint review do design system e novas interfaces',
    description: 'Liderança do Squad Front-End, com foco em desenvolvimento web, IA e interfaces.',
    allowedScreensCount: 19,
    badgeStyle: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-700/80'
    },
    keyPermissions: [
      'Kanban do squad Front-End e entregas da sprint',
      'AI Hub e automações inteligentes de código',
      'Marketing & Criação de Vídeos com IA',
      'Acompanhamento de demandas e métricas da equipe Dev'
    ]
  },
  {
    id: 'user-lucas',
    name: 'Lucas Martins',
    email: 'lucas.martins@bycomp.com.br',
    password: 'sec@guard2026',
    role: 'GESTOR',
    roleLabel: 'GESTOR (Cyber Security)',
    hierarchyLevel: 3,
    sector: 'Cyber Security',
    area: 'SEGURANÇA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 99871-0006',
    admissionDate: '2021-11-05',
    status: 'Em atividade',
    currentTask: 'Auditoria de vulnerabilidades e resposta a alertas do SOC',
    description: 'Líder de Cyber Security e conformidade de segurança de dados.',
    allowedScreensCount: 18,
    badgeStyle: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-700/80'
    },
    keyPermissions: [
      'Monitoramento de incidentes de segurança e chamados SOC',
      'Kanban de correções de segurança e conformidade',
      'Inventário de equipamentos de rede e firewall',
      'Relatórios de mitigação de risco e incidentes'
    ]
  }
];

export interface ScreenSecurityPolicy {
  screen: ViewScreen;
  screenTitle: string;
  category: string;
  allowedRoles: UserRole[];
  restrictionReason: string;
  recommendedRoleToTest: UserRole;
}

export const SCREEN_SECURITY_POLICIES: Record<ViewScreen, ScreenSecurityPolicy> = {
  login: {
    screen: 'login',
    screenTitle: 'Autenticação & Login',
    category: 'SISTEMA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Tela pública de autenticação para todos os colaboradores.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  dashboard: {
    screen: 'dashboard',
    screenTitle: 'Dashboard Corporativo',
    category: 'VISÃO GERAL',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Visão executiva contextualizada para o nível do usuário.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  visao_geral: {
    screen: 'visao_geral',
    screenTitle: 'Central de Gestão (22 Telas)',
    category: 'VISÃO GERAL',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'A Central Executiva de Gestão e Visão Arquitetural das 22 Telas é restrita a Líderes, Gestores e Diretoria.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  organograma: {
    screen: 'organograma',
    screenTitle: 'Organograma Institucional',
    category: 'VISÃO GERAL',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Disponível para consulta institucional por todos os colaboradores da empresa.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  colaboradores: {
    screen: 'colaboradores',
    screenTitle: 'Quadro Geral de Colaboradores',
    category: 'VISÃO GERAL',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'O gerenciamento do quadro de 48 colaboradores e setores é exclusivo do setor Administrativo e da Diretoria.',
    recommendedRoleToTest: 'ADMINISTRATIVO'
  },
  chamados: {
    screen: 'chamados',
    screenTitle: 'Help Desk & Chamados',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Aberto para atendimento operacional, triagem e resolução de tickets de suporte.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  meu_kanban: {
    screen: 'meu_kanban',
    screenTitle: 'Meu Kanban Pessoal',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Espaço individual de execução de tarefas atribuídas ao colaborador.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  kanban_equipe: {
    screen: 'kanban_equipe',
    screenTitle: 'Kanban da Equipe Técnica',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'A gestão do backlog e distribuição do Kanban da equipe cabe aos Gestores e à Coordenação.',
    recommendedRoleToTest: 'GESTOR'
  },
  visao_semanal: {
    screen: 'visao_semanal',
    screenTitle: 'Planejamento Semanal',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'O planejamento semanal de capacidade do setor é de responsabilidade dos Gestores.',
    recommendedRoleToTest: 'GESTOR'
  },
  planilhas: {
    screen: 'planilhas',
    screenTitle: 'Base de Atividades & Planilhas',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Consolidação e exportação de planilhas operacionais reservadas a Gestão e Administrativo.',
    recommendedRoleToTest: 'ADMINISTRATIVO'
  },
  formularios: {
    screen: 'formularios',
    screenTitle: 'Formulários Corporativos',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Criação e padronização de formulários corporativos gerenciados pelo setor Administrativo.',
    recommendedRoleToTest: 'ADMINISTRATIVO'
  },
  registro_atividades: {
    screen: 'registro_atividades',
    screenTitle: 'Registrar Atividades',
    category: 'OPERAÇÃO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Apontamento de rotinas diárias e horas dedicadas disponível para todos os colaboradores.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  registro_ponto: {
    screen: 'registro_ponto',
    screenTitle: 'Registro de Ponto Eletrônico',
    category: 'PESSOAS & PONTO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Módulo universal de registro biométrico e geolocalizado de jornada de trabalho.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  espelho_ponto: {
    screen: 'espelho_ponto',
    screenTitle: 'Espelho de Ponto Individual',
    category: 'PESSOAS & PONTO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Consulta ao histórico pessoal de batidas e saldo de banco de horas.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  gestao_ponto: {
    screen: 'gestao_ponto',
    screenTitle: 'Gestão de Ponto Geral (Admin)',
    category: 'PESSOAS & PONTO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO'],
    restrictionReason: 'O painel corporativo de aprovação, espelhos de todos os 48 colaboradores e controle de horas extras é restrito ao Administrativo/RH e Super Admin.',
    recommendedRoleToTest: 'ADMINISTRATIVO'
  },
  agenda: {
    screen: 'agenda',
    screenTitle: 'Agenda & Reuniões',
    category: 'PESSOAS & PONTO',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Agenda institucional e reuniões setoriais abertas a todos os colaboradores.',
    recommendedRoleToTest: 'COLABORADOR'
  },
  clientes: {
    screen: 'clientes',
    screenTitle: 'Gestão de Clientes',
    category: 'COMERCIAL & ATIVOS',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Carteira de clientes B2B e contratos atendidos por Gestores e Administrativo.',
    recommendedRoleToTest: 'ADMINISTRATIVO'
  },
  equipamentos: {
    screen: 'equipamentos',
    screenTitle: 'Equipamentos & Hardware TI',
    category: 'COMERCIAL & ATIVOS',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Controle de patrimônio de infraestrutura, switches e servidores reservado a Gestores e TI.',
    recommendedRoleToTest: 'GESTOR'
  },
  whatsapp: {
    screen: 'whatsapp',
    screenTitle: 'WhatsApp Business CRM',
    category: 'COMERCIAL & ATIVOS',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Canais corporativos de relacionamento e suporte via WhatsApp atendidos por equipes autorizadas.',
    recommendedRoleToTest: 'GESTOR'
  },
  ai_hub: {
    screen: 'ai_hub',
    screenTitle: 'ByComp AI Hub',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Assistentes de IA generativa corporativa liberados para lideranças e coordenação.',
    recommendedRoleToTest: 'GESTOR'
  },
  marketing_hub: {
    screen: 'marketing_hub',
    screenTitle: 'Marketing & Vídeos IA',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Ferramentas de marketing institucional e criação de campanhas.',
    recommendedRoleToTest: 'GESTOR'
  },
  social_ai: {
    screen: 'social_ai',
    screenTitle: 'Social AI Studio',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Gerador inteligente de posts para redes sociais.',
    recommendedRoleToTest: 'GESTOR'
  },
  gerador_video: {
    screen: 'gerador_video',
    screenTitle: 'AI Video Studio',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Geração de roteiros e vídeos de marketing com IA.',
    recommendedRoleToTest: 'GESTOR'
  },
  instagram: {
    screen: 'instagram',
    screenTitle: 'Instagram Feed & Stories',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Publicação e monitoramento de engajamento do Instagram corporativo.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  tiktok: {
    screen: 'tiktok',
    screenTitle: 'TikTok Ads & Shorts',
    category: 'MARKETING & IA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Campanhas de conteúdo em vídeo do TikTok corporativo.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  relatorios: {
    screen: 'relatorios',
    screenTitle: 'Central de Relatórios',
    category: 'GOVERNANÇA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Relatórios consolidados de SLA, chamados e produtividade gerencial.',
    recommendedRoleToTest: 'GESTOR'
  },
  auditoria: {
    screen: 'auditoria',
    screenTitle: 'Auditoria do Sistema (Logs)',
    category: 'GOVERNANÇA',
    allowedRoles: ['SUPER_ADMIN'],
    restrictionReason: 'A Trilha de Auditoria com registros criptográficos, IPs, logins e integridade é de acesso EXCLUSIVO do SUPER ADMINISTRADOR.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  },
  configuracoes: {
    screen: 'configuracoes',
    screenTitle: 'Configurações de TI',
    category: 'GOVERNANÇA',
    allowedRoles: ['SUPER_ADMIN'],
    restrictionReason: 'Parâmetros de infraestrutura, portas de rede, chaves de API e variáveis de ambiente são de acesso EXCLUSIVO do SUPER ADMINISTRADOR.',
    recommendedRoleToTest: 'SUPER_ADMIN'
  }
};

export function checkScreenAccess(screen: ViewScreen, userRole?: UserRole): {
  allowed: boolean;
  policy: ScreenSecurityPolicy;
} {
  const policy = SCREEN_SECURITY_POLICIES[screen] || {
    screen,
    screenTitle: screen,
    category: 'SISTEMA',
    allowedRoles: ['SUPER_ADMIN'],
    restrictionReason: 'Tela restrita por padrão.',
    recommendedRoleToTest: 'SUPER_ADMIN' as UserRole
  };

  const role = userRole || 'COLABORADOR';
  const allowed = policy.allowedRoles.includes(role);

  return { allowed, policy };
}

export function convertCredentialToCollaborator(account: UserCredentialAccount): Collaborator {
  return {
    id: account.id,
    name: account.name,
    role: account.roleLabel,
    userRole: account.role,
    sector: account.sector,
    area: account.area,
    email: account.email,
    avatar: account.avatar,
    phone: account.phone,
    admissionDate: account.admissionDate,
    status: account.status,
    currentTask: account.currentTask
  };
}
