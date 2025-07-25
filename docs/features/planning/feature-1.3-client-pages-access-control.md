# Feature 1.3: Client Pages + Access Control

## Overview
**Objetivo**: Implementar as páginas do cliente com placeholders funcionais e validar o sistema completo de controle de acesso
**Duração Estimada**: 2-3 horas
**Prioridade**: High - Valida todo o sistema de roles
**Complexidade**: Média

## Definição de Sucesso
- [ ] 3 páginas de cliente criadas com layout consistente
- [ ] Sistema de navegação lateral funcionando
- [ ] Breadcrumbs mostrando localização atual
- [ ] Controle de acesso bloqueando usuários não autorizados
- [ ] Redirecionamento para /access-denied funcionando
- [ ] Todos os 4 roles testados tentando acessar /cliente/*

## Arquitetura de Componentes

### Layout Principal
```
/app/cliente/
  layout.tsx              # Layout compartilhado com sidebar
  dashboard/
    page.tsx             # Dashboard principal
  assinaturas/
    page.tsx             # Lista de assinaturas
  historico/
    page.tsx             # Histórico de pagamentos
```

### Componentes Reutilizáveis
```
/components/
  layouts/
    client-layout.tsx     # Wrapper com sidebar + header
    page-header.tsx       # Header de página com breadcrumb
    sidebar-nav.tsx       # Navegação lateral
  ui/
    stats-card.tsx       # Card para estatísticas
    empty-state.tsx      # Estado vazio para listas
    page-container.tsx   # Container padrão de página
```

## Design System

### Estrutura Visual
```
┌─────────────────────────────────────────────┐
│ Header (já existe)                          │
├─────────────┬───────────────────────────────┤
│             │                               │
│  Sidebar    │  Page Content                 │
│  Navigation │  - Breadcrumb                 │
│  (200px)    │  - Page Title                 │
│             │  - Content Area               │
│             │                               │
└─────────────┴───────────────────────────────┘
```

### Sidebar Navigation
```
Dashboard
├── Visão Geral (dashboard)
├── Minhas Assinaturas (assinaturas)
└── Histórico (historico)

[User Avatar]
└── Configurações (futuro)
```

## Implementação Detalhada

### Fase 1: Layout Base (30 min)

#### 1.1 Client Layout (`/app/cliente/layout.tsx`)
```typescript
// Estrutura:
- Verificar autenticação
- Verificar role (apenas 'cliente' ou superior)
- Renderizar ClientLayout component
- Children dentro do layout
```

#### 1.2 ClientLayout Component
```typescript
// Componentes:
- SidebarNav (fixo à esquerda)
- Main content area (flex-1)
- PageContainer wrapper
```

#### 1.3 SidebarNav Component
```typescript
// Items:
const navItems = [
  { title: "Visão Geral", href: "/cliente/dashboard", icon: Home },
  { title: "Minhas Assinaturas", href: "/cliente/assinaturas", icon: CreditCard },
  { title: "Histórico", href: "/cliente/historico", icon: History }
]

// Features:
- Active state baseado na rota atual
- Icons do lucide-react
- Hover states
- Mobile responsive (drawer no mobile)
```

### Fase 2: Páginas Placeholder (45 min)

#### 2.1 Dashboard Page
```typescript
// Conteúdo:
- PageHeader com título "Dashboard"
- Grid com 3 StatsCard:
  - Assinaturas Ativas: 2
  - Gasto Mensal: R$ 89,90
  - ROI Médio: +145%
- Seção "Últimas Tips" (empty state)
- Seção "Performance" (empty state)
```

#### 2.2 Assinaturas Page
```typescript
// Conteúdo:
- PageHeader com título "Minhas Assinaturas"
- Tabs: Ativas | Canceladas
- EmptyState com:
  - Ícone de inbox vazio
  - Texto: "Você ainda não tem assinaturas"
  - Botão: "Explorar Tipsters"
```

#### 2.3 Histórico Page
```typescript
// Conteúdo:
- PageHeader com título "Histórico de Pagamentos"
- Filtros: Período (select com últimos 30/60/90 dias)
- EmptyState com:
  - Ícone de documento
  - Texto: "Nenhum pagamento encontrado"
```

### Fase 3: Componentes Compartilhados (30 min)

#### 3.1 PageHeader Component
```typescript
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: React.ReactNode
}

// Features:
- Breadcrumb automático baseado na rota
- Slot para ações (botões)
- Descrição opcional
```

#### 3.2 StatsCard Component
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Visual:
- Card com border
- Icon colorido
- Trend indicator (↑↓)
```

#### 3.3 EmptyState Component
```typescript
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}
```

### Fase 4: Access Control Testing (45 min)

#### 4.1 Testes de Acesso por Role

**Como Cliente (newcliente@betlink.com)**:
- [ ] /cliente/dashboard → ✅ Acesso permitido
- [ ] /cliente/assinaturas → ✅ Acesso permitido
- [ ] /cliente/historico → ✅ Acesso permitido

**Como Tipster (newtipster@betlink.com)**:
- [ ] /cliente/dashboard → ✅ Acesso permitido
- [ ] /cliente/assinaturas → ✅ Acesso permitido
- [ ] /cliente/historico → ✅ Acesso permitido

**Como Admin (newadmin@betlink.com)**:
- [ ] /cliente/dashboard → ✅ Acesso permitido
- [ ] /cliente/assinaturas → ✅ Acesso permitido
- [ ] /cliente/historico → ✅ Acesso permitido

**Como Master (newmaster@betlink.com)**:
- [ ] /cliente/dashboard → ✅ Acesso permitido
- [ ] /cliente/assinaturas → ✅ Acesso permitido
- [ ] /cliente/historico → ✅ Acesso permitido

**Não Autenticado**:
- [ ] /cliente/dashboard → ❌ Redirect para /auth/login
- [ ] /cliente/assinaturas → ❌ Redirect para /auth/login
- [ ] /cliente/historico → ❌ Redirect para /auth/login

#### 4.2 Navegação Interna
- [ ] Links da sidebar funcionam
- [ ] Estado ativo correto
- [ ] Breadcrumbs atualizando
- [ ] Navegação não quebra autenticação

## Divisão de Trabalho: Claude vs Cursor

### Claude (80% - Trabalho Complexo)
1. **Layout System**
   - Criar `/app/cliente/layout.tsx` com verificação de auth
   - Implementar `ClientLayout` component
   - Criar `SidebarNav` com estado ativo
   - Sistema de breadcrumbs automático

2. **Componentes Reutilizáveis**
   - `PageHeader` com breadcrumb
   - `StatsCard` com trends
   - `EmptyState` genérico
   - `PageContainer` wrapper

3. **Páginas Completas**
   - Dashboard com stats cards
   - Assinaturas com tabs
   - Histórico com filtros

### Cursor (20% - Tarefas de Suporte)
1. **Instalações**
   - Instalar lucide-react se necessário
   - Verificar dependências

2. **Testes de Acesso**
   - Testar cada role acessando /cliente/*
   - Documentar resultados
   - Capturar screenshots se possível

3. **Ajustes Visuais**
   - Verificar responsividade
   - Ajustar espaçamentos se necessário
   - Traduzir qualquer texto em inglês

## Estrutura de Arquivos Final

```
/app/cliente/
├── layout.tsx                    # Layout com auth check
├── dashboard/
│   └── page.tsx                 # Dashboard principal
├── assinaturas/
│   └── page.tsx                 # Lista de assinaturas
└── historico/
    └── page.tsx                 # Histórico

/components/
├── layouts/
│   ├── client-layout.tsx        # Layout wrapper
│   ├── page-header.tsx          # Header reutilizável
│   └── sidebar-nav.tsx          # Navegação lateral
└── ui/
    ├── stats-card.tsx           # Card de estatísticas
    ├── empty-state.tsx          # Estado vazio
    └── page-container.tsx       # Container padrão
```

## Checklist de Validação

### Visual
- [ ] Layout consistente em todas as páginas
- [ ] Sidebar fixa e sempre visível
- [ ] Breadcrumbs corretos
- [ ] Estados vazios informativos
- [ ] Responsivo em mobile

### Funcional
- [ ] Navegação entre páginas funciona
- [ ] Estado ativo na sidebar
- [ ] Logout funciona de qualquer página
- [ ] Theme switcher continua funcionando

### Segurança
- [ ] Apenas roles autorizados acessam
- [ ] Redirect para login se não autenticado
- [ ] Dados mockados não expõem informações sensíveis

## Dados Mockados

### Dashboard Stats
```typescript
const stats = [
  { title: "Assinaturas Ativas", value: 2, icon: Users },
  { title: "Gasto Mensal", value: "R$ 89,90", icon: CreditCard },
  { title: "ROI Médio", value: "+145%", icon: TrendingUp, trend: { value: 12, isPositive: true } }
]
```

### Mensagens Empty State
```typescript
const emptyStates = {
  subscriptions: {
    title: "Você ainda não tem assinaturas",
    description: "Explore nossos tipsters e comece a lucrar com suas apostas",
    action: { label: "Explorar Tipsters", href: "/canais" }
  },
  history: {
    title: "Nenhum pagamento encontrado",
    description: "Seus pagamentos aparecerão aqui"
  }
}
```

## Riscos e Mitigações

### Riscos
1. **Componentes muito complexos**: Manter simples, são placeholders
2. **Quebrar autenticação**: Testar após cada mudança
3. **Layout quebrar em mobile**: Testar responsividade

### Mitigações
- Começar com versão mínima funcional
- Commitar frequentemente
- Testar em múltiplos tamanhos de tela

## Notas de Implementação

1. **Não implementar** funcionalidades reais (são placeholders)
2. **Manter** consistência visual com landing page
3. **Usar** componentes shadcn/ui quando possível
4. **Seguir** padrão de cores do tema
5. **Testar** com todos os 4 usuários de teste

## Critérios de Conclusão

- [ ] 3 páginas criadas e acessíveis
- [ ] Layout com sidebar funcionando
- [ ] Navegação entre páginas OK
- [ ] Access control validado para todos roles
- [ ] Sem erros no console
- [ ] Build passando
- [ ] Documentação atualizada

---

**Importante**: Esta é apenas a estrutura base. Funcionalidades reais serão implementadas em EPICs futuros.