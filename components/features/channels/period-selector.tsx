'use client';

import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '12M' },
    { value: 'all', label: 'All' },
  ];
  
  return (
    <div className={cn("inline-flex gap-1 p-1 bg-muted rounded-lg", className)}>
      {periods.map(period => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded transition-colors",
            value === period.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}