import { logger } from "@/lib/utils/logger";

const FEATURE_NAME = '[Feature 2.13: Mock Services]';

// Mock addresses database
const MOCK_ADDRESSES: Record<string, any> = {
  "01310-100": {
    street: "Avenida Paulista",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP"
  },
  "01310-200": {
    street: "Avenida Paulista",
    neighborhood: "Bela Vista", 
    city: "São Paulo",
    state: "SP"
  },
  "20040-020": {
    street: "Avenida Rio Branco",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ"
  },
  "30130-100": {
    street: "Avenida Afonso Pena",
    neighborhood: "Centro",
    city: "Belo Horizonte",
    state: "MG"
  },
  "80020-000": {
    street: "Rua XV de Novembro",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR"
  },
  "90010-001": {
    street: "Rua dos Andradas",
    neighborhood: "Centro Histórico",
    city: "Porto Alegre",
    state: "RS"
  }
};

// Utility delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock CEP lookup service
export async function fetchAddress(cep: string) {
  logger.info(`${FEATURE_NAME} Fetching address for CEP`, { cep });
  
  // Simulate API delay
  await delay(800);
  
  const cleanCep = cep.replace(/\D/g, '');
  const formattedCep = `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  
  // Check mock database first
  if (MOCK_ADDRESSES[formattedCep]) {
    return {
      success: true,
      data: MOCK_ADDRESSES[formattedCep]
    };
  }
  
  // For any other CEP, return generic data based on first digits
  const stateCode = cleanCep.slice(0, 2);
  const states: Record<string, { city: string; state: string }> = {
    "01": { city: "São Paulo", state: "SP" },
    "20": { city: "Rio de Janeiro", state: "RJ" },
    "30": { city: "Belo Horizonte", state: "MG" },
    "40": { city: "Salvador", state: "BA" },
    "50": { city: "Recife", state: "PE" },
    "60": { city: "Fortaleza", state: "CE" },
    "70": { city: "Brasília", state: "DF" },
    "80": { city: "Curitiba", state: "PR" },
    "90": { city: "Porto Alegre", state: "RS" }
  };
  
  const stateData = states[stateCode] || { city: "São Paulo", state: "SP" };
  
  return {
    success: true,
    data: {
      street: "Rua Principal",
      neighborhood: "Centro",
      city: stateData.city,
      state: stateData.state
    }
  };
}

// Mock card validation
export async function validateCard(number: string) {
  await delay(300);
  
  const cleanNumber = number.replace(/\D/g, '');
  const firstDigit = cleanNumber[0];
  
  const brands: Record<string, string> = {
    '4': 'visa',
    '5': 'mastercard',
    '3': 'amex',
    '6': 'elo'
  };
  
  return {
    brand: brands[firstDigit] || 'unknown',
    isValid: cleanNumber.length === 16 || (firstDigit === '3' && cleanNumber.length === 15)
  };
}

// Mock payment processing
export async function processPayment(data: any) {
  logger.info(`${FEATURE_NAME} Processing payment`, {
    method: data.method,
    amount: data.amount
  });
  
  // Step 1: Processing
  await delay(1000);
  
  // Step 2: Validating
  await delay(1500);
  
  // Step 3: Confirming
  await delay(1000);
  
  // Random success (95% success rate for demo)
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      transactionId: `TRX-${Date.now()}`,
      message: "Pagamento processado com sucesso"
    };
  } else {
    return {
      success: false,
      error: "Pagamento recusado pelo banco emissor",
      code: "PAYMENT_DECLINED"
    };
  }
}

// Generate QR Code data for PIX
export function generatePixQRCode(data: {
  amount: number;
  merchantName: string;
  description: string;
}) {
  // This would be a real PIX payload in production
  const payload = {
    version: "01",
    merchantName: data.merchantName,
    merchantCity: "São Paulo",
    amount: data.amount,
    currency: "BRL",
    countryCode: "BR",
    description: data.description,
    txid: `PIX${Date.now()}`
  };
  
  // In production, this would generate a real QR code
  // For mock, we'll return a data URL of a placeholder
  return {
    qrCodeData: JSON.stringify(payload),
    qrCodeUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPgogICAgPHRzcGFuIHg9IjEwMCIgZHk9Ii0xMCI+UVIgQ29kZTwvdHNwYW4+CiAgICA8dHNwYW4geD0iMTAwIiBkeT0iMjAiPihQbGFjZWhvbGRlcik8L3RzcGFuPgogIDwvdGV4dD4KPC9zdmc+",
    pixKey: "00020126360014BR.GOV.BCB.PIX0114+5511987654321",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
}

// Generate Boleto data
export function generateBoletoData(data: {
  amount: number;
  payerName: string;
  payerCpf: string;
}) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // 3 days from now
  
  return {
    barcodeNumber: `23793.38128 60073.371343 87000.063309 8 ${Date.now().toString().slice(-10)}`,
    digitableLine: `23793381286007337134387000063309${Date.now().toString().slice(-14)}`,
    dueDate: dueDate.toISOString(),
    amount: data.amount,
    payerName: data.payerName,
    payerCpf: data.payerCpf,
    bankSlipUrl: "#" // In production, this would be a real PDF URL
  };
}

// Save lead data
export function captureLeadData(data: any) {
  const existingLeads = localStorage.getItem('captured_leads');
  const leads = existingLeads ? JSON.parse(existingLeads) : [];
  
  const leadData = {
    id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    capturedAt: new Date().toISOString()
  };
  
  leads.push(leadData);
  localStorage.setItem('captured_leads', JSON.stringify(leads));
  
  logger.info(`${FEATURE_NAME} Lead captured`, {
    leadId: leadData.id,
    channelName: data.channelName
  });
  
  return leadData;
}