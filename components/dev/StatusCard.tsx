'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatusCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  status?: 'success' | 'warning' | 'error' | 'neutral'
  className?: string
}

const statusStyles = {
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  neutral: 'bg-gray-50 border-gray-200 text-gray-900'
}

export function StatusCard({ 
  title, 
  value, 
  icon, 
  status = 'neutral', 
  className 
}: StatusCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && (
          <div className="text-2xl opacity-50">{icon}</div>
        )}
      </div>
    </div>
  )
}