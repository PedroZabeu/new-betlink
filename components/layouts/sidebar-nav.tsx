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
  BarChart3,
  UserCheck,
  Shield,
  Settings
} from "lucide-react";
import type { UserRole } from "@/lib/auth/types";

interface SidebarNavProps {
  userRole: UserRole;
  onNavigate?: () => void;
  items?: NavItem[];
}

interface NavItem {
  title: string;
  href: string;
  icon: string;
}

// Icon mapping
const iconMap = {
  LayoutDashboard,
  CreditCard,
  FileText,
  User,
  Hash,
  Users,
  BarChart3,
  UserCheck,
  Shield,
  Settings,
};

const clientNavItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/cliente/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Minhas Assinaturas",
    href: "/cliente/assinaturas",
    icon: "CreditCard",
  },
  {
    title: "Histórico",
    href: "/cliente/historico",
    icon: "FileText",
  },
];

const tipsterNavItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/tipster/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Meus Canais",
    href: "/tipster/canais",
    icon: "Hash",
  },
  {
    title: "Assinantes",
    href: "/tipster/assinantes",
    icon: "Users",
  },
  {
    title: "Métricas",
    href: "/tipster/metricas",
    icon: "BarChart3",
  },
];

const getAdminNavItems = (userRole: UserRole): NavItem[] => [
  { title: "Visão Geral", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { title: "Tipsters", href: "/admin/tipsters", icon: "Users" },
  { title: "Clientes", href: "/admin/clientes", icon: "UserCheck" },
  { title: "Canais", href: "/admin/canais", icon: "Hash" },
  // Show "Administradores" only for master role
  ...(userRole === "master"
    ? [{ title: "Administradores", href: "/admin/admins", icon: "Shield" }]
    : []),
  { title: "Configurações", href: "/admin/configuracoes", icon: "Settings" },
];

export function SidebarNav({ userRole, onNavigate, items }: SidebarNavProps) {
  const pathname = usePathname();
  
  // Determine which nav items to show based on current path or provided items
  const isTipsterArea = pathname.startsWith('/tipster');
  const isAdminArea = pathname.startsWith('/admin');
  
  const navItems = items || (
    isAdminArea ? getAdminNavItems(userRole) :
    isTipsterArea ? tipsterNavItems : 
    clientNavItems
  );
  const areaTitle = isAdminArea ? "Painel Administrativo" : isTipsterArea ? "Dashboard Tipster" : "Dashboard";

  return (
    <div className="flex h-full w-full flex-col bg-background border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{areaTitle}</h2>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || User;
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
      <div className="border-t p-4 space-y-2">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <User className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {userRole === 'tipster' && isTipsterArea ? 'Tipster' : 
               userRole === 'cliente' && !isTipsterArea ? 'Cliente' : 
               userRole === 'admin' ? 'Admin' :
               userRole === 'master' ? 'Master' :
               userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              {userRole === 'admin' ? 'Administrador' : 
               userRole === 'master' ? 'Master Admin' : 
               userRole === 'tipster' ? 'Tipster' : 'Cliente'}
            </span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="space-y-1">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/auth/logout"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <User className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </div>
    </div>
  );
}