# Feature 1.1: Base Infrastructure

## 1. Human Test
**What to test**: Nova estrutura base do BetLink com navegação
**How to test**:
1. Acessar http://localhost:3000
2. Ver landing page com "BetLink" ao invés do tutorial
3. Ver header com logo e botão de login
4. Ver navigation bar com todos os links em dropdown
5. Clicar em "Access Denied" no nav e ver página
6. Clicar em "Error" no nav e ver página de erro

**Expected result**: 
- Landing page limpa sem tutorial
- Header com logo BetLink e botão Login
- Navigation com dropdown mostrando todas as seções
- Páginas de erro funcionando

## 2. Dependencies
- **Previous features**: None (primeira feature)
- **Existing files**: 
  - `/app/layout.tsx` - Layout principal
  - `/app/page.tsx` - Home page atual
  - `/components/ui/*` - Componentes shadcn
- **Required libraries**: 
  - Já instaladas (Next.js, React, Tailwind, shadcn)

## 3. Guardrails

### DO NOT MODIFY
- `/lib/supabase/*` - Configurações do Supabase
- `/middleware.ts` - Por enquanto, manter como está
- `.env.local` - Variáveis de ambiente

### MUST MAINTAIN
- Supabase connection funcionando
- shadcn/ui components disponíveis
- Tailwind CSS funcionando
- Dark mode support

### CAN CREATE
- `/components/layout/header.tsx`
- `/components/layout/navigation.tsx`
- `/app/error/page.tsx`
- `/app/access-denied/page.tsx`
- `/components/layout/logo.tsx`

### MUST REUSE
- Componentes UI do shadcn (Button, DropdownMenu, etc)
- Tailwind classes existentes
- Theme system (dark/light mode)

## 4. Technical Context

### Estrutura de Navegação
```typescript
// Todas as rotas do sistema (para o nav dropdown)
const navItems = {
  public: [
    { label: "Home", href: "/" },
    { label: "Canais", href: "/canais" },
  ],
  client: [
    { label: "Dashboard", href: "/cliente/dashboard" },
    { label: "Assinaturas", href: "/cliente/assinaturas" },
    { label: "Histórico", href: "/cliente/historico" },
  ],
  tipster: [
    { label: "Dashboard", href: "/tipster/dashboard" },
    { label: "Meus Canais", href: "/tipster/canais" },
    { label: "Assinantes", href: "/tipster/assinantes" },
    { label: "Métricas", href: "/tipster/metricas" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Tipsters", href: "/admin/tipsters" },
    { label: "Clientes", href: "/admin/clientes" },
    { label: "Canais", href: "/admin/canais" },
  ],
  master: [
    { label: "Dashboard", href: "/master/dashboard" },
    { label: "Configurações", href: "/master/configuracoes" },
  ],
  system: [
    { label: "Access Denied", href: "/access-denied" },
    { label: "Error", href: "/error" },
  ]
};
```

### Componentes shadcn úteis
- `DropdownMenu` - Para o navigation dropdown
- `Button` - Para botões de login/logout
- `Avatar` - Para futuro avatar do usuário

### Layout esperado
```
┌─────────────────────────────────────┐
│ Logo    Navigation          Login   │ <- Header
├─────────────────────────────────────┤
│                                     │
│         Page Content                │
│                                     │
└─────────────────────────────────────┘
```

## 5. Estimate
- **Complexity**: Low
- **Estimated time**: 2-3 hours
- **Identified risks**: 
  - Remover tutorial sem quebrar funcionalidades
  - Organizar navigation de forma clara