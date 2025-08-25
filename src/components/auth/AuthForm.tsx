'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signUpSchema, type SignInData, type SignUpData } from '@/utils/validations'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const isSignUp = mode === 'signup'
  const schema = isSignUp ? signUpSchema : signInSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SignInData | SignUpData) => {
    setLoading(true)
    setError('')

    try {
      let result
      
      if (isSignUp) {
        const signUpData = data as SignUpData
        result = await authService.signUp({
          email: signUpData.email,
          password: signUpData.password,
          fullName: signUpData.fullName,
        })
      } else {
        const signInData = data as SignInData
        result = await authService.signIn({
          email: signInData.email,
          password: signInData.password,
        })
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onSuccess?.()
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Error interno del servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSignUp && (
        <Input
          label="Nombre completo"
          type="text"
          {...register('fullName')}
          error={errors.fullName?.message as string}
          placeholder="Tu nombre completo"
        />
      )}

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message as string}
        placeholder="tu@email.com"
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message as string}
        placeholder="••••••••"
      />

      {isSignUp && (
        <Input
          label="Confirmar contraseña"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message as string}
          placeholder="••••••••"
        />
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
