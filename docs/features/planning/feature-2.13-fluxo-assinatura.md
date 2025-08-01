# Feature 2.13: Fluxo de Assinatura (Pré-Pagamento)

## 📋 Descrição
Implementar fluxo completo de checkout simulado para assinatura de canais, desde a seleção do plano até a captura de leads, preparando terreno para integração futura com sistema de pagamento real.

## 🎯 Objetivos
- Criar fluxo de checkout multi-step adaptativo e inteligente
- Capturar leads qualificados com dados completos para conversão
- Simular experiência completa de pagamento (Stripe-like)
- Integrar com CTAs das Features 2.11 e 2.12
- Implementar persistência de dados e recuperação de abandono
- Preparar estrutura para futura integração com gateway de pagamento

## 🧪 Teste Humano

### Cenário 1: Entrada via Card (usuário novo)
1. Clicar "Assinar Canal" em qualquer card
2. Verificar redirecionamento para checkout
3. Completar fluxo de 4 steps:
   - Login/Cadastro (se não logado)
   - Seleção de plano
   - Dados de faturamento
   - Método de pagamento
   - Confirmação
4. Verificar mensagem de sucesso
5. Confirmar dados salvos no localStorage

### Cenário 2: Entrada via Página de Detalhes (usuário logado)
1. Na página do canal, selecionar um plano específico
2. Clicar no CTA do plano escolhido
3. Verificar que plano vem pré-selecionado
4. Completar fluxo reduzido (3 steps)
5. Testar mudança de plano durante checkout

### Cenário 3: Recuperação de Abandono
1. Iniciar checkout e preencher parcialmente
2. Fechar/sair do fluxo
3. Voltar ao checkout do mesmo canal
4. Verificar dados recuperados
5. Completar de onde parou

### Validações Específicas
- [ ] Validação em tempo real de todos os campos
- [ ] Máscara brasileira para WhatsApp e CPF
- [ ] Busca de CEP funcionando (mock)
- [ ] Validação de cartão com detecção de bandeira
- [ ] Checkbox "Salvar dados" funcionando
- [ ] Progress bar mostra avanço correto
- [ ] Animações suaves entre steps
- [ ] Mobile: steps em fullscreen
- [ ] Desktop: sidebar com resumo
- [ ] Botões de voltar/avançar funcionais
- [ ] Loading states durante "processamento"

## 🔧 Implementação Técnica

### Arquitetura do Fluxo

```typescript
// Estrutura principal do checkout
interface CheckoutFlow {
  // Contexto inicial
  entry: {
    source: 'channel-card' | 'channel-detail';
    channelId: string;
    preSelectedPlan?: string;
    timestamp: string;
  };
  
  // Estado do fluxo
  state: {
    currentStep: number;
    completedSteps: number[];
    canGoBack: boolean;
    canGoForward: boolean;
  };
  
  // Dados coletados
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
    subscription: {
      channelId: string;
      planId: string;
      price: number;
      period: 'monthly' | 'quarterly' | 'yearly';
    };
    contact: {
      whatsapp: string;
      telegram: string;
    };
    billing: {
      cpf: string;
      address: BillingAddress;
      saveForFuture: boolean;
    };
    payment: {
      method: 'credit_card' | 'pix' | 'boleto';
      cardData?: CardData;
      saveCard?: boolean;
    };
  };
}
```

### Estrutura de Componentes

```
/app/checkout/
  └── [channelId]/
      └── page.tsx (Route handler)

/components/checkout/
  ├── checkout-flow.tsx (Main orchestrator)
  ├── checkout-header.tsx (Channel info + progress)
  ├── checkout-sidebar.tsx (Summary - desktop only)
  ├── steps/
  │   ├── auth-step.tsx
  │   ├── plan-selection-step.tsx
  │   ├── contact-info-step.tsx
  │   ├── billing-info-step.tsx
  │   ├── payment-method-step.tsx
  │   └── confirmation-step.tsx
  ├── ui/
  │   ├── step-navigation.tsx
  │   ├── progress-indicator.tsx
  │   └── trust-badges.tsx
  └── utils/
      ├── validation.ts
      ├── masks.ts
      └── mock-services.ts
```

### Serviços Mock

```typescript
// mock-services.ts
export const mockServices = {
  // Busca CEP
  fetchAddress: async (cep: string) => {
    await delay(800); // Simular latência
    return MOCK_ADDRESSES[cep] || null;
  },
  
  // Validação de cartão
  validateCard: (number: string) => {
    const brand = detectCardBrand(number);
    const isValid = luhnCheck(number);
    return { brand, isValid };
  },
  
  // Processamento de pagamento
  processPayment: async (data: PaymentData) => {
    await delay(1000); // Processing
    await delay(1500); // Validating
    await delay(1000); // Confirming
    return { success: true, orderId: generateOrderId() };
  },
  
  // Salvar lead
  captureLeadData: (data: CheckoutData) => {
    localStorage.setItem('captured_leads', JSON.stringify([
      ...getStoredLeads(),
      { ...data, capturedAt: new Date().toISOString() }
    ]));
  }
};
```

