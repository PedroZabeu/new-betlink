import { z } from "zod";

// CPF validation
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (parseInt(cpf.charAt(9)) !== digit) return false;
  
  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (parseInt(cpf.charAt(10)) !== digit) return false;
  
  return true;
}

// Luhn algorithm for credit card validation
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Detect card brand
export function detectCardBrand(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '');
  
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    diners: /^3(?:0[0-5]|[68])/,
    discover: /^6(?:011|5)/,
    jcb: /^(?:2131|1800|35\d{3})/,
    elo: /^(4011|4312|4389|4514|4576|5041|5066|5067|5090|6277|6362|6363|6504|6505|6506|6507|6509|6516|6550)/,
  };

  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) {
      return brand;
    }
  }

  return 'unknown';
}

// Schemas
export const billingSchema = z.object({
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .refine(validateCPF, 'CPF inválido'),
  address: z.object({
    zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    street: z.string().min(3, 'Rua muito curta'),
    number: z.string().min(1, 'Número obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro muito curto'),
    city: z.string().min(2, 'Cidade muito curta'),
    state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  }),
  saveForFuture: z.boolean(),
});

export const creditCardSchema = z.object({
  number: z.string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Formato inválido')
    .refine((val) => luhnCheck(val.replace(/\s/g, '')), 'Número de cartão inválido'),
  holder: z.string().min(3, 'Nome muito curto'),
  expiry: z.string()
    .regex(/^\d{2}\/\d{2}$/, 'Use MM/AA')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) return false;
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      
      return true;
    }, 'Cartão expirado'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
});