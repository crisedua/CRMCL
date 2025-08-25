'use client'

import { useState } from 'react'
import { Client } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ClientForm } from './ClientForm'
import { apiService } from '@/lib/api'
import { 
  Mail, 
  Phone, 
  Building, 
  User, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye
} from 'lucide-react'

interface ClientCardProps {
  client: Client
  onUpdate: () => void
}

export function ClientCard({ client, onUpdate }: ClientCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiService.deleteClient(client.id)
      onUpdate()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting client:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'prospect':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      case 'prospect':
        return 'Prospecto'
      default:
        return status
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                {getStatusLabel(client.status)}
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

        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <a 
                href={`mailto:${client.email}`}
                className="hover:text-primary-600 transition-colors"
              >
                {client.email}
              </a>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <a 
                href={`tel:${client.phone}`}
                className="hover:text-primary-600 transition-colors"
              >
                {client.phone}
              </a>
            </div>
          )}
          
          {client.company && (
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>{client.company}</span>
              {client.position && <span className="ml-2 text-gray-400">• {client.position}</span>}
            </div>
          )}
        </div>

        {client.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-3">{client.notes}</p>
          </div>
        )}

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>Creado: {new Date(client.created_at).toLocaleDateString()}</span>
          <span>Actualizado: {new Date(client.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Cliente"
        size="lg"
      >
        <ClientForm
          client={client}
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
        title="Eliminar Cliente"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres eliminar a <strong>{client.name}</strong>? 
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
