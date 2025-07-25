# Task: Feature 1.1 - Cleanup and Structure Setup

## Context
Claude has already implemented:
- New landing page at `/app/page.tsx`
- Header component at `/components/header.tsx`
- BetLink logo at `/components/betlink-logo.tsx`
- User navigation dropdown at `/components/user-nav.tsx`
- Error pages at `/app/error/page.tsx` and `/app/access-denied/page.tsx`

## Your Task

### 1. Delete Tutorial Components
Remove these files that are no longer needed:
- `/components/hero.tsx`
- `/components/deploy-button.tsx`
- `/components/next-logo.tsx`
- `/components/supabase-logo.tsx`
- `/components/env-var-warning.tsx` (if not used elsewhere)
- All files in `/components/tutorial/` directory

### 2. Create Folder Structure
Create these directories with empty page.tsx files containing just a TODO comment:
```
/app/cliente/
/app/tipster/
/app/admin/
/app/master/
```

Example content for each page.tsx:
```tsx
export default function Page() {
  return <div>TODO: Implement this page</div>;
}
```

### 3. Verify Build
Run these commands and report results:
```bash
npm run build
npm run lint
```

### 4. Check for Broken Imports
After deleting files, verify no components are importing the deleted files.

## Expected Output
Create `.claude-instructions/status-20250124-feature-1-1-cleanup.md` with:

1. **Deleted Files** (list all deleted files)
2. **Created Directories** (list all created directories)
3. **Build Status** (✅ or ❌ with error details)
4. **Lint Status** (✅ or ❌ with warnings)
5. **Any Issues Found**

## Time Estimate
15-20 minutes

## Important
- Use MCP tools for file operations when available
- Don't modify any of Claude's implemented components
- Just cleanup and prepare structure