### Estados e Transições

```typescript
// Máquina de estados do checkout
const checkoutMachine = {
  initial: 'detecting_auth',
  states: {
    detecting_auth: {
      on: {
        AUTHENTICATED: 'plan_selection',
        UNAUTHENTICATED: 'auth_required'
      }
    },
    auth_required: {
      on: {
        LOGIN_SUCCESS: 'plan_selection',
        SIGNUP_SUCCESS: 'plan_selection'
      }
    },
    plan_selection: {
      on: {
        PLAN_SELECTED: 'contact_info',
        BACK: 'channel_page'
      }
    },
    contact_info: {
      on: {
        CONTACT_FILLED: 'billing_info',
        BACK: 'plan_selection'
      }
    },
    billing_info: {
      on: {
        BILLING_FILLED: 'payment_method',
        BACK: 'contact_info'
      }
    },
    payment_method: {
      on: {
        PAYMENT_SELECTED: 'confirmation',
        BACK: 'billing_info'
      }
    },
    confirmation: {
      on: {
        CONFIRM: 'processing',
        BACK: 'payment_method'
      }
    },
    processing: {
      on: {
        SUCCESS: 'completed',
        ERROR: 'payment_method'
      }
    },
    completed: {
      type: 'final'
    }
  }
};
```

### Validações e Máscaras

```typescript
// Schemas de validação com Zod
const schemas = {
  contact: z.object({
    whatsapp: z.string()
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido'),
    telegram: z.string()
      .min(5, 'Username muito curto')
      .regex(/^@/, 'Deve começar com @')
  }),
  
  billing: z.object({
    cpf: z.string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    address: z.object({
      zipCode: z.string().regex(/^\d{5}-\d{3}$/),
      street: z.string().min(3),
      number: z.string().min(1),
      complement: z.string().optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.string().length(2)
    })
  }),
  
  creditCard: z.object({
    number: z.string().regex(/^\d{16}$/, 'Número inválido'),
    holder: z.string().min(3, 'Nome muito curto'),
    expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Use MM/AA'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido')
  })
};
```

## 🎨 Requisitos de Design

### Visual e UX
- Progress bar sticky no topo
- Animações com Framer Motion entre steps
- Loading skeleton durante validações
- Feedback visual instantâneo em erros
- Trust badges sempre visíveis
- Mobile: Steps fullscreen com gestos
- Desktop: Sidebar fixa com resumo

### Componentes de UI
- Usar shadcn/ui Forms avançados
- Radio groups para seleção de plano
- Tabs para métodos de pagamento
- Checkboxes para salvar dados
- Toasts para feedback
- Dialogs para confirmações

### Estados Visuais
```tsx
// Loading states por ação
const loadingStates = {
  validatingCep: "Buscando endereço...",
  validatingCard: "Verificando cartão...",
  processing: "Processando pagamento...",
  saving: "Salvando seus dados..."
};

// Animações entre steps
const stepTransition = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.3 }
};
```

## 🚫 Guardrails
- Não implementar pagamento real (apenas simulação)
- Não salvar dados sensíveis em produção
- Manter compatibilidade com Features 2.11 e 2.12
- Preservar performance < 3s no fluxo completo
- Não modificar estrutura de channels existente

## 📦 Dependências
- Features 2.11 e 2.12 implementadas
- Sistema de auth funcionando
- shadcn/ui Form components
- Framer Motion para animações
- Zod para validações
- React Hook Form

## ⏱️ Estimativas
- Complexidade: Alta
- Tempo estimado: 4-5 horas
- Componentes novos: 10+
- Integrações: 3 (auth, localStorage, mock services)

## 📝 Notas Adicionais

### Analytics Events
```typescript
// Eventos para tracking futuro
trackEvent('checkout_started', { channel, plan, source });
trackEvent('step_completed', { step, timeSpent });
trackEvent('field_error', { field, errorType });
trackEvent('checkout_abandoned', { lastStep, timeSpent });
trackEvent('checkout_completed', { plan, total, method });
```

### Dados para Captura
- Email e nome (do auth)
- WhatsApp e Telegram (obrigatórios)
- CPF e endereço (opcionais)
- Preferências de pagamento
- Aceitação de termos
- Timestamp e fonte

### Preparação para Produção
- Estrutura pronta para Stripe
- Campos compatíveis com gateway
- Webhook endpoints definidos
- Error handling robusto
- Recovery de sessão