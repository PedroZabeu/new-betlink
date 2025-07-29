# Feature 1.4: Tipster Pages + Access Control

## Overview
**Objetivo**: Implementar as páginas do tipster com placeholders funcionais e validar controle de acesso
**Duração Estimada**: 1.5-2 horas
**Prioridade**: High - Continua validação do sistema de roles
**Complexidade**: Baixa (reutilização de padrões da 1.3)

## Definição de Sucesso
- [ ] 4 páginas de tipster criadas com layout consistente
- [ ] Sistema de navegação lateral funcionando
- [ ] Breadcrumbs mostrando localização atual
- [ ] Controle de acesso bloqueando clientes
- [ ] Redirecionamento para /access-denied funcionando
- [ ] Todos os 5 cenários de acesso testados

## Arquitetura de Componentes

### Layout Principal (Reutilizando da 1.3)
```
/app/tipster/
  layout.tsx              # Layout com verificação de roles
  dashboard/
    page.tsx             # Dashboard principal
  canais/
    page.tsx             # Gerenciar canais
  assinantes/
    page.tsx             # Lista de assinantes
  metricas/
    page.tsx             # Métricas de performance
```

### Componentes a Criar
```
/components/
  layouts/
    tipster-layout.tsx   # Wrapper específico (ou reutilizar client-layout)
    tipster-sidebar.tsx  # Navegação do tipster (ou adaptar sidebar-nav)
```

## Design System

### Navegação do Tipster
```
Dashboard
├── Visão Geral (dashboard)
├── Meus Canais (canais)
├── Assinantes (assinantes)
└── Métricas (metricas)

[User Avatar]
└── Tipster: [nome]
```

### Ícones Sugeridos (lucide-react)
- Dashboard: LayoutDashboard
- Canais: Hash
- Assinantes: Users
- Métricas: BarChart3

## Implementação Detalhada

### Fase 1: Layout Base (20 min)

#### 1.1 Tipster Layout (`/app/tipster/layout.tsx`)
```typescript
// IMPORTANTE: Baseado na Feature 1.3
// Verificar autenticação
// Roles permitidos: ["tipster", "admin", "master"]
// Cliente → redirect("/access-denied")
// Não autenticado → redirect("/auth/login")
```

#### 1.2 Reutilização de Componentes
- Usar `ClientLayout` renomeando para contexto tipster
- OU criar `TipsterLayout` copiando estrutura
- Adaptar `SidebarNav` com novos itens de menu

### Fase 2: Páginas Placeholder (40 min)

#### 2.1 Dashboard Page
```typescript
// Conteúdo:
- PageHeader: "Dashboard do Tipster"
- Grid com 4 StatsCard:
  - Total de Assinantes: 127
  - Receita Mensal: R$ 3.429,00
  - Taxa de Acerto: 68%
  - Tips Este Mês: 45
- Seção "Últimas Tips Enviadas" (empty state)
- Seção "Novos Assinantes" (empty state)
```

#### 2.2 Canais Page
```typescript
// Conteúdo:
- PageHeader: "Meus Canais"
- Botão: "Criar Novo Canal" (desabilitado)
- Card exemplo de canal:
  - Nome: "Tips Premium ⚽"
  - Assinantes: 89
  - Preço: R$ 39,90/mês
  - Status: Ativo
- EmptyState para segundo canal
```

#### 2.3 Assinantes Page
```typescript
// Conteúdo:
- PageHeader: "Assinantes"
- Tabs: Ativos | Inativos | Lista de Espera
- Tabela com colunas:
  - Nome | Canal | Data Assinatura | Status
- 3-4 linhas de dados mockados
- Paginação desabilitada
```

#### 2.4 Métricas Page
```typescript
// Conteúdo:
- PageHeader: "Métricas de Performance"
- Filtros: Período (30/60/90 dias)
- Cards com métricas:
  - ROI Médio: +145%
  - Win Rate: 68%
  - Yield: 5.2%
- EmptyState: "Gráficos em breve"
```

### Fase 3: Controle de Acesso (20 min)

#### 3.1 Middleware - ATENÇÃO ESPECIAL
```typescript
// O MIDDLEWARE JÁ ESTÁ CONFIGURADO!
// Linha 101-105 do middleware.ts:
if (pathname.startsWith('/tipster') && userRole === 'cliente') {
  const url = request.nextUrl.clone();
  url.pathname = "/access-denied";
  return NextResponse.redirect(url);
}

// NÃO PRECISA MODIFICAR!
```

#### 3.2 Layout Protection
```typescript
// No layout.tsx do tipster:
const allowedRoles = ["tipster", "admin", "master"];
if (!allowedRoles.includes(profile.role)) {
  redirect("/access-denied");
}
```

