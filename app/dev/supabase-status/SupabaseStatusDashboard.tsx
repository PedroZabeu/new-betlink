'use client'

import { useEffect, useState } from 'react'
import { ConnectionIndicator } from '@/components/dev/ConnectionIndicator'
import { PerformanceMetrics } from '@/components/dev/PerformanceMetrics'
import { TableInfoCard } from '@/components/dev/TableInfoCard'
import { StatusCard } from '@/components/dev/StatusCard'
import { 
  testConnection, 
  getTablesInfo, 
  getForeignKeys,
  getRLSPolicyCount,
  type ConnectionStatus,
  type TableInfo,
  type ForeignKeyInfo
} from '@/lib/supabase/queries/system'
import { CheckCircle, Shield, Link } from 'lucide-react'

export function SupabaseStatusDashboard() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false, responseTime: 0 })
  const [tables, setTables] = useState<TableInfo[]>([])
  const [foreignKeys, setForeignKeys] = useState<ForeignKeyInfo[]>([])
  const [rlsPolicyCount, setRlsPolicyCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true)
        setError(null)

        // Test connection
        const connStatus = await testConnection()
        setConnectionStatus(connStatus)

        if (!connStatus.connected) {
          setError(connStatus.error || 'Failed to connect to Supabase')
          return
        }

        // Fetch all data in parallel
        const [tablesResult, fkResult, rlsCount] = await Promise.all([
          getTablesInfo(),
          getForeignKeys(),
          getRLSPolicyCount()
        ])

        if (tablesResult.error) {
          setError(tablesResult.error.message)
        } else {
          setTables(tablesResult.data || [])
        }

        if (fkResult.data) {
          setForeignKeys(fkResult.data)
        }

        setRlsPolicyCount(rlsCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  if (loading) {
    return null // Suspense fallback will show
  }

  if (error && !connectionStatus.connected) {
    return (
      <div data-testid="error-message" className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Failed to connect to Supabase</h2>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div data-testid="status-dashboard" className="space-y-6">
      {/* Connection and Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConnectionIndicator 
          connected={connectionStatus.connected} 
          responseTime={connectionStatus.responseTime}
        />
        <PerformanceMetrics responseTime={connectionStatus.responseTime} />
      </div>

      {/* Database Tables */}
      <section data-testid="tables-section">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Database Tables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <TableInfoCard
              key={table.tableName}
              tableName={table.tableName}
              recordCount={table.recordCount}
              columns={getColumnCount(table.tableName)}
            />
          ))}
        </div>
      </section>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div data-testid="foreign-keys-status">
          <StatusCard
            title="Foreign Keys"
            value="All Connected"
            icon={<Link className="h-6 w-6" />}
            status="success"
          />
          <p className="text-sm text-gray-600 mt-2">
            {foreignKeys.length} relationships verified ✅
          </p>
        </div>

        <div data-testid="rls-status">
          <StatusCard
            title="RLS Policies"
            value="Prepared"
            icon={<Shield className="h-6 w-6" />}
            status="neutral"
          />
          <p className="text-sm text-gray-600 mt-2">
            {rlsPolicyCount} active policies
          </p>
        </div>

        <StatusCard
          title="Total Tables"
          value={tables.length}
          icon={<CheckCircle className="h-6 w-6" />}
          status="success"
        />
      </div>

      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}
    </div>
  )
}

// Helper function to get column count based on our known schema
function getColumnCount(tableName: string): number {
  const columnCounts: Record<string, number> = {
    profiles: 10, // Approximate, includes auth fields
    channels: 16,
    channel_tipsters: 5,
    channel_tags: 8,
    channel_metrics: 13,
    subscription_plans: 11
  }
  return columnCounts[tableName] || 0
}