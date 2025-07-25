"use client";

import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserRole } from "@/lib/auth/types";

interface ClientLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export function ClientLayout({ children, userRole }: ClientLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[200px] flex-col fixed inset-y-0 z-50">
        <SidebarNav userRole={userRole} />
      </aside>

      {/* Mobile Header with Menu */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[200px]">
            <SidebarNav userRole={userRole} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-[200px] pt-16 md:pt-0">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}