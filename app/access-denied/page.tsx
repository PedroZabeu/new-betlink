import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl font-bold text-primary">403</h1>
          <h2 className="text-2xl font-semibold">Acesso Negado</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Você não tem permissão para acessar esta página. 
            Verifique se está logado com a conta correta ou entre em contato com o suporte.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/login">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}