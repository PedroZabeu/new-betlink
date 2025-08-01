"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mask: string;
  value: string;
  onChange: (value: string) => void;
}

export function MaskedInput({ mask, value, onChange, className, ...props }: MaskedInputProps) {
  const applyMask = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (mask === "(99) 99999-9999") {
      // Máscara de telefone brasileiro
      if (numbers.length === 0) return '';
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    
    if (mask === "999.999.999-99") {
      // Máscara de CPF
      if (numbers.length === 0) return '';
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      if (numbers.length <= 11) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
    
    if (mask === "99999-999") {
      // Máscara de CEP
      if (numbers.length === 0) return '';
      if (numbers.length <= 5) return numbers;
      if (numbers.length <= 8) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
    
    if (mask === "99/99") {
      // Máscara de validade de cartão
      if (numbers.length === 0) return '';
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    
    if (mask === "9999 9999 9999 9999") {
      // Máscara de cartão de crédito
      if (numbers.length === 0) return '';
      if (numbers.length <= 4) return numbers;
      if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
      if (numbers.length <= 12) return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8)}`;
      if (numbers.length <= 16) return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)} ${numbers.slice(12)}`;
      return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)} ${numbers.slice(12, 16)}`;
    }
    
    if (mask === "999" || mask === "9999") {
      // Máscara de CVV
      const maxLength = mask === "9999" ? 4 : 3;
      if (numbers.length === 0) return '';
      return numbers.slice(0, maxLength);
    }
    
    // Se não houver máscara específica, retorna o valor
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value);
    onChange(maskedValue);
  };

  return (
    <Input
      {...props}
      type="text"
      value={value}
      onChange={handleChange}
      className={cn(className)}
    />
  );
}