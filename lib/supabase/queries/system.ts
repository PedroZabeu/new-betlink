import { createClient } from '@/lib/supabase/client'

export interface TableInfo {
  tableName: string
  recordCount: number
  sizeInBytes?: number
  columns?: number
}

export interface ConnectionStatus {
  connected: boolean
  responseTime: number
  error?: string
}

export interface ForeignKeyInfo {
  tableName: string
  columnName: string
  foreignTableName: string
  foreignColumnName: string
}

// Test connection and measure response time
export async function testConnection(): Promise<ConnectionStatus> {
  const start = performance.now()
  
  try {
    const supabase = createClient()
    
    // Simple query to test connection
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    const responseTime = performance.now() - start
    
    if (error) {
      return {
        connected: false,
        responseTime,
        error: error.message
      }
    }
    
    return {
      connected: true,
      responseTime
    }
  } catch (error) {
    const responseTime = performance.now() - start
    return {
      connected: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get information about all tables
export async function getTablesInfo(): Promise<{ data: TableInfo[] | null; error: Error | null }> {
  try {
    const supabase = createClient()
    
    // Get basic table info
    const tables = [
      'profiles',
      'channels',
      'channel_tipsters',
      'channel_tags',
      'channel_metrics',
      'subscription_plans'
    ]
    
    const tableInfo: TableInfo[] = []
    
    for (const tableName of tables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (!error) {
          tableInfo.push({
            tableName,
            recordCount: count || 0
          })
        }
      } catch {
        // Table might not exist, skip it
        tableInfo.push({
          tableName,
          recordCount: 0
        })
      }
    }
    
    return { data: tableInfo, error: null }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to get tables info') 
    }
  }
}

// Get foreign key relationships
export async function getForeignKeys(): Promise<{ data: ForeignKeyInfo[] | null; error: Error | null }> {
  try {
    const supabase = createClient()
    
    // For now, return hardcoded FK info since we know the structure
    // In production, this could query information_schema
    const foreignKeys: ForeignKeyInfo[] = [
      {
        tableName: 'channel_tipsters',
        columnName: 'channel_id',
        foreignTableName: 'channels',
        foreignColumnName: 'id'
      },
      {
        tableName: 'channel_tipsters',
        columnName: 'user_id',
        foreignTableName: 'profiles',
        foreignColumnName: 'id'
      },
      {
        tableName: 'channel_tags',
        columnName: 'channel_id',
        foreignTableName: 'channels',
        foreignColumnName: 'id'
      },
      {
        tableName: 'channel_metrics',
        columnName: 'channel_id',
        foreignTableName: 'channels',
        foreignColumnName: 'id'
      },
      {
        tableName: 'subscription_plans',
        columnName: 'channel_id',
        foreignTableName: 'channels',
        foreignColumnName: 'id'
      }
    ]
    
    return { data: foreignKeys, error: null }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to get foreign keys') 
    }
  }
}

// Get RLS policy count (for future use)
export async function getRLSPolicyCount(): Promise<number> {
  // For now, return 0 as RLS is not yet implemented
  // In future, this will query pg_policies
  return 0
}