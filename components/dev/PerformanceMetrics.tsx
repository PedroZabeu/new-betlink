'use client'

import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PerformanceMetricsProps {
  responseTime: number
  className?: string
}

export function PerformanceMetrics({ responseTime, className }: PerformanceMetricsProps) {
  const isGood = responseTime < 100
  const isWarning = responseTime >= 100 && responseTime < 500
  
  return (
    <div
      data-testid="performance-metrics"
      className={cn(
        'p-4 rounded-lg border',
        isGood && 'bg-green-50 border-green-200',
        isWarning && 'bg-yellow-50 border-yellow-200',
        !isGood && !isWarning && 'bg-red-50 border-red-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Performance</p>
          <p 
            className={cn(
              'text-2xl font-bold mt-1',
              isGood && 'text-green-700',
              isWarning && 'text-yellow-700',
              !isGood && !isWarning && 'text-red-700'
            )}
            data-testid="response-time"
          >
            {responseTime.toFixed(0)}ms
          </p>
        </div>
        <Activity className={cn(
          'h-8 w-8',
          isGood && 'text-green-400',
          isWarning && 'text-yellow-400',
          !isGood && !isWarning && 'text-red-400'
        )} />
      </div>
    </div>
  )
}