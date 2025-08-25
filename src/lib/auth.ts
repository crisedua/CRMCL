import { createClientSupabase } from '@/lib/supabase'
import { User } from '@/types'

export interface AuthError {
  message: string
}

export interface AuthResponse {
  user?: User
  error?: AuthError
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  private supabase = createClientSupabase()

  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error: { message: error.message } }
      }

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
          },
        }
      }

      return { error: { message: 'Error durante el registro' } }
    } catch (error) {
      return { error: { message: 'Error interno del servidor' } }
    }
  }

  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: { message: error.message } }
      }

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name,
          },
        }
      }

      return { error: { message: 'Error durante el inicio de sesión' } }
    } catch (error) {
      return { error: { message: 'Error interno del servidor' } }
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
      }
    } catch (error) {
      return null
    }
  }

  async resetPassword(email: string): Promise<{ error?: AuthError }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: { message: error.message } }
      }

      return {}
    } catch (error) {
      return { error: { message: 'Error interno del servidor' } }
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
        })
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
