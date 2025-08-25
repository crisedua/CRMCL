'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import { apiService } from '@/lib/api'
import { 
  Calendar, 
  User, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Edit, 
  Trash2,
  Play,
  Square
} from 'lucide-react'

interface TaskCardProps {
  task: Task
  onUpdate: () => void
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiService.deleteTask(task.id)
      onUpdate()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiService.updateTask(task.id, { status: newStatus as any })
      onUpdate()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'in_progress': return 'En Progreso'
      case 'completed': return 'Completada'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
        isOverdue ? 'border-l-4 border-l-red-500' : ''
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                task.status === 'completed' ? 'bg-green-100' : 
                task.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {task.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : task.status === 'in_progress' ? (
                  <Play className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>
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

        {/* Due Date */}
        {task.due_date && (
          <div className={`flex items-center text-sm mb-3 ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isOverdue ? (
              <AlertTriangle className="h-4 w-4 mr-2" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            <span>
              {isOverdue ? 'Vencida: ' : 'Vence: '}
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Client and Opportunity */}
        <div className="space-y-2 mb-4">
          {task.client && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{task.client.name}</span>
              {task.client.company && (
                <span className="ml-2 text-gray-400">• {task.client.company}</span>
              )}
            </div>
          )}
          
          {task.opportunity && (
            <div className="flex items-center text-sm text-gray-600">
              <Target className="h-4 w-4 mr-2" />
              <span>{task.opportunity.title}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>
          </div>
        )}

        {/* Quick Actions */}
        {task.status !== 'completed' && task.status !== 'cancelled' && (
          <div className="flex space-x-2 mb-4">
            {task.status === 'pending' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleStatusChange('in_progress')}
              >
                <Play className="h-3 w-3 mr-1" />
                Iniciar
              </Button>
            )}
            {task.status === 'in_progress' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Completar
              </Button>
            )}
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>Creado: {new Date(task.created_at).toLocaleDateString()}</span>
          <span>Actualizado: {new Date(task.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Tarea"
        size="lg"
      >
        <TaskForm
          task={task}
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
        title="Eliminar Tarea"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres eliminar la tarea <strong>{task.title}</strong>? 
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
