"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { BetlinkLogo } from "./betlink-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { logger } from "@/lib/utils/logger";
import { cn } from "@/lib/utils";

interface HeaderClientProps {
  authButton: React.ReactNode;
}

export function HeaderClient({ authButton }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/canais", label: "Explorar Canais" },
    { href: "/sobre", label: "Sobre" },
    { href: "/blog", label: "Blog" },
  ];

  const handleNavClick = (href: string) => {
    logger.info('Navegação mobile utilizada', { 
      destination: href,
      timestamp: new Date().toISOString()
    });
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <BetlinkLogo />
            </Link>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={cn(
                      "text-sm font-medium transition-all relative pb-1",
                      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200",
                      isActive 
                        ? "text-primary after:opacity-100" 
                        : "hover:text-primary after:opacity-0 hover:after:opacity-50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {authButton}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BetlinkLogo className="h-6 w-6" />
              <span>Menu</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-4 mt-8">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "flex items-center py-2 text-lg font-medium transition-colors relative",
                    "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:transition-all after:duration-200",
                    isActive 
                      ? "text-primary after:opacity-100" 
                      : "hover:text-primary after:opacity-0 hover:after:opacity-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="h-px bg-border my-2" />
            
            {/* Additional mobile-only links */}
            <Link
              href="/termos"
              onClick={() => handleNavClick('/termos')}
              className="flex items-center py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              onClick={() => handleNavClick('/privacidade')}
              className="flex items-center py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}