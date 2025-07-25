# Código Completo - Evolução do Middleware

## Feature 1.2 - Versão com getUser()

```typescript
// /lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // MUDANÇA: getClaims() → getUser()
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

## Feature 1.3 - Rotas Públicas Explícitas

```typescript
export async function updateSession(request: NextRequest) {
  // ... setup inicial ...

  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  
  // NOVO: Sistema de rotas públicas
  const pathname = request.nextUrl.pathname;
  const publicRoutes = ['/', '/canais', '/error', '/access-denied'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/auth')
  );
  
  if (isPublicRoute) {
    return supabaseResponse;
  }
  
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

## Feature 1.4 - Primeira Verificação de Role

```typescript
export async function updateSession(request: NextRequest) {
  // ... código anterior ...
  
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  
  // NOVO: Verificação de role para tipster
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/tipster')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('app_role')
      .eq('id', user.id)
      .single();
    
    if (profile?.app_role !== 'tipster') {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }
  
  return supabaseResponse;
}
```

## Feature 1.5 - Sistema Expandido

```typescript
export async function updateSession(request: NextRequest) {
  // ... código anterior ...
  
  const pathname = request.nextUrl.pathname;
  const needsRoleCheck = 
    pathname.startsWith('/cliente') ||
    pathname.startsWith('/tipster') ||
    pathname.startsWith('/admin');
  
  if (needsRoleCheck) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('app_role')
      .eq('id', user.id)
      .single();
    
    if (error || !profile) {
      const url = request.nextUrl.clone();
      url.pathname = "/profile-setup";
      return NextResponse.redirect(url);
    }
    
    const userRole = profile.app_role;
    
    if (pathname.startsWith('/cliente') && userRole !== 'client') {
      return redirectToAccessDenied(request);
    }
    
    if (pathname.startsWith('/tipster') && userRole !== 'tipster') {
      return redirectToAccessDenied(request);
    }
    
    if (pathname.startsWith('/admin') && 
        userRole !== 'admin' && userRole !== 'master') {
      return redirectToAccessDenied(request);
    }
  }
  
  return supabaseResponse;
}

function redirectToAccessDenied(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/access-denied";
  return NextResponse.redirect(url);
}
```

## Feature 1.7 - Versão Final Completa

```typescript
// /lib/supabase/middleware.ts - VERSÃO FINAL
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  const pathname = request.nextUrl.pathname;
  
  // 1. Rotas sempre públicas
  const publicRoutes = ['/', '/canais', '/error', '/access-denied'];
  const isPublic = publicRoutes.some(r => pathname === r) || 
                   pathname.startsWith('/auth');
  
  if (isPublic) {
    return supabaseResponse;
  }
  
  // 2. Verificar autenticação
  if (!user) {
    console.log(`[Auth] Redirecting to login from ${pathname}`);
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  
  // 3. Sistema de permissões
  const routePermissions: Record<string, string[]> = {
    '/cliente': ['client', 'admin', 'master'],
    '/tipster': ['tipster', 'admin', 'master'],
    '/admin': ['admin', 'master'],
    '/master': ['master']
  };
  
  // 4. Verificar autorização
  const protectedRoute = Object.keys(routePermissions).find(route => 
    pathname.startsWith(route)
  );
  
  if (protectedRoute) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('app_role')
      .eq('id', user.id)
      .single();
    
    if (error || !profile) {
      console.error('[Auth] Profile not found for user:', user.id);
      const url = request.nextUrl.clone();
      url.pathname = "/profile-setup";
      return NextResponse.redirect(url);
    }
    
    const userRole = profile.app_role;
    const allowedRoles = routePermissions[protectedRoute];
    
    if (!allowedRoles.includes(userRole)) {
      console.log(`[Auth] Access denied: ${userRole} tried ${pathname}`);
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }
  
  return supabaseResponse;
}
```

## Arquivo /middleware.ts (Raiz - Permanece Simples)

```typescript
// /middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Testes de Cada Versão

### Feature 1.3 - Teste
```bash
# Sem login
/ → ✅ Acesso permitido
/canais → ✅ Acesso permitido  
/cliente/dashboard → ❌ Redireciona para /auth/login

# Com login
Todas as rotas → ✅ Acesso permitido
```

### Feature 1.4 - Teste
```bash
# Como cliente
/tipster/dashboard → ❌ Redireciona para /access-denied

# Como tipster
/tipster/dashboard → ✅ Acesso permitido
```

### Feature 1.7 - Teste Completo
```bash
# Master
Todas as rotas → ✅ Acesso permitido

# Admin
/admin/* → ✅ Permitido
/master/* → ❌ Negado

# Tipster
/tipster/* → ✅ Permitido
/admin/* → ❌ Negado

# Cliente
/cliente/* → ✅ Permitido
/tipster/* → ❌ Negado
```