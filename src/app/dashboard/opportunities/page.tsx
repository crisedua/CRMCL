'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { apiService } from '@/lib/api'
import { Opportunity } from '@/types'
import { Plus, Search, Target, DollarSign, TrendingUp } from 'lucide-react'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const loadOpportunities = async () => {
    try {
      const data = await apiService.getOpportunities()
      setOpportunities(data)
      setFilteredOpportunities(data)
    } catch (error) {
      console.error('Error loading opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOpportunities()
  }, [])

  useEffect(() => {
    let filtered = opportunities

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(opportunity =>
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.client?.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by stage
    if (stageFilter) {
      filtered = filtered.filter(opportunity => opportunity.stage === stageFilter)
    }

    setFilteredOpportunities(filtered)
  }, [opportunities, searchTerm, stageFilter])

  const stageOptions = [
    { value: '', label: 'Todas las etapas' },
    { value: 'prospect', label: 'Prospecto' },
    { value: 'qualified', label: 'Calificado' },
    { value: 'proposal', label: 'Propuesta' },
    { value: 'negotiation', label: 'Negociación' },
    { value: 'closed_won', label: 'Ganada' },
    { value: 'closed_lost', label: 'Perdida' },
  ]

  // Calculate stats
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0)
  const wonValue = opportunities
    .filter(opp => opp.stage === 'closed_won')
    .reduce((sum, opp) => sum + (opp.value || 0), 0)
  const conversionRate = opportunities.length > 0 
    ? Math.round((opportunities.filter(opp => opp.stage === 'closed_won').length / opportunities.length) * 100)
    : 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Oportunidades</h1>
            <p className="text-gray-600">
              Gestiona tu pipeline de ventas y oportunidades
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  placeholder="Buscar por título, cliente o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
            <Select
              options={stageOptions}
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              placeholder="Filtrar por etapa"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{opportunities.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${wonValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Ganadas</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                <div className="text-sm text-gray-600">Conversión</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stats by Stage */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline por Etapa</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {stageOptions.slice(1).map((stage) => {
              const count = opportunities.filter(opp => opp.stage === stage.value).length
              const value = opportunities
                .filter(opp => opp.stage === stage.value)
                .reduce((sum, opp) => sum + (opp.value || 0), 0)
              
              return (
                <div key={stage.value} className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-600 mb-1">{stage.label}</div>
                  <div className="text-xs font-medium text-green-600">
                    ${value.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {opportunities.length === 0 ? 'No hay oportunidades' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {opportunities.length === 0 
                ? 'Comienza creando tu primera oportunidad de venta.'
                : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
            {opportunities.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Oportunidad
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onUpdate={loadOpportunities}
              />
            ))}
          </div>
        )}

        {/* Create Opportunity Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Oportunidad"
          size="lg"
        >
          <OpportunityForm
            onSuccess={() => {
              setShowCreateModal(false)
              loadOpportunities()
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
