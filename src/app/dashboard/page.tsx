'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { apiService } from '@/lib/api'
import { DashboardStats } from '@/types'
import { Users, Target, Calendar, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await apiService.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu actividad comercial</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clientes"
            value={stats?.totalClients || 0}
            icon={Users}
            color="blue"
            subtitle={`${stats?.activeClients || 0} activos`}
          />
          <StatCard
            title="Oportunidades"
            value={stats?.totalOpportunities || 0}
            icon={Target}
            color="green"
            subtitle={`${stats?.wonOpportunities || 0} ganadas`}
          />
          <StatCard
            title="Valor Pipeline"
            value={`$${(stats?.totalOpportunityValue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="purple"
            subtitle="Total en oportunidades"
          />
          <StatCard
            title="Tareas Pendientes"
            value={stats?.pendingTasks || 0}
            icon={Calendar}
            color={stats?.overdueTasks ? 'red' : 'yellow'}
            subtitle={`${stats?.overdueTasks || 0} vencidas`}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <QuickActionButton
                href="/dashboard/clients/new"
                icon={Users}
                title="Nuevo Cliente"
                description="Agregar un nuevo cliente o prospecto"
              />
              <QuickActionButton
                href="/dashboard/opportunities/new"
                icon={Target}
                title="Nueva Oportunidad"
                description="Crear una nueva oportunidad de venta"
              />
              <QuickActionButton
                href="/dashboard/tasks/new"
                icon={Calendar}
                title="Nueva Tarea"
                description="Programar una nueva tarea o recordatorio"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">
                    Tasa de Conversión
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {stats?.totalOpportunities ? 
                    Math.round((stats.wonOpportunities / stats.totalOpportunities) * 100) : 0}%
                </span>
              </div>
              
              {stats?.overdueTasks && stats.overdueTasks > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-sm font-medium text-red-900">
                      Tareas Vencidas
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {stats.overdueTasks}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">
                    Clientes Activos
                  </span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {stats?.activeClients || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
  subtitle?: string
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  href: string
  icon: any
  title: string
  description: string
}

function QuickActionButton({ href, icon: Icon, title, description }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="bg-primary-100 p-2 rounded-lg">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </a>
  )
}
