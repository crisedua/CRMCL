export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  notes?: string
  status: 'active' | 'inactive' | 'prospect'
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  user_id: string
  client_id: string
  client?: Client
  title: string
  description?: string
  value?: number
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability?: number
  expected_close_date?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  client_id?: string
  opportunity_id?: string
  client?: Client
  opportunity?: Opportunity
  title: string
  description?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  user_id: string
  client_id: string
  client?: Client
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  description?: string
  date: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalClients: number
  activeClients: number
  totalOpportunities: number
  totalOpportunityValue: number
  wonOpportunities: number
  pendingTasks: number
  overdueTasks: number
}

export interface CreateClientData {
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  notes?: string
  status?: 'active' | 'inactive' | 'prospect'
}

export interface CreateOpportunityData {
  client_id: string
  title: string
  description?: string
  value?: number
  stage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability?: number
  expected_close_date?: string
}

export interface CreateTaskData {
  client_id?: string
  opportunity_id?: string
  title: string
  description?: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface CreateInteractionData {
  client_id: string
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  description?: string
  date: string
}
