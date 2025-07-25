# Task: Debug Authentication Issue

**Priority**: CRITICAL - All authentication is broken
**Context**: Even users who previously logged in successfully cannot authenticate anymore

## Issue Summary
- User `pedro.zabeu.bets@gmail.com` has `last_sign_in_at` timestamp (previously worked)
- Now getting "Invalid login credentials" for ALL users
- This suggests a configuration issue, not just a code issue

## Task 1: Check Supabase Dashboard Settings

Please check in the Supabase Dashboard:

1. **Go to Authentication > Providers**
   - Is Email provider enabled? ✅/❌
   - Are there any error messages?

2. **Go to Authentication > Email Templates**
   - Are all templates configured correctly?
   - Is email confirmation required? (Should be NO for testing)

3. **Go to Settings > API**
   - Copy the `anon` key and compare with `.env.local`
   - Are they EXACTLY the same? ✅/❌
   - Copy the service role key (we won't use it in code, just for reference)

4. **Go to Authentication > Users**
   - Click on `pedro.zabeu.bets@gmail.com`
   - What is the status? (confirmed/unconfirmed)
   - Are there any error logs?

## Task 2: Test Authentication via Supabase Dashboard

1. **Try to create a new user in dashboard**:
   - Go to Authentication > Users
   - Click "Add user"
   - Email: `dashtest@betlink.com`
   - Password: `DashTest123!`
   - Auto confirm: YES
   - Did it work? ✅/❌

2. **Try to login with dashboard-created user**:
   - Go to http://localhost:3001/auth/login
   - Use: dashtest@betlink.com / DashTest123!
   - Does it work? ✅/❌

## Task 3: Check Auth Configuration

Run these SQL queries in Supabase SQL Editor:

```sql
-- Check if email auth is enabled
SELECT * FROM auth.providers WHERE provider = 'email';

-- Check auth configuration
SELECT * FROM auth.config;

-- Check if there are any auth restrictions
SELECT * FROM auth.flow_state;
```

Document the results.

## Task 4: Test Direct API Call

Create a simple test file at `/test-auth.js`:

```javascript
// Test Supabase auth directly
const SUPABASE_URL = 'https://ohnuaxnygsnkupmoimtq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obnVheG55Z3Nua3VwbW9pbXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjgwOTYsImV4cCI6MjA2ODk0NDA5Nn0.xVmTzpmia0mNibzH4xFL6TrkZvYw6-RmttfLjsd-cbE';

async function testAuth() {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'apitest@betlink.com',
        password: 'ApiTest123!'
      })
    });

    const data = await response.json();
    console.log('Signup response:', response.status, data);

    // Test login
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'apitest@betlink.com',
        password: 'ApiTest123!'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
```

Run with: `node test-auth.js`

Document the output.

## Task 5: Create Debug Report

Create report at: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/status-20250125-auth-debug.md`

Include:
1. All Supabase dashboard findings
2. API test results
3. Any error messages found
4. Configuration differences
5. Possible root causes

## Possible Issues to Check

1. **Email confirmation required** - If enabled, users can't login until confirmed
2. **API keys mismatch** - Environment variables don't match Supabase project
3. **Auth provider disabled** - Email auth might be turned off
4. **Rate limiting** - Too many failed attempts
5. **Database connection** - RLS policies blocking auth operations

---

**IMPORTANT**: Do NOT use the service_role key in any frontend code. It should only be used in secure backend environments.