"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";

interface AuthStepProps {
  onNext: () => void;
  updateCheckoutData: (key: string, data: any) => void;
}

const FEATURE_NAME = '[Feature 2.13: Auth Step]';

export function AuthStep({ onNext, updateCheckoutData }: AuthStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        logger.info(`${FEATURE_NAME} Login successful`, {
          userId: data.user.id,
          email: data.user.email
        });

        updateCheckoutData('user', {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name,
        });

        toast.success("Login realizado com sucesso!");
        onNext();
      }
    } catch (error: any) {
      logger.error(`${FEATURE_NAME} Login failed`, error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== repeatPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/checkout/${window.location.pathname.split('/').pop()}`,
        },
      });

      if (error) throw error;

      if (data.user) {
        logger.info(`${FEATURE_NAME} Signup successful`, {
          userId: data.user.id,
          email: data.user.email
        });

        updateCheckoutData('user', {
          id: data.user.id,
          email: data.user.email || '',
          name: name,
        });

        toast.success("Conta criada com sucesso! Verifique seu email.");
        onNext();
      }
    } catch (error: any) {
      logger.error(`${FEATURE_NAME} Signup failed`, error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faça login ou crie sua conta</CardTitle>
        <CardDescription>
          Para continuar com a assinatura, você precisa estar conectado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Já tenho conta</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-login">Senha</Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-signup">Senha</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repeat-password">Repetir senha</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}