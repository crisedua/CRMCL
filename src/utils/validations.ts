import { z } from 'zod'

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

// Client schemas
export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'prospect']).default('prospect'),
})

// Opportunity schemas
export const opportunitySchema = z.object({
  client_id: z.string().min(1, 'El cliente es requerido'),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  value: z.number().positive('El valor debe ser positivo').optional(),
  stage: z.enum(['prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).default('prospect'),
  probability: z.number().min(0).max(100).optional(),
  expected_close_date: z.string().optional(),
})

// Task schemas
export const taskSchema = z.object({
  client_id: z.string().optional(),
  opportunity_id: z.string().optional(),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
})

// Interaction schemas
export const interactionSchema = z.object({
  client_id: z.string().min(1, 'El cliente es requerido'),
  type: z.enum(['call', 'email', 'meeting', 'note']),
  subject: z.string().min(2, 'El asunto debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
})

// Profile schema
export const profileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ClientData = z.infer<typeof clientSchema>
export type OpportunityData = z.infer<typeof opportunitySchema>
export type TaskData = z.infer<typeof taskSchema>
export type InteractionData = z.infer<typeof interactionSchema>
export type ProfileData = z.infer<typeof profileSchema>
