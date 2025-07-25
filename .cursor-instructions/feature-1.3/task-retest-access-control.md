# Task: Re-test Access Control After Fixes

**Priority**: URGENT
**Estimated Time**: 10 minutes

## Context
Fixed access control bugs where:
1. Tipsters could access client area (now blocked)
2. Non-authenticated users could access dashboard (should be blocked)

## Changes Made
- Updated `/app/cliente/layout.tsx` to only allow `["cliente", "admin", "master"]` roles
- Removed "tipster" from allowed roles for client area

## Test Matrix to Verify

Test accessing `/cliente/dashboard`:

| User | Email | Expected Result | Notes |
|------|-------|-----------------|-------|
| Cliente | newcliente@betlink.com | ✅ Access allowed | Should see dashboard |
| Tipster | newtipster@betlink.com | ❌ Redirect to /access-denied | FIXED: Should be blocked now |
| Admin | newadmin@betlink.com | ✅ Access allowed | Should see dashboard |
| Master | newmaster@betlink.com | ✅ Access allowed | Should see dashboard |
| Not logged in | - | ❌ Redirect to /auth/login | Should be blocked |

## Steps to Test

1. **Clear browser data/cookies** to ensure clean test
2. **Test non-authenticated access**:
   - Open incognito/private window
   - Go directly to `http://localhost:3002/cliente/dashboard`
   - Should redirect to `/auth/login`

3. **Test each role**:
   - Login with each user
   - Try to access `/cliente/dashboard`
   - Verify expected behavior

4. **Additional tests**:
   - After Tipster is blocked, verify they can still access `/tipster/dashboard`
   - Verify Cliente cannot access `/tipster/dashboard` or `/admin/dashboard`

## Report Results

Create file: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/access-control-retest-results.md`

Include:
- Test timestamp
- Each test result with screenshots if possible
- Any error messages
- Confirmation that bugs are fixed

## Important
If non-authenticated users can still access the dashboard, we may need to check:
1. Middleware configuration
2. Whether cookies are being properly cleared
3. Server-side caching issues