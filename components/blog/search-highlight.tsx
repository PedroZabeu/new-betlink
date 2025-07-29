// Feature 2.9: Sistema de Busca no Blog - Search Highlight Component
// @feature: Blog Search System
// @created: Feature 2.9

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: SearchHighlight]';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
  caseSensitive?: boolean;
  maxLength?: number;
}

/**
 * Componente para destacar termos de busca em um texto
 * 
 * @param text - Texto onde destacar os termos
 * @param query - Query de busca com os termos
 * @param className - Classes CSS para o container
 * @param highlightClassName - Classes CSS para os destaques
 * @param caseSensitive - Se a busca deve ser case sensitive
 * @param maxLength - Comprimento máximo do texto (trunca se maior)
 * @returns JSX com termos destacados
 */
export function HighlightText({ 
  text, 
  query, 
  className,
  highlightClassName = "bg-yellow-200 dark:bg-yellow-800/70 px-1 py-0.5 rounded-sm font-medium",
  caseSensitive = false,
  maxLength
}: HighlightTextProps): ReactNode {
  try {
    // Se query vazia, retorna texto normal
    if (!query.trim()) {
      const displayText = maxLength && text.length > maxLength 
        ? `${text.slice(0, maxLength)}...` 
        : text;
      return <span className={className}>{displayText}</span>;
    }

    // Preparar texto (truncar se necessário)
    let processedText = text;
    let wasTruncated = false;
    
    if (maxLength && text.length > maxLength) {
      processedText = text.slice(0, maxLength);
      wasTruncated = true;
    }

    // Extrair termos de busca e criar regex
    const terms = query
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => escapeRegExp(term));

    if (terms.length === 0) {
      return <span className={className}>{processedText}</span>;
    }

    // Criar regex para busca (case insensitive por padrão)
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${terms.join('|')})`, flags);

    // Dividir texto em partes (matched e unmatched)
    const parts = processedText.split(regex);

    logger.debug(`${FEATURE_NAME} Highlighting text`, {
      originalLength: text.length,
      processedLength: processedText.length,
      termsCount: terms.length,
      partsCount: parts.length,
      wasTruncated
    });

    return (
      <span className={className}>
        {parts.map((part, index) => {
          // Verificar se esta parte é um termo de busca
          const isMatch = regex.test(part);
          
          // Reset regex lastIndex para próxima verificação
          regex.lastIndex = 0;
          
          if (isMatch) {
            return (
              <mark 
                key={index} 
                className={highlightClassName}
                data-search-highlight="true"
              >
                {part}
              </mark>
            );
          }
          
          return part;
        })}
        {wasTruncated && (
          <span className="text-muted-foreground ml-1">...</span>
        )}
      </span>
    );
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error highlighting text`, error as Error, {
      textLength: text.length,
      query,
      maxLength
    });
    
    // Fallback: retorna texto sem highlight
    const displayText = maxLength && text.length > maxLength 
      ? `${text.slice(0, maxLength)}...` 
      : text;
    return <span className={className}>{displayText}</span>;
  }
}

/**
 * Escape caracteres especiais de regex
 * 
 * @param string - String para escape
 * @returns String com caracteres especiais escapados
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Componente para destacar termos em títulos
 */
export function HighlightTitle({ text, query, className }: HighlightTextProps) {
  return (
    <HighlightText
      text={text}
      query={query}
      className={cn("font-semibold", className)}
      highlightClassName="bg-primary/20 text-primary px-1 py-0.5 rounded-sm font-bold"
    />
  );
}

/**
 * Componente para destacar termos em excerpts
 */
export function HighlightExcerpt({ text, query, className }: HighlightTextProps) {
  return (
    <HighlightText
      text={text}
      query={query}
      className={cn("text-muted-foreground", className)}
      highlightClassName="bg-muted text-foreground px-1 py-0.5 rounded-sm font-medium"
      maxLength={200}
    />
  );
}

/**
 * Componente para destacar termos em conteúdo
 */
export function HighlightContent({ text, query, className }: HighlightTextProps) {
  return (
    <HighlightText
      text={text}
      query={query}
      className={className}
      highlightClassName="bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 rounded-sm"
      maxLength={300}
    />
  );
}

/**
 * Hook para contar o número de matches em um texto
 * 
 * @param text - Texto para contar matches
 * @param query - Query de busca
 * @param caseSensitive - Se deve ser case sensitive
 * @returns Número de matches encontrados
 */
export function useHighlightMatches(
  text: string, 
  query: string, 
  caseSensitive: boolean = false
): number {
  try {
    if (!query.trim() || !text.trim()) return 0;
    
    const terms = query
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => escapeRegExp(term));
      
    if (terms.length === 0) return 0;
    
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(terms.join('|'), flags);
    const matches = text.match(regex);
    
    return matches ? matches.length : 0;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error counting matches`, error as Error, {
      textLength: text.length,
      query
    });
    return 0;
  }
}