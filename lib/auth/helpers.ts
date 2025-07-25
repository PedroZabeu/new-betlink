// Re-export server-side functions for server components
export { 
  getUserProfile, 
  getAuthenticatedUser,
  getRedirectUrlForRole,
  hasRolePermission,
  canAccessRoute
} from './server';

// Re-export client-side functions for client components
export { 
  createClient,
  getRedirectUrlForRole as getRedirectUrlForRoleClient,
  hasRolePermission as hasRolePermissionClient,
  canAccessRoute as canAccessRouteClient
} from './client';

// Re-export types
export type { UserRole, UserProfile, AuthUser } from './types';
export { roleRoutes, roleHierarchy, protectedRoutes } from './types';