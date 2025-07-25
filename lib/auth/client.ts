import { createBrowserClient } from '@supabase/ssr';
import { UserRole, roleRoutes, roleHierarchy, protectedRoutes } from './types';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getRedirectUrlForRole(role: UserRole): string {
  return roleRoutes[role] || '/cliente/dashboard';
}

export const getRedirectUrlForRoleClient = getRedirectUrlForRole;

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