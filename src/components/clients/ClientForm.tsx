'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema, type ClientData } from '@/utils/validations'
import { apiService } from '@/lib/api'
import { Client } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface ClientFormProps {
  client?: Client
  onSuccess: () => void
  onCancel: () => void
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!client

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      position: client.position || '',
      notes: client.notes || '',
      status: client.status,
    } : {
      status: 'prospect',
    },
  })

  const onSubmit = async (data: ClientData) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit && client) {
        await apiService.updateClient(client.id, data)
      } else {
        await apiService.createClient(data)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el cliente')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'prospect', label: 'Prospecto' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Nombre completo del cliente"
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="email@ejemplo.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Teléfono"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+1 234 567 8900"
        />
        
        <Select
          label="Estado *"
          {...register('status')}
          error={errors.status?.message}
          options={statusOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Empresa"
          {...register('company')}
          error={errors.company?.message}
          placeholder="Nombre de la empresa"
        />
        
        <Input
          label="Cargo"
          {...register('position')}
          error={errors.position?.message}
          placeholder="Director, Gerente, etc."
        />
      </div>

      <Textarea
        label="Notas"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="Información adicional sobre el cliente..."
      />

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
          {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  )
}
