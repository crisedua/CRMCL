'use client'

import { useState } from 'react'
import { Opportunity } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { OpportunityForm } from './OpportunityForm'
import { apiService } from '@/lib/api'
import { 
  Target, 
  DollarSign, 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  TrendingUp,
  Building
} from 'lucide-react'

interface OpportunityCardProps {
  opportunity: Opportunity
  onUpdate: () => void
}

export function OpportunityCard({ opportunity, onUpdate }: OpportunityCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiService.deleteOpportunity(opportunity.id)
      onUpdate()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting opportunity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect':
        return 'bg-gray-100 text-gray-800'
      case 'qualified':
        return 'bg-blue-100 text-blue-800'
      case 'proposal':
        return 'bg-purple-100 text-purple-800'
      case 'negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'closed_won':
        return 'bg-green-100 text-green-800'
      case 'closed_lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'prospect':
        return 'Prospecto'
      case 'qualified':
        return 'Calificado'
      case 'proposal':
        return 'Propuesta'
      case 'negotiation':
        return 'Negociación'
      case 'closed_won':
        return 'Ganada'
      case 'closed_lost':
        return 'Perdida'
      default:
        return stage
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStageColor(opportunity.stage)}`}>
                {getStageLabel(opportunity.stage)}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Client Info */}
        {opportunity.client && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{opportunity.client.name}</span>
              {opportunity.client.company && (
                <>
                  <Building className="h-3 w-3 mx-2" />
                  <span>{opportunity.client.company}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Value and Probability */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {opportunity.value && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(opportunity.value)}
                </div>
                <div className="text-gray-500">Valor</div>
              </div>
            </div>
          )}
          
          {opportunity.probability !== null && (
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">
                  {opportunity.probability}%
                </div>
                <div className="text-gray-500">Probabilidad</div>
              </div>
            </div>
          )}
        </div>

        {/* Expected Close Date */}
        {opportunity.expected_close_date && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              Cierre estimado: {new Date(opportunity.expected_close_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Description */}
        {opportunity.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">{opportunity.description}</p>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>Creado: {new Date(opportunity.created_at).toLocaleDateString()}</span>
          <span>Actualizado: {new Date(opportunity.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Oportunidad"
        size="lg"
      >
        <OpportunityForm
          opportunity={opportunity}
          onSuccess={() => {
            setShowEditModal(false)
            onUpdate()
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Oportunidad"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres eliminar la oportunidad <strong>{opportunity.title}</strong>? 
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={loading}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
