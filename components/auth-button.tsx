import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "./user-nav";
import type { UserRole } from "@/lib/auth/types";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Entrar</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Cadastrar</Link>
        </Button>
      </div>
    );
  }

  // Get user profile to determine role and name
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.sub)
    .single();

  const userRole = (profile?.role as UserRole) || "cliente";
  const userName = profile?.name || user.email?.split("@")[0] || "Usuário";

  return <UserNav email={user.email} userName={userName} userRole={userRole} />;
}
