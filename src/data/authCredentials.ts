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
    id: 'user-master-victor',
    name: 'Victor (Master Admin)',
    email: 'victormorekids@gmail.com',
    password: '842867',
    role: 'SUPER_ADMIN',
    roleLabel: 'SUPER ADMINISTRADOR (MASTER)',
    hierarchyLevel: 1,
    sector: 'Gestão Executiva',
    area: 'ADMINISTRATIVO',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '(11) 98765-4321',
    admissionDate: '2021-01-10',
    status: 'Em atividade',
    currentTask: 'Governança master, supervisão executiva e controle irrestrito',
    description: 'Usuário Master único com acesso irrestrito a 100% das telas, banco de dados Firebase e configurações biométricas.',
    allowedScreensCount: 28,
    badgeStyle: {
      bg: 'bg-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-700/80'
    },
    keyPermissions: [
      'Acesso total e irrestrito (Master Super Admin)',
      'Visualizar e gerenciar todos os setores organizacionais',
      'Cadastro e validação de biometria facial para ponto',
      'Conexão ativa Firebase Firestore e migração para PostgreSQL',
      'Acesso à Trilha de Auditoria e Logs de Conformidade',
      'Visualização e aprovação de todos os Kanbans e chamados',
      'Gestão global de ponto e espelhos de registro eletrônico'
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
    screenTitle: 'Fase 3 • Organograma Institucional (Área Privada: Gestão, Adm & RH)',
    category: 'FASE 3 • PRIVADA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Área Privada Corporativa (Fase 3): Acesso confidencial e restrito exclusivamente à Gestão, Administração e Recursos Humanos (RH) da ByComp. A visualização de linhas de comando de subordinação, metas de SLA e reestruturação de setores é vedada a colaboradores operacionais.',
    recommendedRoleToTest: 'GESTOR'
  },
  colaboradores: {
    screen: 'colaboradores',
    screenTitle: 'Fase 4 • Colaboradores (Área Privada: Gestão, Adm & RH)',
    category: 'FASE 4 • PRIVADA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Área Privada Corporativa (Fase 4): Acesso confidencial e restrito exclusivamente à Gestão, Administração e Recursos Humanos (RH) da ByComp em conformidade com as diretrizes internas e a LGPD. Colaboradores operacionais não possuem permissão para visualizar o dossiê cadastral, contratos e quadro de pessoal.',
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
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'],
    restrictionReason: 'Controle de patrimônio de infraestrutura, switches e servidores reservado a Gestores, Administrativo e equipe de Patrimônio.',
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
  },
  design_system: {
    screen: 'design_system',
    screenTitle: 'Fase 2 • UX/UI Design System & Wireframes (Área Privada: Gestão, Adm & RH)',
    category: 'FASE 2 • PRIVADA',
    allowedRoles: ['SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR'],
    restrictionReason: 'Área Privada Corporativa (Fase 2): Acesso confidencial e restrito exclusivamente à Gestão, Administração e Recursos Humanos (RH) da ByComp. O mapa de navegação interativo das 22 telas, wireframes de alta fidelidade e especificações de produto são confidenciais.',
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

export const AUTH_ACCOUNTS = USER_CREDENTIALS;
