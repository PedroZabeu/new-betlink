// Feature 2.9: Sistema de Busca no Blog - useDebounce Hook
// @feature: Blog Search System
// @created: Feature 2.9

import { useEffect, useState } from "react";
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: useDebounce]';

/**
 * Hook para debounce de valores, útil para otimizar buscas em tempo real
 * 
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 300ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      
      logger.debug(`${FEATURE_NAME} Value debounced`, { 
        value, 
        delay 
      });
    }, delay);

    // Cleanup: cancelar timer anterior quando value ou delay mudarem
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook específico para debounce de busca com logging otimizado
 * 
 * @param searchQuery - Query de busca
 * @param delay - Delay em milissegundos (padrão: 300ms) 
 * @returns Query debounced
 */
export function useSearchDebounce(searchQuery: string, delay: number = 300): string {
  const debouncedQuery = useDebounce(searchQuery, delay);
  
  useEffect(() => {
    if (debouncedQuery.trim()) {
      logger.info(`${FEATURE_NAME} Search query debounced`, { 
        query: debouncedQuery,
        queryLength: debouncedQuery.length,
        delay
      });
    }
  }, [debouncedQuery, delay]);
  
  return debouncedQuery;
}