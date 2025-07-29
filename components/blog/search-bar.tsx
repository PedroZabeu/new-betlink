// Feature 2.9: Sistema de Busca no Blog - SearchBar Component
// @feature: Blog Search System
// @created: Feature 2.9

import { Search, X, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: SearchBar]';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  isSearching?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar posts...",
  resultCount,
  isSearching = false,
  className,
  disabled = false
}: SearchBarProps) {
  const handleClear = () => {
    onChange("");
    logger.info(`${FEATURE_NAME} Search cleared`);
  };
  
  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    if (newValue.trim()) {
      logger.debug(`${FEATURE_NAME} Search input changed`, { 
        query: newValue,
        length: newValue.length 
      });
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
            isSearching 
              ? "text-primary animate-pulse" 
              : "text-muted-foreground"
          )} 
        />
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10 transition-all",
            value.trim() && "ring-1 ring-primary/20"
          )}
          data-testid="search-input"
          aria-label="Buscar posts"
        />
        {value && !disabled && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/80"
            onClick={handleClear}
            aria-label="Limpar busca"
            data-testid="clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Search Results Summary */}
      {value.trim() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-3 w-3" />
          {isSearching ? (
            <span>Buscando...</span>
          ) : (
            <SearchResultsSummary 
              query={value} 
              resultCount={resultCount || 0} 
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Componente para mostrar o resumo dos resultados de busca
 */
interface SearchResultsSummaryProps {
  query: string;
  resultCount: number;
}

function SearchResultsSummary({ query, resultCount }: SearchResultsSummaryProps) {
  if (resultCount === 0) {
    return (
      <span className="text-amber-600 dark:text-amber-400">
        Nenhum post encontrado para "{query}"
      </span>
    );
  }
  
  if (resultCount === 1) {
    return (
      <span className="text-green-600 dark:text-green-400">
        1 post encontrado para "{query}"
      </span>
    );
  }
  
  return (
    <span className="text-green-600 dark:text-green-400">
      {resultCount} posts encontrados para "{query}"
    </span>
  );
}

/**
 * Versão compacta do SearchBar para uso em headers ou sidebars
 */
export function CompactSearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  className 
}: Omit<SearchBarProps, 'resultCount' | 'isSearching'>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-8 text-sm"
        data-testid="compact-search-input"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => onChange("")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}