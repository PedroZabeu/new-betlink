import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/helpers";
import { ClientLayout } from "@/components/layouts/client-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and get user profile
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // Only admin and master can access admin area
  const allowedRoles = ["admin", "master"];
  if (!allowedRoles.includes(profile.role)) {
    redirect("/access-denied");
  }

  // Reuse ClientLayout - it will show admin nav items based on context
  return <ClientLayout userRole={profile.role}>{children}</ClientLayout>;
}