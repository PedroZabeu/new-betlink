# Padrões de Logging e Código - BetLink

## 🎯 Princípios de Logging

### 1. Structured Logging
Usar formato consistente para facilitar auditoria:

```typescript
// utils/logger.ts
export const logger = {
  info: (action: string, context: Record<string, any>) => {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      action,
      ...context
    });
  },
  
  error: (action: string, error: Error, context: Record<string, any>) => {
    console.error({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      action,
      error: error.message,
      stack: error.stack,
      ...context
    });
  },
  
  audit: (userId: string, action: string, resource: string, details: Record<string, any>) => {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'AUDIT',
      userId,
      action,
      resource,
      ...details
    });
  }
};
```

### 2. Pontos de Logging Obrigatórios

#### Autenticação
```typescript
// Login attempt
logger.info('auth.login.attempt', { email, ip: request.ip });

// Login success
logger.audit(user.id, 'auth.login.success', 'session', { 
  role: user.role,
  ip: request.ip 
});

// Login failure
logger.error('auth.login.failed', error, { email, ip: request.ip });
```

#### Autorização
```typescript
// Access denied
logger.audit(userId, 'access.denied', pathname, {
  userRole,
  requiredRole,
  ip: request.ip
});

// Access granted
logger.info('access.granted', {
  userId,
  userRole,
  resource: pathname
});
```

#### Operações CRUD
```typescript
// Create
logger.audit(userId, 'create', resourceType, {
  resourceId: newId,
  data: sanitizedData
});

// Update
logger.audit(userId, 'update', resourceType, {
  resourceId,
  changes: diff(oldData, newData)
});

// Delete
logger.audit(userId, 'delete', resourceType, {
  resourceId,
  reason
});
```

#### Pagamentos
```typescript
// Payment initiated
logger.audit(userId, 'payment.initiated', 'subscription', {
  amount,
  method,
  channelId
});

// Payment completed
logger.audit(userId, 'payment.completed', 'subscription', {
  transactionId,
  amount,
  channelId
});

// Payment failed
logger.error('payment.failed', error, {
  userId,
  amount,
  reason: error.message
});
```

## 📐 Padrões de Código

### 1. Estrutura de Arquivos

```
/app
  /(public)           # Rotas públicas
    /page.tsx
    /channels/
  /(auth)            # Rotas de autenticação
    /login/
    /signup/
  /(protected)       # Rotas protegidas
    /(master)/
    /(admin)/
    /(tipster)/
    /(client)/
/components
  /ui/               # Componentes shadcn
  /features/         # Componentes por feature
    /auth/
    /channels/
    /payments/
/lib
  /auth/             # Helpers de autenticação
  /db/               # Queries e types do Supabase
  /utils/            # Utilidades gerais
/hooks               # Custom React hooks
/types               # TypeScript types globais
```

### 2. Convenções de Nomenclatura

#### Componentes
```typescript
// PascalCase para componentes
export function ChannelCard() { }
export function UserProfile() { }

// Sufixo para tipos específicos
export function ChannelCardSkeleton() { } // Loading state
export function ChannelCardError() { }    // Error state
```

#### Funções e Variáveis
```typescript
// camelCase para funções
export async function getUserRole(userId: string) { }
export function calculateROI(bets: Bet[]) { }

// UPPER_SNAKE_CASE para constantes
export const MAX_CHANNELS_PER_TIPSTER = 5;
export const COMMISSION_RATE = 0.15;
```

#### Types e Interfaces
```typescript
// PascalCase com prefixo quando necessário
export interface User { }
export type UserRole = 'master' | 'admin' | 'tipster' | 'client';
export interface IChannelService { } // Interface para serviço
export type TChannelStatus = 'active' | 'pending' | 'suspended';
```

### 3. Error Handling

