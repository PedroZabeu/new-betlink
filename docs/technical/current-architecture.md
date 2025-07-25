# Current Architecture Documentation

## Project Overview
BetLink is a Next.js 15 application with Supabase backend, implementing a role-based betting tips platform.

## Technology Stack

### Frontend
- **Framework**: Next.js 15.4.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui patterns
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase Client + Server Actions
- **Middleware**: Next.js Middleware for route protection

### Development Tools
- **Linting**: ESLint with TypeScript rules
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## Project Structure

```
new-betlink/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── ...
│   ├── cliente/                  # Client dashboard (TODO)
│   ├── tipster/                  # Tipster dashboard (TODO)
│   ├── admin/                    # Admin dashboard (TODO)
│   ├── master/                   # Master dashboard (TODO)
│   ├── protected/                # Protected routes
│   ├── error/                    # Error handling
│   └── access-denied/            # Access control
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── auth-button.tsx           # Authentication controls
│   ├── header.tsx                # Main navigation
│   ├── betlink-logo.tsx          # Branding
│   ├── landing-hero.tsx          # Landing page hero
│   └── user-nav.tsx              # User navigation
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── middleware.ts         # Middleware Supabase
│   └── utils.ts                  # General utilities
├── middleware.ts                 # Next.js middleware
└── docs/                         # Documentation
```

## Authentication Flow

### Current Implementation
1. **User Registration**: `/app/auth/sign-up/`
2. **User Login**: `/app/auth/login/`
3. **Password Reset**: `/app/auth/forgot-password/`
4. **Email Confirmation**: `/app/auth/confirm/`
5. **Protected Routes**: Middleware-based protection

### Authentication Components
- `AuthButton`: Handles login/logout state
- `UserNav`: User dropdown with profile options
- `LoginForm`: Login form with validation
- `SignUpForm`: Registration form with validation
- `ForgotPasswordForm`: Password reset form

## Routing Structure

### Public Routes
- `/` - Landing page
- `/auth/*` - Authentication pages
- `/error` - Error page
- `/access-denied` - Access denied page

### Protected Routes
- `/protected/*` - General protected content
- `/cliente/*` - Client dashboard (TODO)
- `/tipster/*` - Tipster dashboard (TODO)
- `/admin/*` - Admin dashboard (TODO)
- `/master/*` - Master dashboard (TODO)

### Middleware Protection
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Route protection logic
  // Role-based access control (TODO)
}
```

## Component Architecture

### UI Component Pattern
All UI components follow a consistent pattern:
```typescript
interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX implementation
  );
}
```

### Component Categories
1. **Base UI Components** (`/components/ui/`)
   - Reusable, unstyled components
   - Follow shadcn/ui patterns
   - Highly composable

2. **Feature Components** (`/components/`)
   - Business logic components
   - Authentication, navigation, etc.
   - Use base UI components

3. **Page Components** (`/app/*/page.tsx`)
   - Route-specific components
   - Server-side rendering
   - Data fetching

## Database Schema (Current)

### Authentication Tables (Supabase)
- `auth.users` - User accounts
- `auth.sessions` - User sessions
- `auth.identities` - User identities

### Custom Tables (TODO)
- `user_roles` - Role assignments
- `tips` - Betting tips
- `followers` - User relationships
- `analytics` - Performance tracking

## State Management

### Current Approach
- **Server State**: Supabase queries and mutations
- **Client State**: React useState/useReducer
- **Form State**: React Hook Form (TODO)
- **Global State**: Context API (if needed)

### Planned Improvements
- Implement React Query for server state
- Add form validation with React Hook Form
- Consider Zustand for complex client state

## Styling System

### Tailwind CSS Configuration
- Custom color palette
- Responsive design utilities
- Dark mode support
- Component-specific styles

### Design Tokens
```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      // Custom utilities
    }
  }
}
```

## Performance Considerations

### Current Optimizations
- Next.js App Router optimizations
- Image optimization with Next.js
- Font optimization
- Bundle splitting

### Planned Optimizations
- Implement React Query caching
- Add service worker for offline support
- Optimize database queries
- Implement lazy loading for components

## Security Measures

### Current Security
- Supabase Row Level Security (RLS)
- Middleware-based route protection
- Input validation (basic)
- HTTPS enforcement

### Planned Security
- Role-based access control (RBAC)
- Input sanitization
- Rate limiting
- Audit logging
- Data encryption

## Development Workflow

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting (TODO)
- Husky pre-commit hooks (TODO)

### Testing Strategy
- Unit tests with Jest (TODO)
- Integration tests (TODO)
- E2E tests with Playwright (TODO)
- Component testing with React Testing Library (TODO)

## Deployment

### Current Setup
- Development: Local Next.js server
- Production: Vercel (planned)
- Database: Supabase cloud

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Monitoring & Analytics

### Current Monitoring
- Next.js built-in error reporting
- Supabase dashboard monitoring

### Planned Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Database performance monitoring

## Future Considerations

### Scalability
- Microservices architecture (if needed)
- CDN implementation
- Database sharding
- Caching strategies

### Feature Roadmap
- Real-time notifications
- Mobile app development
- API rate limiting
- Advanced analytics
- Payment integration

---

**Last Updated**: January 24, 2025
**Status**: Feature 1.1 Complete, Ready for Feature 1.2 