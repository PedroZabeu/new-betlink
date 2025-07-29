import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogCTASection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Aprenda com os Especialistas
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Dicas, estratégias e análises no nosso blog
          </p>
          <Button size="lg" asChild>
            <Link href="/blog">
              Explorar Blog
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}