```typescript
// Sempre usar error boundaries para componentes
export function ChannelList() {
  try {
    // component logic
  } catch (error) {
    logger.error('channel.list.render', error as Error, {
      component: 'ChannelList'
    });
    return <ChannelListError error={error} />;
  }
}

// Para operações async
export async function createChannel(data: ChannelData) {
  try {
    logger.info('channel.create.start', { tipsterId: data.tipsterId });
    
    const result = await supabase
      .from('channels')
      .insert(data)
      .select()
      .single();
    
    if (result.error) throw result.error;
    
    logger.audit(data.tipsterId, 'channel.created', 'channel', {
      channelId: result.data.id
    });
    
    return { success: true, data: result.data };
  } catch (error) {
    logger.error('channel.create.failed', error as Error, {
      tipsterId: data.tipsterId
    });
    return { success: false, error: error.message };
  }
}
```

### 4. Componentes Padrão

#### Layout com Loading/Error States
```typescript
export async function ChannelPage({ params }: { params: { id: string } }) {
  const { data: channel, error } = await getChannel(params.id);
  
  if (error) {
    logger.error('channel.page.load', error, { channelId: params.id });
    return <ChannelError error={error} />;
  }
  
  if (!channel) {
    return <ChannelNotFound id={params.id} />;
  }
  
  logger.info('channel.page.view', { 
    channelId: channel.id,
    userId: getCurrentUserId() 
  });
  
  return <ChannelDetails channel={channel} />;
}
```

#### Forms com Validação
```typescript
export function ChannelForm({ onSubmit }: ChannelFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    logger.info('channel.form.submit', { formId: 'channel-create' });
    
    // Validate
    const validationErrors = validateChannelData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      logger.info('channel.form.validation.failed', { errors: validationErrors });
      return;
    }
    
    // Submit
    const result = await onSubmit(formData);
    
    if (!result.success) {
      logger.error('channel.form.submit.failed', result.error, { formData });
      setErrors({ submit: result.error.message });
    }
  };
}
```

### 5. Supabase Queries

```typescript
// Sempre tipar as queries
export async function getChannelsByTipster(tipsterId: string) {
  logger.info('db.query.channels.byTipster', { tipsterId });
  
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      tipster:profiles!tipster_id(
        id,
        name,
        email
      ),
      metrics:channel_metrics(
        total_subscribers,
        monthly_roi,
        success_rate
      )
    `)
    .eq('tipster_id', tipsterId)
    .order('created_at', { ascending: false });
  
  if (error) {
    logger.error('db.query.channels.failed', error, { tipsterId });
    throw error;
  }
  
  return data;
}
```

## 🔍 Auditoria e Debugging

### Debug Helpers
```typescript
// utils/debug.ts
export const debug = {
  table: (data: any[], title?: string) => {
    if (process.env.NODE_ENV === 'development') {
      if (title) console.log(`\n=== ${title} ===`);
      console.table(data);
    }
  },
  
  json: (data: any, title?: string) => {
    if (process.env.NODE_ENV === 'development') {
      if (title) console.log(`\n=== ${title} ===`);
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  time: async (label: string, fn: () => Promise<any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
      const result = await fn();
      console.timeEnd(label);
      return result;
    }
    return fn();
  }
};
```

### Performance Monitoring
```typescript
// Middleware para monitorar rotas
export async function middleware(request: NextRequest) {
  const start = Date.now();
  const pathname = request.nextUrl.pathname;
  
  logger.info('request.start', {
    pathname,
    method: request.method,
    ip: request.ip
  });
  
  const response = await updateSession(request);
  
  logger.info('request.complete', {
    pathname,
    duration: Date.now() - start,
    status: response.status
  });
  
  return response;
}
```

## 📋 Checklist de Qualidade

Antes de cada commit, verificar:

- [ ] Todos os pontos de entrada tem logging apropriado
- [ ] Erros são capturados e logados com contexto
- [ ] Operações sensíveis tem audit logging
- [ ] Não há console.log() em produção (usar logger)
- [ ] Types estão definidos (sem `any`)
- [ ] Loading e error states implementados
- [ ] Formulários tem validação apropriada
- [ ] Queries Supabase são tipadas
- [ ] Sem dados sensíveis nos logs (senhas, tokens)