### Fase 4: Testes de Acesso (30 min)

#### Matriz de Testes Esperada

| Usuário | Email | Esperado em /tipster/* | Comportamento |
|---------|-------|------------------------|---------------|
| Cliente | newcliente@betlink.com | ❌ Bloqueado | → /access-denied |
| Tipster | newtipster@betlink.com | ✅ Permitido | Acesso normal |
| Admin | newadmin@betlink.com | ✅ Permitido | Acesso hierárquico |
| Master | newmaster@betlink.com | ✅ Permitido | Acesso hierárquico |
| Não autenticado | - | ❌ Bloqueado | → /auth/login |

## Divisão de Trabalho: Claude vs Cursor

### Claude (85% - Trabalho Principal)
1. **Layout System**
   - Criar `/app/tipster/layout.tsx` com verificação correta
   - Adaptar layout components para contexto tipster
   - Configurar navegação específica

2. **Páginas Completas**
   - Dashboard com 4 stats cards
   - Canais com card de exemplo
   - Assinantes com tabela
   - Métricas com filtros

3. **Verificar Middleware**
   - Confirmar que já funciona
   - Adicionar logs se necessário

### Cursor (15% - Validação)
1. **Testes de Acesso**
   - Matrix completa de 5 cenários
   - Capturar evidências
   - Documentar resultados

2. **Verificações Visuais**
   - Responsividade
   - Textos em português
   - Navegação funcionando

## Dados Mockados

### Dashboard Stats
```typescript
const tipsterStats = [
  { title: "Total de Assinantes", value: 127, icon: Users },
  { title: "Receita Mensal", value: "R$ 3.429,00", icon: CreditCard },
  { title: "Taxa de Acerto", value: "68%", icon: Target, trend: { value: 3, isPositive: true } },
  { title: "Tips Este Mês", value: 45, icon: Send }
];
```

### Assinantes Mock
```typescript
const mockSubscribers = [
  { name: "João Silva", channel: "Tips Premium ⚽", date: "15/01/2025", status: "Ativo" },
  { name: "Maria Santos", channel: "Tips Premium ⚽", date: "10/01/2025", status: "Ativo" },
  { name: "Pedro Costa", channel: "Tips VIP 🎾", date: "05/01/2025", status: "Ativo" }
];
```

### Canal Example
```typescript
const channelExample = {
  name: "Tips Premium ⚽",
  description: "Tips diárias de futebol com análise detalhada",
  subscribers: 89,
  price: "R$ 39,90",
  status: "active",
  telegram: "@tipspremium"
};
```

## Riscos e Mitigações

### Riscos
1. **Middleware não bloquear cliente**: Já mitigado (código existe)
2. **Confusão com roles**: Documentar claramente
3. **Componentes duplicados**: Decidir entre reutilizar ou criar novos

### Mitigações
- Testar acesso imediatamente após criar layout
- Reutilizar máximo possível da Feature 1.3
- Manter consistência visual

## Aprendizados da Feature 1.3

### ✅ O que funcionou bem:
1. Reutilização de componentes UI
2. Padrão de layout com verificação de roles
3. Teste incremental de acesso
4. Documentação clara para Cursor

### ⚠️ Erros a evitar:
1. **NÃO** modificar middleware sem necessidade
2. **NÃO** esquecer de testar usuário não autenticado
3. **NÃO** assumir comportamento - sempre verificar

### 💡 Melhorias para 1.4:
1. Verificar middleware ANTES de começar
2. Criar dados mockados mais realistas
3. Incluir mais variedade visual nas páginas

## Checklist de Validação

### Visual
- [ ] Layout consistente com área cliente
- [ ] Navegação específica do tipster
- [ ] Ícones apropriados para o contexto
- [ ] Cores e tema mantidos
- [ ] Responsivo em mobile

### Funcional
- [ ] Navegação entre páginas funciona
- [ ] Breadcrumbs atualizando
- [ ] Estado ativo na sidebar
- [ ] Filtros e tabs (onde aplicável)

### Segurança
- [ ] Cliente bloqueado (→ /access-denied)
- [ ] Não autenticado bloqueado (→ /auth/login)
- [ ] Admin e Master têm acesso
- [ ] Tipster acessa normalmente

## Critérios de Conclusão

- [ ] 4 páginas criadas e acessíveis
- [ ] Layout com sidebar funcionando
- [ ] Navegação consistente
- [ ] Access control validado (5 cenários)
- [ ] Sem erros no console
- [ ] Build passando
- [ ] Documentação atualizada
- [ ] Commit realizado

---

**IMPORTANTE**: O middleware já está configurado para bloquear clientes. Não modificar!