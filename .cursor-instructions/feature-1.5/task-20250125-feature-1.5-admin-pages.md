# Task: Feature 1.5 - Admin Area Unificada - Parallel Implementation

**Priority**: URGENT
**Estimated Time**: 1 hour (working in parallel with Claude)
**Start**: As soon as Claude creates the layout

## Context
Feature 1.5 implements a unified admin area accessible by both admin and master roles. The only difference is that master can access the /admin/admins page. Claude will implement the layout and 3 pages, while you implement 3 pages in parallel to maximize efficiency.

## Your Tasks Timeline

### Task 1: Wait for Claude's Signal (First 15 minutes)
Claude will create:
- `/app/admin/layout.tsx` (unified layout for admin and master)
- Updated `sidebar-nav.tsx` with conditional navigation

Once ready, you'll receive the signal to start.

### Task 2: Implement Admin Pages (15-40 minutes)

#### 2.1 Create `/app/admin/clientes/page.tsx`

**Requirements**:
```typescript
// Import components
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, Search, Filter } from "lucide-react";

// Page structure:
- PageHeader with title "Gerenciar Clientes"
- Search bar (Input with Search icon)
- Filter buttons (Status: Todos/Ativos/Inativos)
- Table with columns: Nome | Email | Assinaturas | Gasto Total | Desde | Status
```

**Mock data**:
```typescript
const mockClientes = [
  { id: 1, name: "João Silva", email: "joao@email.com", subscriptions: 2, totalSpent: "R$ 179,80", since: "Jan 2024", status: "active" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", subscriptions: 1, totalSpent: "R$ 39,90", since: "Mar 2024", status: "active" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", subscriptions: 0, totalSpent: "R$ 0,00", since: "Dez 2024", status: "inactive" },
  // Add 2-3 more...
];
```

#### 2.2 Create `/app/admin/canais/page.tsx`

**Requirements**:
```typescript
// Use Tabs for: Pendentes | Ativos | Suspensos
// Each tab shows channel cards with:
- Channel name
- Tipster name
- Subscriber count
- Status badge
- Action buttons: Aprovar/Rejeitar (for pending), Suspender (for active)
```

**Mock data**:
```typescript
const mockChannels = {
  pending: [
    { id: 1, name: "Tips Europa League", tipster: "Carlos Tips", subscribers: 0, status: "pending" }
  ],
  active: [
    { id: 2, name: "Tips Premium ⚽", tipster: "Ana Trader", subscribers: 89, status: "active" },
    { id: 3, name: "Tips VIP 🎾", tipster: "João Bets", subscribers: 45, status: "active" }
  ],
  suspended: []
};
```

### Task 3: Implement Admin Configurações Page (40-50 minutes)

#### 3.1 Create `/app/admin/configuracoes/page.tsx`

**Requirements**:
```typescript
// Import user role from session/context
// Page sections using Cards:

// SEÇÕES PARA TODOS (admin e master):
1. Configurações Gerais
   - Site name (input disabled)
   - Support email (input disabled)
   - Maintenance mode (switch disabled)

2. Limites do Sistema
   - Max channels per tipster: 5
   - Max subscribers per channel: 100
   - Min subscription price: R$ 19,90

// SEÇÕES APENAS PARA MASTER:
{userRole === 'master' && (
  <>
    3. Gestão de Admins
       - Botão "Criar Novo Admin" (disabled)
       - Link para /admin/admins
    
    4. Integrações
       - Telegram Bot: ✅ Conectado
       - Stripe: ⚠️ Configurar
       - MercadoPago: ❌ Desconectado
    
    5. Manutenção
       - Backup Database (button disabled)
       - Clear Cache (button disabled)
       - View Logs (button)
  </>
)}
```

### Task 4: Access Control Testing (50-60 minutes)

Test access to admin area and specific pages:

| User | Email | /admin/dashboard | /admin/admins | /admin/configuracoes | Expected |
|------|-------|------------------|---------------|---------------------|----------|
| Cliente | newcliente@betlink.com | ❌ | ❌ | ❌ | All blocked |
| Tipster | newtipster@betlink.com | ❌ | ❌ | ❌ | All blocked |
| Admin | newadmin@betlink.com | ✅ | ❌ | ✅ (limited) | Admin OK except admins page |
| Master | newmaster@betlink.com | ✅ | ✅ | ✅ (full) | All allowed |
| Not logged in | - | ❌ | ❌ | ❌ | Redirect to login |

**Important**: 
- Admin should see "Administradores" link in navigation but get blocked when accessing /admin/admins
- Admin should see limited options in /admin/configuracoes (no master sections)

### Task 5: Final Report (Last 10 minutes)

Create report at: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.5/feature-1.5-test-report.md`

Include:
- Access control matrix results
- Conditional navigation working?
- Conditional sections in configurações working?
- Any bugs found
- Portuguese translation issues
- Performance observations

## Important Notes

### Middleware Check
The middleware already protects:
- `/admin/*` - Admin and master roles (lines 95-99)

**Additional Protection Needed**:
- `/admin/admins` page must check for master role and redirect admin to /access-denied

### Reuse Components
- Use existing UI components
- Follow patterns from client/tipster areas
- Keep consistent styling

### Mock Data Quality
- Use realistic Portuguese names
- Prices in R$ format
- Dates in Portuguese format

## Success Criteria

- ✅ 3 pages implemented with good UX
- ✅ Access control working (hierarchy: master > admin)
- ✅ Navigation shows "Administradores" only for master
- ✅ Configurações shows conditional sections based on role
- ✅ All text in Portuguese
- ✅ Responsive design
- ✅ No console errors

## Communication

If blocked or found critical bugs, create:
`.claude-instructions/feature-1.5/urgent-[issue].md`

---

**Start when Claude gives the green light!**