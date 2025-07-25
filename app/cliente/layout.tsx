import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/helpers";
import { ClientLayout } from "@/components/layouts/client-layout";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and get user profile
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // Check if user has permission to access client area
  // Only cliente, admin and master can access client area
  // Tipsters have their own separate area
  const allowedRoles = ["cliente", "admin", "master"];
  if (!allowedRoles.includes(profile.role)) {
    redirect("/access-denied");
  }

  return <ClientLayout userRole={profile.role}>{children}</ClientLayout>;
}