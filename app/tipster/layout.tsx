import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/helpers";
import { ClientLayout } from "@/components/layouts/client-layout";

export default async function TipsterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and get user profile
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // Check if user has permission to access tipster area
  // Only tipster, admin and master can access
  const allowedRoles = ["tipster", "admin", "master"];
  if (!allowedRoles.includes(profile.role)) {
    redirect("/access-denied");
  }

  // Reuse ClientLayout but it will show different nav based on context
  return <ClientLayout userRole={profile.role}>{children}</ClientLayout>;
}