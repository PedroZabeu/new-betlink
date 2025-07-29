# Feature 1.5: Admin Area Unificada + Access Control

## Overview
**Objetivo**: Implementar área administrativa unificada com controle granular para master
**Duração Estimada**: 1.5-2 horas (redução de 33%)
**Prioridade**: High - Completa o sistema de roles
**Complexidade**: Muito Baixa (área única, máximo reuso)

## Definição de Sucesso
- [ ] 6 páginas criadas em área admin unificada
- [ ] Navegação mostra "Administradores" apenas para master
- [ ] Página de admins bloqueia acesso de admin comum
- [ ] Configurações têm seções condicionais por role
- [ ] Cliente e Tipster bloqueados de toda área admin

## Arquitetura Simplificada

### Estrutura de Arquivos (Área Única)
```
/app/admin/
  layout.tsx              # Roles: ["admin", "master"]
  dashboard/page.tsx      # Visão geral (ambos)
  tipsters/page.tsx       # Gerenciar tipsters (ambos)
  clientes/page.tsx       # Gerenciar clientes (ambos)
  canais/page.tsx         # Moderar canais (ambos)
  admins/page.tsx         # Gerenciar admins (MASTER ONLY)
  configuracoes/page.tsx  # Configurações (seções condicionais)
```

### Navegação Condicional
```typescript
// Detectar se é admin ou master para mostrar itens extras
const adminNavItems = [
  { title: "Visão Geral", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Tipsters", href: "/admin/tipsters", icon: Users },
  { title: "Clientes", href: "/admin/clientes", icon: UserCheck },
  { title: "Canais", href: "/admin/canais", icon: Hash },
  // Mostrar apenas para master:
  ...(userRole === 'master' ? [
    { title: "Administradores", href: "/admin/admins", icon: Shield }
  ] : []),
  { title: "Configurações", href: "/admin/configuracoes", icon: Settings }
];
```

## Divisão Eficiente de Trabalho

### Claude (3 páginas + estrutura)
1. **Layout Unificado** (15 min)
   - `/app/admin/layout.tsx` (único)
   - Atualizar `sidebar-nav.tsx` com lógica condicional

2. **Páginas Core** (30 min)
   - `/admin/dashboard` - KPIs do sistema
   - `/admin/tipsters` - Tabela de tipsters

3. **Página Master-Only** (15 min)
   - `/admin/admins` - Gerenciar administradores (com proteção)

### Cursor (3 páginas em paralelo)
1. **Páginas Complementares** (30 min)
   - `/admin/clientes` - Lista de clientes
   - `/admin/canais` - Moderação de canais

2. **Configurações** (20 min)
   - `/admin/configuracoes` - Com seções condicionais

3. **Testes de Acesso** (10 min)
   - Testar bloqueio em `/admin/admins`
   - Validar navegação condicional

## Implementação Detalhada

### Fase 1: Estrutura Base (Claude - 15 min)

#### Layout Admin Unificado
```typescript
// /app/admin/layout.tsx
const allowedRoles = ["admin", "master"];
if (!allowedRoles.includes(profile.role)) {
  redirect("/access-denied");
}
```

#### Atualizar SidebarNav
```typescript
const isAdminArea = pathname.startsWith('/admin');
// Adicionar lógica para mostrar "Administradores" apenas para master
// userRole passado como prop do layout
```

### Fase 2: Páginas Admin (Claude + Cursor - 40 min)

#### Admin Dashboard (Claude)
```typescript
// KPIs:
- Total de Tipsters: 12
- Total de Clientes: 342
- Canais Ativos: 18
- Receita Total: R$ 45.678,00

// Seções:
- Atividade Recente (empty state)
- Gráfico de Crescimento (placeholder)
- Alertas do Sistema (lista)
```

#### Admin Tipsters (Claude)
```typescript
// Tabela com:
- Nome | Email | Canais | Assinantes | Status | Ações

// Mock data (3-4 tipsters)
// Ações: Ver detalhes, Suspender, Editar

// Filtros: Status (Ativo/Suspenso)
```

#### Admin Clientes (Cursor)
```typescript
// Tabela com:
- Nome | Email | Assinaturas | Gasto Total | Desde | Status

// Mock data (5-6 clientes)
// Busca por nome/email
// Filtros: Status, Período
```

#### Admin Canais (Cursor)
```typescript
// Cards de canais com:
- Nome, Tipster, Assinantes, Status
- Ações: Aprovar, Rejeitar, Moderar

// Tabs: Pendentes | Ativos | Suspensos
```

