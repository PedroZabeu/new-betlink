"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Saindo...</h2>
        <p className="text-sm text-muted-foreground mt-2">Você está sendo desconectado</p>
      </div>
    </div>
  );
}