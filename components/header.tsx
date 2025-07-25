import Link from "next/link";
import { BetlinkLogo } from "./betlink-logo";
import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BetlinkLogo />
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/canais" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Explorar Canais
              </Link>
              <Link 
                href="/sobre" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sobre
              </Link>
              <Link 
                href="/blog" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
}