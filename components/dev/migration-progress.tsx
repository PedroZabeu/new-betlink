'use client';

import { cn } from '@/lib/utils';

interface MigrationProgressProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function MigrationProgress({ 
  percentage, 
  label, 
  showPercentage = true,
  className 
}: MigrationProgressProps) {
  const getColorClass = (percent: number) => {
    if (percent === 100) return 'bg-green-500';
    if (percent >= 80) return 'bg-yellow-500';
    if (percent >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            getColorClass(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}