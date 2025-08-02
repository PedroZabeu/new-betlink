'use client';

import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusBadgeProps {
  status: 'synced' | 'partial' | 'error' | 'syncing';
  percentage?: number;
  className?: string;
}

export function SyncStatusBadge({ status, percentage, className }: SyncStatusBadgeProps) {
  const statusConfig = {
    synced: {
      icon: CheckCircle2,
      text: 'Synced',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    partial: {
      icon: AlertCircle,
      text: percentage ? `${percentage}% Synced` : 'Partial',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    error: {
      icon: XCircle,
      text: 'Error',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    syncing: {
      icon: Loader2,
      text: 'Syncing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border',
        config.color,
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon 
        className={cn(
          'h-4 w-4',
          status === 'syncing' && 'animate-spin'
        )} 
      />
      <span>{config.text}</span>
    </div>
  );
}