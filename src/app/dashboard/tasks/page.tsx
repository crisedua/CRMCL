'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { apiService } from '@/lib/api'
import { Task } from '@/types'
import { Plus, Search, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const loadTasks = async () => {
    try {
      const data = await apiService.getTasks()
      setTasks(data)
      setFilteredTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.opportunity?.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
  ]

  const priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ]

  // Calculate stats
  const now = new Date()
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false
    return new Date(t.due_date) < now
  }).length

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
            <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
            <p className="text-gray-600">
              Organiza y da seguimiento a tus actividades
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  placeholder="Buscar por título, descripción, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Estado"
            />
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              placeholder="Prioridad"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingTasks}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{inProgressTasks}</div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{overdueTasks}</div>
                <div className="text-sm text-gray-600">Vencidas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas por Prioridad</h3>
            <div className="grid grid-cols-3 gap-4">
              {['high', 'medium', 'low'].map((priority) => {
                const count = tasks.filter(t => t.priority === priority && t.status !== 'completed').length
                const label = priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'
                const color = priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                
                return (
                  <div key={priority} className="text-center p-3 border rounded-lg">
                    <div className={`text-2xl font-bold ${color}`}>{count}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tasks.length === 0 ? 'No hay tareas' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0 
                ? 'Comienza creando tu primera tarea para organizar tu trabajo.'
                : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
            {tasks.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Tarea
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={loadTasks}
              />
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Tarea"
          size="lg"
        >
          <TaskForm
            onSuccess={() => {
              setShowCreateModal(false)
              loadTasks()
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
