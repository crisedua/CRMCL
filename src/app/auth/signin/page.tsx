'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BarChart3 className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <AuthForm mode="signin" />
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
