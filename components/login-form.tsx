"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getRedirectUrlForRoleClient as getRedirectUrlForRole } from "@/lib/auth/client";
import type { UserRole } from "@/lib/auth/types";
import { logger } from "@/lib/utils/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Log tentativa de login
    logger.info('Tentativa de login iniciada', {
      email,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Log erro de autenticação
        logger.warn('Falha na autenticação do login', {
          email,
          error: error.message,
          errorCode: error.code,
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      // Get user profile to determine role
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          // Log falha na busca do perfil
          logger.error('Falha ao buscar perfil do usuário após login', profileError, {
            userId: data.user.id,
            email,
            timestamp: new Date().toISOString()
          });
        }

        if (profile) {
          const redirectUrl = getRedirectUrlForRole(profile.role as UserRole);
          
          // Log login bem-sucedido (audit)
          logger.audit(data.user.id, 'auth.login', 'session', {
            email,
            role: profile.role,
            loginMethod: 'password',
            redirectTo: redirectUrl,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
          });
          
          router.push(redirectUrl);
        } else {
          // Log cenário de fallback
          logger.warn('Perfil não encontrado para usuário, usando redirecionamento padrão', {
            userId: data.user.id,
            email,
            redirectTo: '/cliente/dashboard',
            timestamp: new Date().toISOString()
          });
          // Fallback to cliente dashboard if no profile found
          router.push("/cliente/dashboard");
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      
      // Log erro completo do processo de login
      logger.error('Processo de login falhou', error, {
        email,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Digite seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
