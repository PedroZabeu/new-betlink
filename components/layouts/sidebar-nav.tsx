"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText,
  User,
  Hash,
  Users,
  BarChart3
} from "lucide-react";
import type { UserRole } from "@/lib/auth/types";

interface SidebarNavProps {
  userRole: UserRole;
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const clientNavItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/cliente/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Minhas Assinaturas",
    href: "/cliente/assinaturas",
    icon: CreditCard,
  },
  {
    title: "Histórico",
    href: "/cliente/historico",
    icon: FileText,
  },
];

const tipsterNavItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/tipster/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Meus Canais",
    href: "/tipster/canais",
    icon: Hash,
  },
  {
    title: "Assinantes",
    href: "/tipster/assinantes",
    icon: Users,
  },
  {
    title: "Métricas",
    href: "/tipster/metricas",
    icon: BarChart3,
  },
];

export function SidebarNav({ userRole, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  
  // Determine which nav items to show based on current path
  const isTipsterArea = pathname.startsWith('/tipster');
  const navItems = isTipsterArea ? tipsterNavItems : clientNavItems;
  const areaTitle = isTipsterArea ? "Dashboard Tipster" : "Dashboard";

  return (
    <div className="flex h-full w-full flex-col bg-background border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{areaTitle}</h2>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User info section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {userRole === 'tipster' && isTipsterArea ? 'Tipster' : 
               userRole === 'cliente' && !isTipsterArea ? 'Cliente' : 
               userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              {userRole === 'admin' ? 'Administrador' : 
               userRole === 'master' ? 'Master' : 
               userRole === 'tipster' ? 'Tipster' : 'Cliente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}