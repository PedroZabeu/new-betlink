# Task: Fix Critical INSERT Policy Issue & Complete Testing

**Priority**: CRITICAL - Blocking user registration
**Estimated Time**: 15-20 minutes
**Context**: Users cannot sign up because the trigger function cannot insert profiles due to missing RLS policy

## IMPORTANT: Document EVERYTHING
Create screenshots or detailed notes for each test step. We need complete documentation of all results.

## Task 1: Execute Fix Migration (2 min)

A new migration file has been created to fix the critical issue:
`/mnt/c/Users/pedro/Projetos/new-betlink/supabase/migrations/002_fix_profiles_insert_policy.sql`

Please:
1. **Execute this migration immediately** using Supabase MCP
2. **Verify the policy was created** by checking policies on the profiles table
3. **Confirm no errors** during execution

## Task 2: Test User Registration - DETAILED (10 min)

### Test 2.1: Create New User via Signup
1. **Navigate to**: http://localhost:3001/auth/sign-up
2. **Create user**: 
   - Email: `testnovo@betlink.com`
   - Password: `TestNovo123!`
3. **Document**:
   - ✅/❌ Signup form submitted without errors?
   - ✅/❌ User redirected to success page?
   - ✅/❌ User appears in auth.users table?
   - ✅/❌ Profile created in profiles table with role 'cliente'?
   - Error messages (if any):

### Test 2.2: Test Login with New User
1. **Navigate to**: http://localhost:3001/auth/login
2. **Login with**: testnovo@betlink.com / TestNovo123!
3. **Document**:
   - ✅/❌ Login successful?
   - ✅/❌ Redirected to /cliente/dashboard?
   - Current URL after login:
   - Error messages (if any):

### Test 2.3: Create Test Users for Each Role
Create these users via SIGNUP (not database):

| Email | Password | Expected Role |
|-------|----------|--------------|
| testmaster@betlink.com | TestMaster123! | master (update via SQL) |
| testadmin@betlink.com | TestAdmin123! | admin (update via SQL) |
| testtipster@betlink.com | TestTipster123! | tipster (update via SQL) |
| testcliente@betlink.com | TestCliente123! | cliente (default) |

**For each user above**:
1. Create via signup form
2. Document success/failure
3. Note any errors

### Test 2.4: Update Roles via SQL
After creating all users, update roles:
```sql
UPDATE profiles SET role = 'master' WHERE id = (SELECT id FROM auth.users WHERE email = 'testmaster@betlink.com');
UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'testadmin@betlink.com');
UPDATE profiles SET role = 'tipster' WHERE id = (SELECT id FROM auth.users WHERE email = 'testtipster@betlink.com');
```

**Document**:
- ✅/❌ All role updates successful?
- Any SQL errors?

## Task 3: Test Login for Each Role (5 min)

### CRITICAL: Test each user login and document results

For EACH test user (testmaster, testadmin, testtipster, testcliente):

1. **Logout** if currently logged in
2. **Navigate to**: http://localhost:3001/auth/login
3. **Login** with user credentials
4. **Document**:
   - User: [email]
   - ✅/❌ Login successful?
   - ✅/❌ Redirected to correct dashboard?
   - Expected URL: [/master/dashboard, /admin/dashboard, etc]
   - Actual URL: [where did it redirect?]
   - ✅/❌ Can access their dashboard?
   - ✅/❌ Blocked from other role dashboards?
   - Error messages (if any):

### Test Access Control
For each logged-in user, try to access OTHER dashboards:
- Master trying /admin/dashboard - Expected: ✅ Allow
- Master trying /tipster/dashboard - Expected: ✅ Allow  
- Master trying /cliente/dashboard - Expected: ✅ Allow
- Admin trying /master/dashboard - Expected: ❌ Block (redirect to /access-denied)
- Admin trying /tipster/dashboard - Expected: ✅ Allow
- Admin trying /cliente/dashboard - Expected: ✅ Allow
- Tipster trying /master/dashboard - Expected: ❌ Block
- Tipster trying /admin/dashboard - Expected: ❌ Block
- Cliente trying /master/dashboard - Expected: ❌ Block
- Cliente trying /admin/dashboard - Expected: ❌ Block
- Cliente trying /tipster/dashboard - Expected: ❌ Block

## Task 4: Create Comprehensive Test Report

Create a detailed test report at:
`/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/status-20250125-complete-test-results.md`

### Report Structure:
```markdown
# Feature 1.2 - Complete Test Results

## Migration Fix
- ✅/❌ Migration 002 executed successfully
- ✅/❌ INSERT policy created

## User Creation Tests
### Test User 1: testnovo@betlink.com
- Signup: ✅/❌
- Profile created: ✅/❌
- Login works: ✅/❌
- Redirected to: _____

### Test User 2: testmaster@betlink.com
- Signup: ✅/❌
- Role updated to master: ✅/❌
- Login works: ✅/❌
- Redirected to: _____
- Can access /master/dashboard: ✅/❌
- Can access /admin/dashboard: ✅/❌

[Continue for all users...]

## Access Control Tests
[Document all access control test results]

## Overall Status
- All tests passed: ✅/❌
- Critical issues: _____
- Feature 1.2 Complete: ✅/❌
```

## Expected Outcome

After all tests:
- ✅ Users can successfully sign up
- ✅ New users get 'cliente' role automatically  
- ✅ Login redirects to correct dashboard based on role
- ✅ Access control blocks unauthorized routes
- ✅ All authentication flows work properly
- ✅ Complete documentation of all test results

## Important Notes

1. **Take screenshots** or copy exact error messages
2. **Test EVERY scenario** - don't skip any
3. **Document ACTUAL results**, not expected
4. **If something fails**, note the exact behavior
5. **Test in order** - migration first, then signup, then login

---

**This is a critical fix and comprehensive test - please execute immediately and document everything!**