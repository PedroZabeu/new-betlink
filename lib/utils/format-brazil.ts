/**
 * Utilitários para formatação no padrão brasileiro
 */

/**
 * Formata número para o padrão brasileiro
 * @param value - Número a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @param forceDecimals - Se true, sempre mostra as casas decimais
 */
export function formatBrazilianNumber(
  value: number | null | undefined,
  decimals: number = 2,
  forceDecimals: boolean = true
): string {
  if (value === null || value === undefined) return '0,00';
  
  // Para números inteiros (como contagens), não usar decimais
  const isInteger = Number.isInteger(value);
  const decimalPlaces = isInteger && !forceDecimals ? 0 : decimals;
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}

/**
 * Formata porcentagem no padrão brasileiro
 * @param value - Valor da porcentagem
 * @param includeSign - Se true, inclui o sinal + para valores positivos
 */
export function formatBrazilianPercentage(
  value: number | null | undefined,
  includeSign: boolean = true
): string {
  if (value === null || value === undefined) return '0,00%';
  
  const formatted = formatBrazilianNumber(value, 2, true);
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${formatted}%`;
}

/**
 * Formata valor monetário em Reais
 * @param value - Valor em reais
 */
export function formatBrazilianCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Formata unidades de aposta
 * @param value - Número de unidades
 */
export function formatBrazilianUnits(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0u';
  
  // Para unidades, usar no máximo 1 casa decimal
  const formatted = formatBrazilianNumber(Math.abs(value), 1, false);
  const sign = value < 0 ? '-' : (value > 0 ? '+' : '');
  return `${sign}${formatted}u`;
}

/**
 * Formata odds no padrão brasileiro
 * @param value - Valor das odds
 */
export function formatBrazilianOdds(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0,00';
  
  return formatBrazilianNumber(value, 2, true);
}

/**
 * Formata contagem (números inteiros)
 * @param value - Número inteiro
 */
export function formatBrazilianCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}