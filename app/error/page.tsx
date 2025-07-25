import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl font-bold text-primary">500</h1>
          <h2 className="text-2xl font-semibold">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encontramos um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contato">Falar com Suporte</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}