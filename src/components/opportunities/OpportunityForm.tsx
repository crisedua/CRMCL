'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { opportunitySchema, type OpportunityData } from '@/utils/validations'
import { apiService } from '@/lib/api'
import { Opportunity, Client } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface OpportunityFormProps {
  opportunity?: Opportunity
  onSuccess: () => void
  onCancel: () => void
}

export function OpportunityForm({ opportunity, onSuccess, onCancel }: OpportunityFormProps) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState('')

  const isEdit = !!opportunity

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: opportunity ? {
      client_id: opportunity.client_id,
      title: opportunity.title,
      description: opportunity.description || '',
      value: opportunity.value || undefined,
      stage: opportunity.stage,
      probability: opportunity.probability || undefined,
      expected_close_date: opportunity.expected_close_date || '',
    } : {
      stage: 'prospect',
    },
  })

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientData = await apiService.getClients()
        setClients(clientData)
      } catch (error) {
        console.error('Error loading clients:', error)
      }
    }
    loadClients()
  }, [])

  const onSubmit = async (data: OpportunityData) => {
    setLoading(true)
    setError('')

    try {
      const submitData = {
        ...data,
        value: data.value ? Number(data.value) : undefined,
        probability: data.probability ? Number(data.probability) : undefined,
        expected_close_date: data.expected_close_date || undefined,
      }

      if (isEdit && opportunity) {
        await apiService.updateOpportunity(opportunity.id, submitData)
      } else {
        await apiService.createOpportunity(submitData)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al guardar la oportunidad')
    } finally {
      setLoading(false)
    }
  }

  const stageOptions = [
    { value: 'prospect', label: 'Prospecto' },
    { value: 'qualified', label: 'Calificado' },
    { value: 'proposal', label: 'Propuesta' },
    { value: 'negotiation', label: 'Negociación' },
    { value: 'closed_won', label: 'Ganada' },
    { value: 'closed_lost', label: 'Perdida' },
  ]

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: `${client.name} ${client.company ? `(${client.company})` : ''}`,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Cliente *"
          {...register('client_id')}
          error={errors.client_id?.message}
          options={clientOptions}
          placeholder="Seleccionar cliente"
        />
        
        <Select
          label="Etapa *"
          {...register('stage')}
          error={errors.stage?.message}
          options={stageOptions}
        />
      </div>

      <Input
        label="Título *"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Nombre de la oportunidad"
      />

      <Textarea
        label="Descripción"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Detalles sobre la oportunidad..."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Valor ($)"
          type="number"
          step="0.01"
          {...register('value', { valueAsNumber: true })}
          error={errors.value?.message}
          placeholder="0.00"
        />
        
        <Input
          label="Probabilidad (%)"
          type="number"
          min="0"
          max="100"
          {...register('probability', { valueAsNumber: true })}
          error={errors.probability?.message}
          placeholder="50"
        />
        
        <Input
          label="Fecha estimada de cierre"
          type="date"
          {...register('expected_close_date')}
          error={errors.expected_close_date?.message}
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
          {isEdit ? 'Actualizar Oportunidad' : 'Crear Oportunidad'}
        </Button>
      </div>
    </form>
  )
}
