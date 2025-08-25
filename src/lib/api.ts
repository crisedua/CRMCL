import { createClientSupabase } from '@/lib/supabase'
import { 
  Client, 
  Opportunity, 
  Task, 
  Interaction, 
  DashboardStats,
  CreateClientData,
  CreateOpportunityData,
  CreateTaskData,
  CreateInteractionData
} from '@/types'

class ApiService {
  private supabase = createClientSupabase()

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Get clients stats
    const { data: clients } = await this.supabase
      .from('clients')
      .select('status')
      .eq('user_id', user.id)

    // Get opportunities stats
    const { data: opportunities } = await this.supabase
      .from('opportunities')
      .select('stage, value')
      .eq('user_id', user.id)

    // Get tasks stats
    const { data: tasks } = await this.supabase
      .from('tasks')
      .select('status, due_date')
      .eq('user_id', user.id)

    const totalClients = clients?.length || 0
    const activeClients = clients?.filter(c => c.status === 'active').length || 0
    const totalOpportunities = opportunities?.length || 0
    const totalOpportunityValue = opportunities?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0
    const wonOpportunities = opportunities?.filter(opp => opp.stage === 'closed_won').length || 0
    const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0
    
    const now = new Date()
    const overdueTasks = tasks?.filter(t => {
      if (!t.due_date || t.status === 'completed') return false
      return new Date(t.due_date) < now
    }).length || 0

    return {
      totalClients,
      activeClients,
      totalOpportunities,
      totalOpportunityValue,
      wonOpportunities,
      pendingTasks,
      overdueTasks,
    }
  }

  // Clients CRUD
  async getClients(): Promise<Client[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getClient(id: string): Promise<Client> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('clients')
      .insert({
        ...clientData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateClient(id: string, clientData: Partial<CreateClientData>): Promise<Client> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteClient(id: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Opportunities CRUD
  async getOpportunities(): Promise<Opportunity[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('opportunities')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createOpportunity(opportunityData: CreateOpportunityData): Promise<Opportunity> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('opportunities')
      .insert({
        ...opportunityData,
        user_id: user.id,
      })
      .select(`
        *,
        client:clients(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async updateOpportunity(id: string, opportunityData: Partial<CreateOpportunityData>): Promise<Opportunity> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('opportunities')
      .update(opportunityData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        client:clients(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async deleteOpportunity(id: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await this.supabase
      .from('opportunities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Tasks CRUD
  async getTasks(): Promise<Task[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('tasks')
      .select(`
        *,
        client:clients(*),
        opportunity:opportunities(*)
      `)
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: user.id,
      })
      .select(`
        *,
        client:clients(*),
        opportunity:opportunities(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async updateTask(id: string, taskData: Partial<CreateTaskData>): Promise<Task> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        client:clients(*),
        opportunity:opportunities(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async deleteTask(id: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Interactions CRUD
  async getInteractions(clientId?: string): Promise<Interaction[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    let query = this.supabase
      .from('interactions')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('user_id', user.id)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createInteraction(interactionData: CreateInteractionData): Promise<Interaction> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('interactions')
      .insert({
        ...interactionData,
        user_id: user.id,
      })
      .select(`
        *,
        client:clients(*)
      `)
      .single()

    if (error) throw error
    return data
  }
}

export const apiService = new ApiService()