#### Admin Administradores (Claude) - MASTER ONLY
```typescript
// Verificação no início da página:
if (userRole !== 'master') {
  redirect("/access-denied");
}

// Tabela de administradores:
- Nome | Email | Role | Criado em | Status | Ações
// Mock: 3 admins + 1 master
// Ações: Suspender, Reativar (botões disabled)
```

#### Admin Configurações (Cursor) - Seções Condicionais
```typescript
// Seções para todos:
- Configurações Gerais
- Limites do Sistema

// Seções apenas para Master:
{userRole === 'master' && (
  <>
    - Gestão de Admins (criar novo admin - disabled)
    - Integrações (Telegram, Stripe, MercadoPago)
    - Manutenção (backup, logs, cache)
  </>
)}
```

## Dados Mockados

### Admin Dashboard
```typescript
const adminStats = [
  { title: "Total de Tipsters", value: 12, icon: Users, trend: { value: 20, isPositive: true } },
  { title: "Total de Clientes", value: 342, icon: UserCheck },
  { title: "Canais Ativos", value: 18, icon: Hash },
  { title: "Receita Total", value: "R$ 45.678,00", icon: DollarSign }
];
```

### Tipsters Mock
```typescript
const mockTipsters = [
  { name: "Carlos Tips", email: "carlos@tips.com", channels: 2, subscribers: 127, status: "active" },
  { name: "Ana Trader", email: "ana@trader.com", channels: 1, subscribers: 89, status: "active" },
  { name: "João Bets", email: "joao@bets.com", channels: 3, subscribers: 201, status: "suspended" }
];
```

### Master Metrics
```typescript
const usersByRole = {
  master: 1,
  admin: 3,
  tipster: 12,
  cliente: 342
};
```

## Controle de Acesso Esperado

### Matriz de Testes

| Usuário | /admin/* geral | /admin/admins | Comportamento |
|---------|----------------|---------------|---------------|
| Cliente | ❌ | ❌ | → /access-denied |
| Tipster | ❌ | ❌ | → /access-denied |
| Admin | ✅ | ❌ | Acessa área admin, mas não /admin/admins |
| Master | ✅ | ✅ | Acesso total + recursos extras |
| Não auth | ❌ | ❌ | → /auth/login |

### Middleware Existente
```typescript
// JÁ EXISTE proteção para /admin (linhas 95-99):
if (pathname.startsWith('/admin') && userRole !== 'admin' && userRole !== 'master') {
  redirect("/access-denied");
}

// Proteção adicional na página /admin/admins:
if (userRole !== 'master') {
  redirect("/access-denied");
}
```

## Riscos e Mitigações

### Riscos
1. **Confusão admin vs master** → Separação clara de features
2. **Muitas páginas de uma vez** → Divisão eficiente Claude/Cursor
3. **Dados sensíveis mockados** → Usar dados genéricos

### Mitigações
- Reusar 90% dos componentes existentes
- Trabalho paralelo bem definido
- Testes incrementais durante desenvolvimento

## Checklist de Validação

### Visual
- [ ] Navegação mostra itens corretos por área
- [ ] Ícones apropriados para contexto admin/master
- [ ] Tabelas e cards consistentes
- [ ] Estados vazios informativos

### Funcional
- [ ] Admin acessa 4 páginas admin
- [ ] Master acessa todas as 6 páginas
- [ ] Cliente/Tipster bloqueados
- [ ] Breadcrumbs funcionando

### Segurança
- [ ] Hierarquia respeitada (admin < master)
- [ ] Dados mockados não expõem info real
- [ ] Ações perigosas desabilitadas

## Timeline de Execução (Otimizado)

```
00:00 - 00:15: Claude cria layout único + atualiza nav
00:15 - 00:45: Claude: dashboard + tipsters + admins
                Cursor: clientes + canais (em paralelo)
00:45 - 01:05: Cursor: configurações com seções condicionais
01:05 - 01:15: Cursor: Testes de acesso e navegação
01:15 - 01:30: Ajustes finais e validação
```

## Critérios de Conclusão

- [ ] 6 páginas criadas e funcionando
- [ ] Navegação adaptativa para 3 contextos (cliente/tipster/admin+master)
- [ ] Controle de acesso validado (hierarquia)
- [ ] Zero erros no console
- [ ] Build passando
- [ ] Documentação atualizada

---

**IMPORTANTE**: O middleware já protege /admin corretamente (linhas 95-99). Precisamos garantir que a página /admin/admins tenha proteção adicional para bloquear admin comum!