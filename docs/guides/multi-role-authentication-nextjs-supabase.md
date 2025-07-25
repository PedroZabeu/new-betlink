# Guia Completo: Sistema de Autenticação Multi-Role com Next.js e Supabase

## Introdução

Este guia mostra como construir um sistema robusto de autenticação com múltiplos roles usando Next.js 15 (App Router) e Supabase, baseado na implementação real do projeto BetLink.

## Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conhecimento básico de Next.js e TypeScript

## 1. Iniciando o Projeto

```bash
npx create-next-app@latest my-app -e with-supabase
cd my-app
```

Este template já vem com:
- Configuração básica do Supabase
- Middleware inicial
- Variáveis de ambiente

## 2. Estrutura do Banco de Dados

### 2.1 Criar Enum de Roles

No Supabase SQL Editor:

```sql
-- Criar tipo enum para roles
CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');

-- Criar tabela profiles que estende auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## 3. Configurando o Middleware

O middleware é o coração do sistema de autenticação multi-role.

### 3.1 Estrutura Base (`/middleware.ts`)

```typescript
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 3.2 Lógica do Middleware (`/lib/supabase/middleware.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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

  // IMPORTANTE: Sempre use getClaims() para manter a sessão
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Rotas públicas
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirecionar não autenticados
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Verificar roles para rotas protegidas
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profile) {
      // Verificar acesso admin
      if (pathname.startsWith('/admin') && profile.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }

      // Adicionar mais verificações conforme necessário
    }
  }

  return supabaseResponse;
}
```

## 4. Helpers de Autenticação

### 4.1 Types (`/lib/auth/types.ts`)

```typescript
export type UserRole = 'admin' | 'user' | 'moderator';

export interface UserProfile {
  id: string;
  role: UserRole;
  name?: string;
  created_at: string;
  updated_at: string;
}

// Rotas por role
export const roleRoutes: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  moderator: '/moderator/dashboard',
  user: '/dashboard'
};
```

### 4.2 Server Helpers (`/lib/auth/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { UserRole, UserProfile } from './types';

export async function getUserProfile(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  const roleHierarchy = {
    admin: 3,
    moderator: 2,
    user: 1
  };

  // Admin pode acessar tudo
  if (userRole === 'admin') return true;
  
  // Verificar rotas específicas
  if (pathname.startsWith('/admin')) {
    return userRole === 'admin';
  }
  
  if (pathname.startsWith('/moderator')) {
    return roleHierarchy[userRole] >= roleHierarchy.moderator;
  }
  
  return true;
}
```

## 5. Layouts com Proteção de Rotas

### 5.1 Layout Admin (`/app/admin/layout.tsx`)

```typescript
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== 'admin') {
    redirect("/unauthorized");
  }

  return (
    <div className="admin-layout">
      <nav>Admin Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
```

## 6. Componente de Login com Redirecionamento por Role

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { roleRoutes, type UserRole } from "@/lib/auth/types";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    // Buscar role do usuário
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        // Redirecionar baseado no role
        const redirectUrl = roleRoutes[profile.role as UserRole];
        router.push(redirectUrl);
      }
    }
  };

  return (
    // Seu formulário aqui
  );
}
```

## 7. Navegação Condicional por Role

```typescript
"use client";

import Link from "next/link";
import { UserRole } from "@/lib/auth/types";

interface NavProps {
  userRole: UserRole;
}

export function Navigation({ userRole }: NavProps) {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      
      {userRole === 'admin' && (
        <Link href="/admin">Admin Panel</Link>
      )}
      
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Link href="/moderator">Moderator Area</Link>
      )}
    </nav>
  );
}
```

## 8. Dicas e Boas Práticas

### 8.1 Sempre Verifique em Múltiplas Camadas
1. **Middleware**: Primeira linha de defesa
2. **Layout**: Segunda verificação
3. **Página**: Verificações específicas se necessário

### 8.2 Use Server Components para Segurança
```typescript
// ✅ Bom - Server Component
export default async function SecretPage() {
  const profile = await getUserProfile();
  if (!profile || profile.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  const secretData = await fetchSecretData();
  return <div>{secretData}</div>;
}

// ❌ Evitar - Client Component
"use client";
export default function SecretPage() {
  // Dados sensíveis expostos ao cliente
}
```

### 8.3 Crie Hooks Customizados

```typescript
// hooks/useAuth.ts
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/auth/types';

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile(data);
      }
      
      setLoading(false);
    };

    getProfile();
  }, []);

  return { profile, loading };
}
```

## 9. Troubleshooting

### Problema: Usuário sendo deslogado aleatoriamente
**Solução**: Sempre use `getClaims()` no middleware em vez de `getUser()`

### Problema: Redirecionamento infinito
**Solução**: Verifique se as rotas públicas estão corretas no middleware

### Problema: Role não atualiza após mudança no banco
**Solução**: Limpe o cache e faça novo login

## 10. Exemplo Completo

Veja o projeto BetLink para um exemplo completo de implementação:
- 4 roles diferentes (master, admin, tipster, cliente)
- Navegação condicional
- Páginas com acesso granular
- Design system completo

## Conclusão

Este sistema fornece:
- ✅ Autenticação robusta
- ✅ Controle granular de acesso
- ✅ Fácil manutenção
- ✅ Escalabilidade
- ✅ Segurança em múltiplas camadas

Com essa base, você pode construir aplicações complexas com diferentes níveis de acesso e permissões.