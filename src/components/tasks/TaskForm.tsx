'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskData } from '@/utils/validations'
import { apiService } from '@/lib/api'
import { Task, Client, Opportunity } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface TaskFormProps {
  task?: Task
  onSuccess: () => void
  onCancel: () => void
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [error, setError] = useState('')

  const isEdit = !!task

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      client_id: task.client_id || '',
      opportunity_id: task.opportunity_id || '',
      title: task.title,
      description: task.description || '',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      priority: task.priority,
      status: task.status,
    } : {
      priority: 'medium',
      status: 'pending',
    },
  })

  const selectedClientId = watch('client_id')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientData, opportunityData] = await Promise.all([
          apiService.getClients(),
          apiService.getOpportunities(),
        ])
        setClients(clientData)
        setOpportunities(opportunityData)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  const onSubmit = async (data: TaskData) => {
    setLoading(true)
    setError('')

    try {
      const submitData = {
        ...data,
        client_id: data.client_id || undefined,
        opportunity_id: data.opportunity_id || undefined,
        due_date: data.due_date ? `${data.due_date}T23:59:59` : undefined,
      }

      if (isEdit && task) {
        await apiService.updateTask(task.id, submitData)
      } else {
        await apiService.createTask(submitData)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al guardar la tarea')
    } finally {
      setLoading(false)
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
  ]

  const clientOptions = [
    { value: '', label: 'Sin cliente específico' },
    ...clients.map(client => ({
      value: client.id,
      label: `${client.name} ${client.company ? `(${client.company})` : ''}`,
    }))
  ]

  // Filter opportunities by selected client
  const filteredOpportunities = selectedClientId
    ? opportunities.filter(opp => opp.client_id === selectedClientId)
    : opportunities

  const opportunityOptions = [
    { value: '', label: 'Sin oportunidad específica' },
    ...filteredOpportunities.map(opp => ({
      value: opp.id,
      label: opp.title,
    }))
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título *"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Descripción breve de la tarea"
      />

      <Textarea
        label="Descripción"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Detalles adicionales sobre la tarea..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Cliente"
          {...register('client_id')}
          error={errors.client_id?.message}
          options={clientOptions}
        />
        
        <Select
          label="Oportunidad"
          {...register('opportunity_id')}
          error={errors.opportunity_id?.message}
          options={opportunityOptions}
          disabled={!selectedClientId}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Fecha de vencimiento"
          type="date"
          {...register('due_date')}
          error={errors.due_date?.message}
        />
        
        <Select
          label="Prioridad *"
          {...register('priority')}
          error={errors.priority?.message}
          options={priorityOptions}
        />
        
        <Select
          label="Estado *"
          {...register('status')}
          error={errors.status?.message}
          options={statusOptions}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {isEdit ? 'Actualizar Tarea' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  )
}
