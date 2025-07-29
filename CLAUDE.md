# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ✅ Logging - Padrão do Projeto

Este projeto usa um logger centralizado em `lib/utils/logger.ts`. **É proibido o uso direto de `console.log`, `console.error`, etc.** Todos os eventos relevantes devem ser logados com contexto, utilizando os métodos:

- `logger.info()` → para eventos normais
- `logger.warn()` → para comportamentos inesperados  
- `logger.error()` → para falhas que devem ser investigadas
- `logger.audit()` → para eventos sensíveis (login, signup, alterações administrativas)
- `logger.debug()` → somente em ambiente de desenvolvimento

**Nunca logue senhas, tokens ou dados sensíveis.**

### Exemplo de uso correto:
```typescript
import { logger } from '@/lib/utils/logger';

// ✅ Bom - com contexto
logger.info('Usuário realizou login', { userId, email, role });

// ❌ Ruim - sem contexto
console.log('Login realizado');

// ✅ Bom - erro com stack trace
logger.error('Falha ao processar pagamento', error, { userId, amount });

// ❌ Ruim - sem informações úteis
console.error(error);
```

## Project Overview

**BetLink** is a tipster management platform that connects professional tipsters with betting clients. Built on Next.js 15 + Supabase, it provides subscription management, Telegram integration, and automated payment processing.

### Key Features
- Multi-role user system (Master, Admin, Tipster, Client)
- Subscription-based tipster channels
- Automated Telegram integration for channel access
- Payment processing with Stripe/MercadoPago
- Bet tracking and ROI calculation
- Waiting list management for full channels

## Essential Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint check
npm run lint

