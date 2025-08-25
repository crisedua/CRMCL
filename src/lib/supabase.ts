import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createClientSupabase = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          position: string | null
          notes: string | null
          status: 'active' | 'inactive' | 'prospect'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          position?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'prospect'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          position?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'prospect'
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          description: string | null
          value: number | null
          stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability: number | null
          expected_close_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          description?: string | null
          value?: number | null
          stage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability?: number | null
          expected_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          title?: string
          description?: string | null
          value?: number | null
          stage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability?: number | null
          expected_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          opportunity_id: string | null
          title: string
          description: string | null
          due_date: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          opportunity_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          opportunity_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          client_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          subject: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          subject: string
          description?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          type?: 'call' | 'email' | 'meeting' | 'note'
          subject?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
