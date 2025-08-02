'use client'

import { cn } from '@/lib/utils'

interface ConnectionIndicatorProps {
  connected: boolean
  responseTime?: number
  className?: string
}

export function ConnectionIndicator({ connected, responseTime, className }: ConnectionIndicatorProps) {
  return (
    <div
      data-testid="connection-status"
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border',
        connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'w-3 h-3 rounded-full',
            connected ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        {connected && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
        )}
      </div>
      
      <div className="flex-1">
        <p className={cn(
          'font-medium',
          connected ? 'text-green-900' : 'text-red-900'
        )}>
          {connected ? 'Connected' : 'Disconnected'}
        </p>
        {responseTime !== undefined && connected && (
          <p className="text-sm text-green-700" data-testid="response-time">
            Response time: {responseTime.toFixed(2)}ms
          </p>
        )}
      </div>
    </div>
  )
}