import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UserRole, UserProfile, roleRoutes, roleHierarchy, protectedRoutes } from './types';

export async function getUserProfile(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;

  return profile as UserProfile;
}

export function getRedirectUrlForRole(role: UserRole): string {
  return roleRoutes[role] || '/cliente/dashboard';
}

export function hasRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  // Find the most specific route pattern that matches
  const routePatterns = Object.keys(protectedRoutes).sort((a, b) => b.length - a.length);
  
  for (const pattern of routePatterns) {
    if (pathname.startsWith(pattern)) {
      const allowedRoles = protectedRoutes[pattern];
      return allowedRoles.includes(userRole);
    }
  }
  
  // If no protected route pattern matches, allow access
  return true;
}

export async function getAuthenticatedUser() {
  const profile = await getUserProfile();
  
  if (!profile) {
    return { authenticated: false, profile: null };
  }
  
  return { authenticated: true, profile };
} 