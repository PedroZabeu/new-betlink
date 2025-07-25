# Task: Feature 1.2 - Database Setup and Test Users Creation

**Priority**: HIGH - Blocking all subsequent features
**Estimated Time**: 20 minutes
**Dependencies**: Supabase MCP must be configured

## Context
We're implementing the role-based authentication system for BetLink. All users who sign up will automatically get the 'cliente' role. We need you to:
1. Execute the database migration
2. Create test users for each role directly in Supabase
3. Update their roles via SQL

**IMPORTANT**: Do NOT start until authorized by the user. We are still in planning phase.

## Task 1: Execute Database Migration (5 min)

After Claude creates the migration file at `/mnt/c/Users/pedro/Projetos/new-betlink/supabase/migrations/001_create_profiles.sql`, please:

1. **Execute the migration using Supabase MCP**:
   ```
   Use your Supabase MCP to run the migration
   The SQL file will be at: /mnt/c/Users/pedro/Projetos/new-betlink/supabase/migrations/001_create_profiles.sql
   ```

2. **Verify the migration succeeded**:
   - Check that the `profiles` table was created
   - Check that the `user_role` enum type exists with values: 'master', 'admin', 'tipster', 'cliente'
   - Check that the trigger `on_auth_user_created` exists
   - Check that RLS is enabled on the profiles table

3. **Test the trigger manually**:
   ```sql
   -- Try creating a test user in Supabase dashboard
   -- Verify that a corresponding profile is created automatically
   ```

## Task 2: Create Test Users via Supabase MCP (10 min)

**IMPORTANT**: Create users directly through Supabase MCP, not through the signup form.

1. **Create these users in auth.users table**:
   ```
   Email: master@betlink.com    | Password: Master123!
   Email: admin@betlink.com     | Password: Admin123!
   Email: tipster@betlink.com   | Password: Tipster123!
   Email: cliente@betlink.com   | Password: Cliente123!
   ```

2. **After users are created, update their roles in profiles table**:
   ```sql
   -- Execute these SQL commands via Supabase MCP
   UPDATE profiles SET role = 'master' WHERE id = (SELECT id FROM auth.users WHERE email = 'master@betlink.com');
   UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@betlink.com');
   UPDATE profiles SET role = 'tipster' WHERE id = (SELECT id FROM auth.users WHERE email = 'tipster@betlink.com');
   -- Note: cliente@betlink.com will already have 'cliente' role from the trigger
   ```

3. **Verify each user has correct role**:
   ```sql
   SELECT u.email, p.role 
   FROM auth.users u 
   JOIN profiles p ON u.id = p.id 
   ORDER BY p.role;
   ```

## Task 3: Create Test Credentials Documentation (3 min)

Create a secure documentation file at: `/mnt/c/Users/pedro/Projetos/new-betlink/docs/test-credentials.md`

```markdown
# Test Credentials - BetLink

## ⚠️ DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION

### Master User
- Email: master@betlink.com
- Password: Master123!
- Role: master
- Access: Full system access

### Admin User
- Email: admin@betlink.com
- Password: Admin123!
- Role: admin
- Access: Admin dashboard, user management

### Tipster User
- Email: tipster@betlink.com
- Password: Tipster123!
- Role: tipster
- Access: Tipster dashboard, channel management

### Client User
- Email: cliente@betlink.com
- Password: Cliente123!
- Role: cliente
- Access: Client dashboard, subscriptions

## Notes
- All users created directly in Supabase
- Roles manually updated via SQL (except cliente)
- Passwords follow pattern: Role123!
```

## Task 4: Report Back (2 min)

Create a status report at: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/status-20250125-feature-1.2-complete.md`

Include:
- ✅/❌ Migration executed successfully
- ✅/❌ All 4 test users created
- ✅/❌ Roles updated correctly
- ✅/❌ Each user can login
- ✅/❌ Test credentials documented
- List any errors or issues

## Expected Outcome

After completion:
- Database has profiles table with role enum
- Trigger automatically creates profiles as 'cliente' for new signups
- 4 test users exist with different roles
- Each user can login and will be redirected to their specific dashboard
- Test credentials are documented

## Important Notes

- **DO NOT** start until user authorizes (still in planning phase)
- **DO NOT** modify the SQL migration after execution
- Create users directly via Supabase MCP, not through signup form
- The trigger will always create new users as 'cliente'
- Only update roles via direct SQL for test users
- Keep the Supabase dashboard open to monitor changes

---

**Wait for user authorization before starting**