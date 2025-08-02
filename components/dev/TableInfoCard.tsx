'use client'

import { Database, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TableInfoCardProps {
  tableName: string
  recordCount: number
  columns?: number
  size?: string
  className?: string
}

export function TableInfoCard({ 
  tableName, 
  recordCount, 
  columns,
  size,
  className 
}: TableInfoCardProps) {
  return (
    <div
      data-testid={`table-card-${tableName}`}
      className={cn(
        'p-4 rounded-lg border bg-white hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <Database className="h-5 w-5 text-gray-400" />
        {columns && (
          <span className="text-xs text-gray-500">{columns} cols</span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1">{tableName}</h3>
      
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-700" data-testid="record-count">
          {recordCount}
        </p>
        <p className="text-sm text-gray-500">
          {recordCount === 1 ? 'record' : 'records'}
        </p>
      </div>
      
      {size && (
        <p className="text-xs text-gray-400 mt-2">Size: {size}</p>
      )}
    </div>
  )
}