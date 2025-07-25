export type UserRole = 'master' | 'admin' | 'tipster' | 'cliente';

export interface UserProfile {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  profile?: UserProfile;
}

// Role-based route configurations
export const roleRoutes: Record<UserRole, string> = {
  master: '/admin/dashboard',
  admin: '/admin/dashboard',
  tipster: '/tipster/dashboard',
  cliente: '/cliente/dashboard'
};

// Role hierarchy for permission checking
export const roleHierarchy: Record<UserRole, number> = {
  master: 4,
  admin: 3,
  tipster: 2,
  cliente: 1
};

// Protected route patterns by role
export const protectedRoutes: Record<string, UserRole[]> = {
  '/master': ['master'],
  '/admin': ['master', 'admin'],
  '/tipster': ['master', 'admin', 'tipster'],
  '/cliente': ['master', 'admin', 'tipster', 'cliente']
};