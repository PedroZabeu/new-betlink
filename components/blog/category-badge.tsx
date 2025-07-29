// Feature 2.7: Sistema de Tags e Categorias - Category Badge Component
// @feature: Blog Tags and Categories
// @created: Feature 2.7

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  label: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  count: number;
  isActive: boolean;
  onClick: () => void;
}

// Color mappings for Tailwind classes
const colorMap = {
  blue: {
    active: 'bg-blue-600 text-white hover:bg-blue-700',
    inactive: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  green: {
    active: 'bg-green-600 text-white hover:bg-green-700',
    inactive: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  yellow: {
    active: 'bg-yellow-600 text-white hover:bg-yellow-700',
    inactive: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  purple: {
    active: 'bg-purple-600 text-white hover:bg-purple-700',
    inactive: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
  }
};

export function CategoryBadge({ 
  label, 
  color, 
  count, 
  isActive, 
  onClick 
}: CategoryBadgeProps) {
  const colorClasses = colorMap[color];
  const badgeClasses = isActive ? colorClasses.active : colorClasses.inactive;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'cursor-pointer transition-colors border-0 font-medium',
        badgeClasses,
        count === 0 && 'opacity-50 cursor-not-allowed'
      )}
      onClick={count > 0 ? onClick : undefined}
      data-testid={`category-badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
      data-active={isActive}
    >
      {label}
      {count > 0 && (
        <span className="ml-1 text-xs">
          ({count})
        </span>
      )}
    </Badge>
  );
}