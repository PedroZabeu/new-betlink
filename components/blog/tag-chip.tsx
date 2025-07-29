// Feature 2.7: Sistema de Tags e Categorias - Tag Chip Component
// @feature: Blog Tags and Categories
// @created: Feature 2.7

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';

interface TagChipProps {
  tag: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function TagChip({ 
  tag, 
  count, 
  isActive, 
  onClick 
}: TagChipProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(
        'cursor-pointer transition-all duration-200 text-xs',
        'hover:scale-105 hover:shadow-sm',
        isActive 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'bg-muted hover:bg-muted/80',
        count === 0 && 'opacity-50 cursor-not-allowed'
      )}
      onClick={count > 0 ? onClick : undefined}
      data-testid={`tag-chip-${tag}`}
      data-active={isActive}
    >
      <Hash className="h-2.5 w-2.5 mr-1" />
      {tag}
      {count > 0 && (
        <span className="ml-1 opacity-75">
          {count}
        </span>
      )}
    </Badge>
  );
}