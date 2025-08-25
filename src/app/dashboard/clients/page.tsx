'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ClientCard } from '@/components/clients/ClientCard'
import { ClientForm } from '@/components/clients/ClientForm'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { apiService } from '@/lib/api'
import { Client } from '@/types'
import { Plus, Search, Filter } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadClients = async () => {
    try {
      const data = await apiService.getClients()
      setClients(data)
      setFilteredClients(data)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    let filtered = clients

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    setFilteredClients(filtered)
  }, [clients, searchTerm, statusFilter])

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'prospect', label: 'Prospectos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ]

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
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">
              Gestiona tu cartera de clientes y prospectos
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  placeholder="Buscar por nombre, email o empresa..."
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
              placeholder="Filtrar por estado"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {clients.filter(c => c.status === 'prospect').length}
            </div>
            <div className="text-sm text-gray-600">Prospectos</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {clients.filter(c => c.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {clients.length === 0 ? 'No hay clientes' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {clients.length === 0 
                ? 'Comienza agregando tu primer cliente para gestionar tu cartera.'
                : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
            {clients.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Cliente
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onUpdate={loadClients}
              />
            ))}
          </div>
        )}

        {/* Create Client Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Cliente"
          size="lg"
        >
          <ClientForm
            onSuccess={() => {
              setShowCreateModal(false)
              loadClients()
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
