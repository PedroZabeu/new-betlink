# Initial Setup - Next.js with Supabase Starter

## Creation Command
```bash
npx create-next-app -e with-supabase
```

## What This Starter Provides

### 1. Core Technologies
- **Next.js 15.1.0** - Latest version with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5** - Full type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (Auth + Database)

### 2. Pre-configured Features

#### Authentication System
- Complete auth flow (login, signup, password reset)
- Email confirmation setup
- Protected routes with middleware
- Session management via cookies
- Auth pages located in `/app/auth/`:
  - `/auth/login` - Login page
  - `/auth/sign-up` - Registration page
  - `/auth/forgot-password` - Password reset
  - `/auth/update-password` - Update password
  - `/auth/sign-up-success` - Post-registration page
  - `/auth/error` - Error handling page

#### Supabase Integration
- Three client configurations:
  - `lib/supabase/client.ts` - Browser client
  - `lib/supabase/server.ts` - Server components client
  - `lib/supabase/middleware.ts` - Session refresh middleware
- Environment variables structure ready
- Automatic session refresh on every request

#### UI Components
- **shadcn/ui** pre-configured with New York style
- Dark mode support via `next-themes`
- Pre-built components:
  - Auth forms (login, signup)
  - Navigation with auth state
  - Theme switcher
  - Tutorial components

#### Development Setup
- Turbopack enabled for faster builds
- ESLint configured
- Path aliases configured (`@/*`)
- Environment variable checking

### 3. File Structure
```
new-betlink/
├── app/                      # Next.js App Router
│   ├── auth/                # Authentication pages
│   ├── protected/           # Protected route example
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── tutorial/           # Tutorial components
│   └── auth components     # Auth-related components
├── lib/                     # Utilities
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Helper functions
├── middleware.ts            # Auth session middleware
└── Configuration files      # Various config files
```

### 4. Key Implementation Details

#### Middleware Setup
- Runs on all routes except static assets
- Refreshes auth tokens automatically
- Protects routes by checking user session
- Redirects unauthenticated users to login

#### Cookie-based Auth
- Uses `@supabase/ssr` for server-side auth
- Cookies managed through middleware
- Works across Client/Server Components

#### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=<your_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```

### 5. Default Behavior
- Public home page with tutorial
- Protected `/protected` route
- Auth flows fully functional
- Email confirmation required (default)
- Dark/light mode toggle

### 6. What's NOT Included
- User profiles table
- Role-based access control
- Custom user metadata
- API routes (besides auth)
- Database schema
- RLS policies
- Payment integration
- Advanced features

This starter provides a solid foundation for building authenticated Next.js applications with Supabase, handling the complex parts of auth flow and session management out of the box.