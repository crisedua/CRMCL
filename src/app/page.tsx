'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { BarChart3, Users, Calendar, Target, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">CRM Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestiona tus clientes como un
            <span className="text-primary-600"> profesional</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Organiza tus contactos, gestiona oportunidades de venta y mantén un seguimiento 
            completo de todas tus interacciones comerciales en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para hacer crecer tu negocio
            </h3>
            <p className="text-lg text-gray-600">
              Herramientas poderosas y fáciles de usar para gestionar tus relaciones comerciales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Gestión de Contactos
              </h4>
              <p className="text-gray-600">
                Organiza todos tus clientes y prospectos en un directorio centralizado 
                con información completa y actualizada.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Pipeline de Ventas
              </h4>
              <p className="text-gray-600">
                Rastrea oportunidades a través de tu embudo de ventas y mejora 
                tu tasa de conversión con seguimiento automatizado.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Tareas y Recordatorios
              </h4>
              <p className="text-gray-600">
                Nunca pierdas una oportunidad con nuestro sistema de tareas 
                y recordatorios automáticos para el seguimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir nuestro CRM?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Seguro y Confiable</h4>
                    <p className="text-gray-600">Tus datos están protegidos con encriptación de nivel empresarial.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-6 w-6 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rápido y Eficiente</h4>
                    <p className="text-gray-600">Interfaz optimizada para maximizar tu productividad diaria.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="h-6 w-6 text-blue-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Análisis Detallados</h4>
                    <p className="text-gray-600">Obtén insights valiosos sobre tu desempeño de ventas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Comienza hoy mismo
              </h4>
              <p className="text-gray-600 text-center mb-6">
                Únete a miles de empresas que ya están transformando 
                sus ventas con nuestro CRM.
              </p>
              <div className="space-y-4">
                <Link href="/auth/signup">
                  <Button className="w-full" size="lg">
                    Crear Cuenta Gratuita
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="secondary" className="w-full" size="lg">
                    ¿Ya tienes cuenta? Inicia sesión
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BarChart3 className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">CRM Pro</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 CRM Pro. Todos los derechos reservados.</p>
              <p className="text-sm">Gestión profesional de relaciones con clientes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
