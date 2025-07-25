"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";
import type { UserRole } from "@/lib/auth/types";

interface UserNavProps {
  email?: string;
  userName: string;
  userRole: UserRole;
}

export function UserNav({ email, userName, userRole }: UserNavProps) {
  const [open, setOpen] = useState(false);

  // Determine dashboard URL based on user role
  const getDashboardUrl = () => {
    switch (userRole) {
      case "master":
      case "admin":
        return "/admin/dashboard";
      case "tipster":
        return "/tipster/dashboard";
      case "cliente":
      default:
        return "/cliente/dashboard";
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {getInitials(userName)}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={getDashboardUrl()} className="w-full cursor-pointer">
            Minha Conta
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <div className="w-full">
            <LogoutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}