# Run tests (when configured)
npm test
```

## Architecture & Key Concepts

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI Components**: shadcn/ui (New York style) + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with role-based access
- **Payment Processing**: Stripe + MercadoPago (planned)
- **Messaging**: Telegram API (planned)
- **Deployment**: Vercel

### User Roles & Permissions
1. **Master**: Full system access, can manage all users and settings
2. **Admin**: Can manage all users except Master/Admin, created by Master
3. **Tipster**: Access to tipster dashboard, manage own channels and subscribers
4. **Client**: Access to client dashboard, can subscribe to channels

### Authentication Flow
- All auth logic flows through Supabase middleware (`middleware.ts`) which updates sessions on every request
- Auth pages are in `/app/auth/` (login, signup, forgot-password, etc.)
- Role-based routes will be organized as:
  - `/master/*` - Master only
  - `/admin/*` - Admin and above
  - `/tipster/*` - Tipster role
  - `/cliente/*` - Client role
- Session management uses cookies via `@supabase/ssr`

### Component Structure
- UI components use shadcn/ui located in `/components/ui/`
- Feature components organized by domain in `/components/features/`
- All components are TypeScript with proper type definitions
- Follow composition pattern with loading/error states

### Supabase Integration
- Three client configurations in `/lib/supabase/`:
  - `client.ts` - Browser client
  - `server.ts` - Server components client  
  - `middleware.ts` - Middleware session handling
- Database schema defined incrementally per feature
- RLS policies enforce security at database level
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Path Aliases
- `@/*` maps to the project root (configured in tsconfig.json)
- Example: `import { Button } from "@/components/ui/button"`

## Collaboration Protocol (Claude + Cursor)

### Role Division - OPTIMIZED FOR EFFICIENCY
- **Claude (90% do trabalho)**: 
  - Implementa toda lógica complexa e features completas
  - Cria componentes React, middleware, APIs
  - Arquitetura e decisões técnicas
  - Refatorações e debugging complexo
  - Escreve SQL e projeta schemas
  
- **Cursor (10% - tarefas de suporte)**:
  - Executa migrations e queries no Supabase via MCP
  - Roda testes com Playwright MCP
  - Tarefas simples em paralelo (criar pastas, deletar arquivos)
  - Atualiza links e rotas básicas
  - Valida implementações

### Communication Folders
- `.cursor-instructions/` - Tasks criadas por Claude para Cursor
- `.claude-instructions/` - Status reports e perguntas do Cursor

### IMPORTANT: Instructions for Cursor Tasks

When creating tasks for Cursor, ALWAYS:

1. **Use ABSOLUTE PATHS for file operations:**
   ```markdown
   ✅ CORRECT: Create file at /mnt/c/Users/pedro/Projetos/new-betlink/docs/features/planning/feature-1.2.md
   ❌ WRONG: Create file at docs/features/planning/feature-1.2.md
   ```

2. **Be explicit about file locations:**
   ```markdown
   ✅ CORRECT: "Save the progress report at /mnt/c/Users/pedro/Projetos/new-betlink/docs/epics/epic-1-base-system/progress.md"
   ❌ WRONG: "Save the progress report in the epic folder"
   ```

3. **Include full directory structure when needed:**
   ```markdown
   ✅ CORRECT: "Create these directories if they don't exist:
   - /mnt/c/Users/pedro/Projetos/new-betlink/docs/features/planning/
   - /mnt/c/Users/pedro/Projetos/new-betlink/docs/features/testing/"
   ```

### Parallel Workflow - MAXIMIZE SPEED
1. Claude começa implementação complexa
2. Claude cria task paralela para Cursor (tarefas simples)
3. Cursor executa em paralelo e reporta status
4. Claude integra e finaliza
5. Cursor valida com testes MCP

### Task Examples
**Claude implementa:**
```typescript
// Sistema completo de autenticação com roles
// 200+ linhas de código complexo
```

**Cursor executa em paralelo:**
```markdown
1. Delete /components/tutorial/*
2. Create folder structure /app/cliente/*
3. Run Supabase migration
4. Test with Playwright MCP
```

For detailed examples, see `/docs/collaboration/workflow-examples.md`

## Development Standards

### Code Quality
- **TypeScript**: Strict mode, no `any` types
- **Components**: Always include loading and error states
- **Forms**: Client-side validation + server-side verification
- **Queries**: Typed Supabase queries with error handling
- **UI/UX**: NUNCA usar emojis no app - sempre usar ícones do Lucide React
- **Backgrounds**: Manter consistência - não adicionar backgrounds diferentes sem necessidade

### Logging Standards
**IMPORTANTE: Use SEMPRE o logger centralizado. NUNCA use console.log/error/warn diretamente.**

```typescript
import { logger } from '@/lib/utils/logger';

// Authentication - sempre incluir contexto
logger.audit(userId, 'auth.login', 'session', { role, ip, userAgent });

// Data operations - incluir IDs e timestamps
logger.audit(userId, 'create', 'channel', { channelId, data, timestamp });

// Errors - sempre passar o objeto de erro
logger.error('payment.failed', error, { userId, amount, paymentMethod });

// Info - eventos importantes do sistema
logger.info('Subscription activated', { userId, channelId, plan });

// Warn - situações inesperadas mas não críticas  
logger.warn('Rate limit approaching', { userId, remaining: 10 });

// Debug - apenas em desenvolvimento
logger.debug('Cache miss', { key, reason });
```

**Regras de Logging:**
1. Sempre incluir contexto relevante (userId, IDs, timestamps)
2. Nunca logar dados sensíveis (senhas, tokens, cartões)
3. Usar níveis apropriados (não usar info para erros)
4. Em produção, debug não aparece

### Git Workflow
After each feature completion:
```bash
git add .
git commit -m "Complete Feature X.Y: [Name]

- [Detail 1]
- [Detail 2]
- Updated documentation

🤖 Generated with Claude Code"
git push origin main
```

## Development Approach

### Feature Development Rules - INCREMENTAL VISIBILITY
**EVERY feature must show something new at localhost:3000**

Good examples:
- ✅ "Create users table + display users on homepage"
- ✅ "Add login page + test with mock users"
- ✅ "Add RLS to users table + test access"

Bad examples:
- ❌ "Create users table + insert mock users" (only visible in Supabase)
- ❌ "Setup all RLS policies" (too many things at once)

### Feature Completion Requirements
**CRITICAL: A feature is ONLY complete after ALL these steps:**

1. **Implementation** ✅
2. **Human Testing** ✅ (seguir guia de teste)
3. **Documentation Update** ✅ (atualizar todos docs relevantes)
4. **Git Commit** ✅ (com mensagem descritiva)

**NUNCA iniciar uma nova feature sem completar TODOS os passos acima!**

```bash
# Checklist obrigatório antes de próxima feature:
- [ ] Código implementado e funcionando
- [ ] Teste humano executado e aprovado
- [ ] Documentação atualizada
- [ ] Git commit realizado
- [ ] Status report criado
```

### Documentation Requirements

**CRITICAL: Always use ABSOLUTE PATHS when creating documentation files!**

#### Directory Structure for Documentation
```
/mnt/c/Users/pedro/Projetos/new-betlink/docs/
├── master-plan.md                    # Overall project roadmap
├── epics/                            # Epic-level documentation
│   ├── epic-1-base-system/
│   │   ├── progress.md              # Epic progress tracking
│   │   └── handover.md              # Epic completion notes
│   ├── epic-2-channel-discovery/
│   └── ...
├── features/                         # Feature-level documentation
│   ├── planning/                    # Feature plans BEFORE implementation
│   │   └── feature-X.Y-name.md
│   ├── progress/                    # DURING implementation updates
│   │   └── feature-X.Y-progress.md
│   ├── testing/                     # Test guides and results
│   │   └── feature-X.Y-test.md
│   ├── handover/                    # AFTER completion notes
│   │   └── feature-X.Y-handover.md
│   └── learnings/                   # Implementation insights
│       └── feature-X.Y-learnings.md
└── collaboration/                    # Claude-Cursor collaboration
    └── workflow-examples.md
```

#### File Naming Convention
- Feature docs: `feature-X.Y-description.md` (ex: `feature-1.2-auth-pages.md`)
- Epic docs: `epic-N-name/filename.md` (ex: `epic-1-base-system/progress.md`)
- Always include feature/epic number in filename

#### When Creating Documentation for Cursor
**ALWAYS provide the FULL ABSOLUTE PATH:**
```markdown
# CORRECT ✅
Create file at: /mnt/c/Users/pedro/Projetos/new-betlink/docs/features/planning/feature-1.2-auth-pages.md

# WRONG ❌
Create file at: docs/features/planning/feature-1.2-auth-pages.md
Create file at: ./docs/features/...
Create file in the features planning folder
```

### Feature Planning Template
Each feature plan must include:
1. **Human Test**: Clear steps and expected results
2. **Dependencies**: Previous features and required files
3. **Guardrails**: What NOT to modify, what to maintain
4. **Technical Context**: Relevant schemas and patterns
5. **Estimates**: Complexity and time

## Important Patterns

### Feature-Scoped Logging
```typescript
// Use feature name prefix for traceability
const FEATURE_NAME = '[Feature: ChannelList]';

console.log(`${FEATURE_NAME} Starting process...`);
console.error(`${FEATURE_NAME} Error found:`, error);

// In React components
useEffect(() => {
  console.log(`${FEATURE_NAME} Component mounted`);
  return () => console.log(`${FEATURE_NAME} Component unmounted`);
}, []);
```

### Error Handling
```typescript
try {
  const result = await operation();
  logger.info('operation.success', { data: result });
  return { success: true, data: result };
} catch (error) {
  logger.error('operation.failed', error as Error, { context });
  return { success: false, error: error.message };
}
```

### Feature Flags
```typescript
// config/feature-flags.ts
export const FEATURES = {
  AUTH: true,           // ✅ Implemented
  CHANNEL_LIST: true,   // ✅ Implemented
  PAYMENT: false,       // 🚧 In development
  TELEGRAM_BOT: false,  // ⏳ Planned
} as const;

// Usage
if (FEATURES.PAYMENT) {
  return <PaymentComponent />;
}
return <ComingSoon feature="Payments" />;
```

### Protected Routes
```typescript
// In middleware.ts
if (pathname.startsWith('/admin') && userRole !== 'admin' && userRole !== 'master') {
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}
```

### Database Queries
```typescript
const { data, error } = await supabase
  .from('channels')
  .select(`
    *,
    tipster:profiles!tipster_id(id, name),
    metrics:channel_metrics(*)
  `)
  .eq('status', 'active');
```

## Current Project Status

- **Current Epic**: EPIC 1 - Sistema Base com Autenticação e Navegação
- **Next Feature**: Feature 1.1 - Landing Page e Header Base
- **Documentation**: See `/docs/master-plan.md` for complete roadmap

## Testing Guidelines

### Manual Test Checklist Template
For each feature, create a checklist covering:
- **Main Functionality**: Feature works as planned?
- **Regression**: Previous features still working?
- **Performance**: Page loads < 3s?
- **Responsiveness**: Desktop/Tablet/Mobile
- **Accessibility**: Keyboard navigation, contrast
- **Security**: No sensitive data in logs

### Automated Testing (When Implemented)
- Unit tests for utilities and hooks
- Integration tests for API routes
- E2E tests with Playwright for critical flows
- Always test with different user roles
- Verify RLS policies with actual data

### Playwright Test Pattern
```typescript
test.describe(`Feature: ${FEATURE_NAME}`, () => {
  test('should not break previous features', async ({ page }) => {
    // Verify navigation still works
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify other routes still load
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL('/404');
  });
});
```

## Security Considerations

- Never expose Supabase service role key
- All data access through RLS policies
- Validate user permissions in middleware AND components
- Sanitize user inputs
- Log security-relevant events
- Use prepared statements for dynamic queries

## Feature Handover Protocol

After completing a feature, create a handover document including:

### 1. Current State
- File structure with status (✅ created, ⚠️ modified)
- Available APIs and functions
- Reusable components
- Environment variables added

### 2. Warnings
- Files that must NOT be modified
- Features that must continue working
- Possible conflicts with future features

### 3. How to Start Next Feature
- Dependencies to install
- Environment setup
- Quick test commands

### 4. Guardrail Comments
```typescript
/**
 * @feature: Login
 * @guardrail: This file is base - DO NOT MODIFY
 * @dependencies: supabase, react-hook-form
 * @created: Feature 1.2
 */
```

## Success Metrics

### Per Feature
- ✅ Human test passes on first try: > 80%
- ⏱️ Implementation time vs estimate: < 1.5x
- 🐛 Production bugs: 0
- 🔄 Rework needed: < 20%

### Git Commit Requirement
**CRITICAL**: Never start next feature without committing current work:
```bash
git add .
git commit -m "Complete Feature X.Y: [Name]

- Implementation details
- Tests passing
- Documentation updated"
git push origin main
```