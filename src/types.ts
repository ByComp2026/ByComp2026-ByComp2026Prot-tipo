export type Sector = string;

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMINISTRATIVO'
  | 'GESTOR'
  | 'COLABORADOR';

export interface UserRolePermissions {
  role: UserRole;
  label: string;
  description: string;
  allowedActions: string[];
}

export interface OrganizationalSector {
  id: string;
  name: string;
  area: 'SUPORTE' | 'DESENVOLVIMENTO' | 'SEGURANÇA' | 'DADOS' | 'ADMINISTRATIVO' | string;
  leaderName?: string;
  collaboratorsCount: number;
  description?: string;
  slaTarget?: string;
  isCustom?: boolean;
}

export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export type TaskStatus = 'BACKLOG' | 'A_FAZER' | 'EM_ANDAMENTO' | 'EM_REVISAO' | 'CONCLUIDO';

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  userRole?: UserRole;
  area?: string;
  sector: Sector;
  email: string;
  avatar: string;
  status: 'Em atividade' | 'Intervalo' | 'Ausente' | 'Férias' | 'Bloqueado';
  currentTask: string;
  phone: string;
  admissionDate: string;
  tasksCount?: number;
  isBlocked?: boolean;
  customPermissions?: string[];
  contractType?: 'CLT' | 'PJ' | 'Estágio';
  salaryBracket?: string;
  workSchedule?: string;
  asoStatus?: 'Em dia' | 'A renovar' | 'Pendente';
  benefits?: string[];
  cpfMasked?: string;
  emergencyContact?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  sector: Sector;
  assigneeName: string;
  assigneeAvatar?: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string;
  tag: string;
  commentsCount: number;
  subtasks: { id: string; title: string; done: boolean }[];
  isDelayed?: boolean;
}

export interface ActivityRecord {
  id: string;
  date: string;
  time: string;
  collaborator: string;
  sector: Sector;
  activity: string;
  priority: Priority;
  status: 'Concluído' | 'Em andamento' | 'Pendente' | 'Em revisão';
  timeSpent: string;
  observation: string;
  attachment?: string;
}

export interface AttendanceRecord {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  sector: Sector;
  date: string;
  entry: string;
  breakStart: string;
  breakEnd: string;
  exit: string;
  totalHours: string;
  status: 'Normal' | 'Atraso' | 'Hora Extra' | 'Em expediente' | 'Intervalo';
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  date: string;
  sector: Sector;
  type: 'Reunião' | 'Alinhamento' | 'Plantão' | 'Entrega';
  attendees: string[];
  location: string;
}

export interface AuditLog {
  id: string;
  date: string;
  time: string;
  user: string;
  module: 'Ponto' | 'Kanban' | 'Atividade' | 'CRM' | 'Segurança' | 'Formulários' | 'Admin';
  action: string;
  description: string;
  status: 'Sucesso' | 'Alerta' | 'Info';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
  user: string;
  actionType: string;
  description: string;
  ip: string;
}

export interface ClientEntity {
  id: string;
  name: string;
  plan: string;
  sla: string;
  openTickets: number;
  monthlyValue: string;
  contact: string;
  status: string;
}

export interface TicketHistoryItem {
  timestamp: string;
  action: string;
  user: string;
  userSector?: string;
  details?: string;
}

export interface SupportTicket {
  id: string;
  client: string;
  subject: string;
  sector: Sector;
  assignedTo?: string;
  assignedAvatar?: string;
  priority: Priority;
  status: 'Aberto' | 'Em atendimento' | 'Aguardando' | 'Resolvido';
  openTime: string;
  serviceType?: string;
  resolutionSummary?: string;
  knowledgeBaseId?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedSector?: string;
  resolutionTimeSpent?: string;
  history?: TicketHistoryItem[];
  description?: string;
  contactEmail?: string;
  slaLimitHours?: number;
}

export interface KnowledgeArticle {
  id: string;
  code: string;
  title: string;
  sector: Sector;
  serviceType: string;
  category: 'Acessos & Identidade' | 'Redes & Conectividade' | 'Bancos de Dados' | 'Aplicações & APIs' | 'Infraestrutura & Nuvem' | 'Segurança & LGPD' | 'Hardware & Periféricos' | 'Sistemas & ERP';
  summarySolution: string;
  detailedProcedure: string[];
  estimatedResolutionMinutes: number;
  tags: string[];
  usefulCount: number;
  lastUpdated: string;
  author: string;
}

export interface EquipmentItem {
  id: string;
  tag: string;
  type: string;
  model: string;
  assignee: string;
  status: 'Em uso' | 'Estoque' | 'Manutenção';
  deliveryDate: string;
}

export interface MarketingVideoItem {
  id: string;
  title: string;
  theme: string;
  status: 'Roteiro pronto' | 'Renderizando' | 'Pronto para publicar';
  platform: string;
  duration: string;
  scriptPreview: string;
}

export interface WhatsAppConversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  category: string;
  avatar: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: string;
    text: string;
    time: string;
    isMe: boolean;
  }[];
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  fieldsCount: number;
  lastUpdated: string;
  iconName: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number';
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }[];
}

export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppContact {
  id: string;
  name: string;
  company: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'Em atendimento' | 'Proposta enviada' | 'Suporte N2' | 'Concluído';
  customerSince: string;
  manager: string;
  phone: string;
  email: string;
  tasks: {
    id: string;
    title: string;
    deadline: string;
    done: boolean;
    assignee: string;
  }[];
  messages: WhatsAppMessage[];
}

export type ViewScreen = 
  | 'login'
  | 'dashboard'
  | 'colaboradores'
  | 'formularios'
  | 'planilhas'
  | 'agenda'
  | 'meu_kanban'
  | 'kanban_equipe'
  | 'visao_semanal'
  | 'registro_atividades'
  | 'registro_ponto'
  | 'gestao_ponto'
  | 'espelho_ponto'
  | 'ai_hub'
  | 'social_ai'
  | 'marketing_hub'
  | 'gerador_video'
  | 'instagram'
  | 'tiktok'
  | 'whatsapp'
  | 'clientes'
  | 'chamados'
  | 'equipamentos'
  | 'relatorios'
  | 'auditoria'
  | 'organograma'
  | 'visao_geral'
  | 'design_system'
  | 'configuracoes';
