# Análise da Evolução do Middleware - BetLink

## 📋 Visão Geral

Este documento detalha como o sistema de middleware evolui incrementalmente ao longo do EPIC 1, partindo de um sistema básico de autenticação para um sistema completo com roles e permissões.

## 🎯 Princípios da Evolução

1. **Incremental**: Cada feature adiciona apenas UMA funcionalidade
2. **Testável**: Cada mudança pode ser testada isoladamente
3. **Reversível**: Fácil voltar se algo quebrar
4. **Debugável**: Problemas são fáceis de identificar

## 📂 Arquivos Envolvidos

- `/middleware.ts` - Middleware raiz (permanece simples)
- `/lib/supabase/middleware.ts` - Contém toda a lógica (evolui gradualmente)

## 🔍 Estado Inicial

### Análise do Código Atual

O middleware inicial do starter Supabase:
- ✅ Protege todas as rotas exceto `/`, `/login`, `/auth/*`
- ✅ Redireciona usuários não autenticados para `/auth/login`
- ⚠️ Usa `getClaims()` (menos seguro que `getUser()`)
- ❌ Não verifica roles/permissões

```typescript
// Estado atual em /lib/supabase/middleware.ts
if (
  request.nextUrl.pathname !== "/" &&
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth")
) {
  return NextResponse.redirect(url);
}
```

## 📊 Evolução por Feature

### Feature 1.1: Base Infrastructure
**Mudanças**: NENHUMA
- Mantém middleware como está
- Foco apenas em UI/UX

### Feature 1.2: Database Schema + Auth Pages
**Mudança**: Migrar de `getClaims()` para `getUser()`

```typescript
// ANTES:
const { data } = await supabase.auth.getClaims();
const user = data?.claims;

// DEPOIS:
const { data } = await supabase.auth.getUser();
const user = data?.user;
```

**Justificativa**: 
- `getUser()` valida token no servidor
- Mais seguro para SSR
- Prepara para buscar roles

### Feature 1.3: Client Pages + Access Control
**Mudança**: Sistema de rotas públicas explícitas

```typescript
const publicRoutes = ['/', '/canais', '/error', '/access-denied'];
const pathname = request.nextUrl.pathname;
const isPublicRoute = publicRoutes.some(route => 
  pathname === route || pathname.startsWith('/auth')
);

if (isPublicRoute) {
  return supabaseResponse;
}
```

**Benefício**: Controle explícito sobre rotas públicas

### Feature 1.4: Tipster Pages + Access Control
**Mudança**: Primeira verificação de role

```typescript
if (pathname.startsWith('/tipster')) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('app_role')
    .eq('id', user.id)
    .single();
  
  if (profile?.app_role !== 'tipster') {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }
}
```

**Marco**: Primeira proteção baseada em role

### Feature 1.5: Admin Pages + Access Control
**Mudança**: Sistema expandido com tratamento de erros

```typescript
// Buscar role uma vez
const { data: profile, error } = await supabase
  .from('profiles')
  .select('app_role')
  .eq('id', user.id)
  .single();

// Tratar perfil ausente
if (error || !profile) {
  return NextResponse.redirect(new URL('/profile-setup', request.url));
}

// Verificar múltiplas rotas
if (pathname.startsWith('/admin') && 
    userRole !== 'admin' && userRole !== 'master') {
  return redirectToAccessDenied(request);
}
```

**Melhorias**: 
- Tratamento de erros
- Suporte a hierarquia (admin pode ser master também)

### Feature 1.6: Master Pages + Test Users
**Mudança**: Sistema de permissões baseado em dados

```typescript
const routePermissions = {
  '/cliente': ['client', 'admin', 'master'],
  '/tipster': ['tipster', 'admin', 'master'],
  '/admin': ['admin', 'master'],
  '/master': ['master']
};

const protectedRoute = Object.keys(routePermissions).find(route => 
  pathname.startsWith(route)
);

if (protectedRoute) {
  const allowedRoles = routePermissions[protectedRoute];
  if (!allowedRoles.includes(userRole)) {
    return redirectToAccessDenied(request);
  }
}
```

**Vantagem**: Fácil adicionar novos roles/rotas

### Feature 1.7: Polish + Final Testing
**Mudança**: Logs e otimizações

```typescript
// Logs para debugging
console.log(`[Auth] Access denied: ${userRole} tried ${pathname}`);

// Funções auxiliares
function redirectToAccessDenied(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/access-denied";
  return NextResponse.redirect(url);
}
```

## 📈 Métricas de Complexidade

| Feature | Complexidade Adicionada | Total Acumulado |
|---------|------------------------|-----------------|
| 1.1 | 0% | 0% |
| 1.2 | 5% | 5% |
| 1.3 | 10% | 15% |
| 1.4 | 20% | 35% |
| 1.5 | 15% | 50% |
| 1.6 | 20% | 70% |
| 1.7 | 10% | 80% |

## 🎯 Benefícios da Abordagem Incremental

### 1. Debugging Facilitado
- Feature 1.3 quebrou? Problema nas rotas públicas
- Feature 1.4 quebrou? Problema na verificação de role
- Feature 1.5 quebrou? Problema no tratamento de erros

### 2. Testes Incrementais
```bash
# Após Feature 1.3
✓ Rotas públicas acessíveis
✓ Rotas privadas protegidas

# Após Feature 1.4
✓ Tipster acessa /tipster
✓ Cliente não acessa /tipster

# Após Feature 1.5
✓ Admin acessa /admin
✓ Perfis ausentes redirecionam
```

### 3. Rollback Simples
Se algo quebrar, volte apenas uma feature, não todo o sistema.

## 🔒 Segurança em Camadas

1. **Middleware**: Primeira linha de defesa
2. **Page Components**: Verificação redundante
3. **API Routes**: Validação adicional
4. **RLS Policies**: Proteção no banco

## 📝 Exemplo de Teste Manual

### Feature 1.4 - Teste de Acesso Tipster
1. Login como cliente
2. Tentar acessar `/tipster/dashboard`
3. Esperado: Redirecionamento para `/access-denied`
4. Login como tipster
5. Acessar `/tipster/dashboard`
6. Esperado: Acesso permitido

## 🚀 Próximos Passos

1. Implementar cache de roles para performance
2. Adicionar métricas de acesso negado
3. Criar dashboard de auditoria
4. Implementar rate limiting

## 📚 Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)