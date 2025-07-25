# Feature 1.2: Database Schema + Auth Pages - Test Guide

## Overview
Este guia detalha todos os testes necessários para validar a Feature 1.2. Siga os passos em ordem para garantir que o sistema de autenticação e roles está funcionando corretamente.

## Pré-requisitos
- [ ] Servidor Next.js rodando (`npm run dev`)
- [ ] Acesso ao Supabase Dashboard
- [ ] Migrations aplicadas (001 e 002)
- [ ] Variáveis de ambiente configuradas

## Test Suite

### 1. Database Schema Validation

#### Test 1.1: Verificar Estrutura
```sql
-- No Supabase SQL Editor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles';
```

**Expected Result:**
- id (uuid, NO)
- role (user_role, NO) 
- created_at (timestamp, YES)
- updated_at (timestamp, YES)

#### Test 1.2: Verificar Enum
```sql
SELECT enum_range(NULL::user_role);
```

**Expected Result:**
- {master,admin,tipster,cliente}

#### Test 1.3: Verificar RLS Policies
```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles';
```

**Expected Result:**
- Users can view own profile (SELECT)
- Users can update own profile (UPDATE)
- Trigger can insert profiles (INSERT)

### 2. Signup Flow Testing

#### Test 2.1: Criar Novo Usuário
1. Navigate to: http://localhost:3001/auth/sign-up
2. Fill form:
   - Email: testuser@betlink.com
   - Password: TestUser123!
3. Submit

**Expected Results:**
- [ ] No errors displayed
- [ ] Redirected to success page
- [ ] User appears in auth.users
- [ ] Profile created with role 'cliente'

#### Test 2.2: Verificar Profile Criado
```sql
SELECT u.email, p.role, p.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'testuser@betlink.com';
```

**Expected Result:**
- Role should be 'cliente'

### 3. Login & Redirect Testing

#### Test 3.1: Login Cliente
1. Navigate to: http://localhost:3001/auth/login
2. Login: newcliente@betlink.com / NewCliente123!
3. Submit

**Expected Results:**
- [ ] Login successful
- [ ] Redirected to /cliente/dashboard
- [ ] URL shows /cliente/dashboard (even if 404)

#### Test 3.2: Login Tipster
1. Logout first
2. Login: newtipster@betlink.com / NewTipster123!

**Expected Results:**
- [ ] Redirected to /tipster/dashboard

#### Test 3.3: Login Admin
1. Logout first
2. Login: newadmin@betlink.com / NewAdmin123!

**Expected Results:**
- [ ] Redirected to /admin/dashboard

#### Test 3.4: Login Master
1. Logout first
2. Login: newmaster@betlink.com / NewMaster123!

**Expected Results:**
- [ ] Redirected to /master/dashboard

### 4. Access Control Testing

#### Test 4.1: Cliente Access
Login as: newcliente@betlink.com

Try accessing:
- [ ] /cliente/dashboard - Expected: 404 (page not exists)
- [ ] /tipster/dashboard - Expected: Redirect to /access-denied
- [ ] /admin/dashboard - Expected: Redirect to /access-denied
- [ ] /master/dashboard - Expected: Redirect to /access-denied

#### Test 4.2: Tipster Access
Login as: newtipster@betlink.com

Try accessing:
- [ ] /tipster/dashboard - Expected: 404
- [ ] /cliente/dashboard - Expected: 404
- [ ] /admin/dashboard - Expected: Redirect to /access-denied
- [ ] /master/dashboard - Expected: Redirect to /access-denied

#### Test 4.3: Admin Access
Login as: newadmin@betlink.com

Try accessing:
- [ ] /admin/dashboard - Expected: 404
- [ ] /tipster/dashboard - Expected: 404
- [ ] /cliente/dashboard - Expected: 404
- [ ] /master/dashboard - Expected: Redirect to /access-denied

#### Test 4.4: Master Access
Login as: newmaster@betlink.com

Try accessing:
- [ ] /master/dashboard - Expected: 404
- [ ] /admin/dashboard - Expected: 404
- [ ] /tipster/dashboard - Expected: 404
- [ ] /cliente/dashboard - Expected: 404

### 5. Edge Cases Testing

#### Test 5.1: Invalid Login
Try login with wrong password:
- Email: newcliente@betlink.com
- Password: WrongPassword

**Expected Result:**
- [ ] Error message displayed
- [ ] Stay on login page

#### Test 5.2: Non-existent User
Try login with:
- Email: notexist@betlink.com
- Password: Any123!

**Expected Result:**
- [ ] "Invalid login credentials"

#### Test 5.3: Logout Flow
1. Login as any user
2. Click logout

**Expected Results:**
- [ ] Redirected to /auth/login
- [ ] Cannot access protected routes

### 6. Database Integrity

#### Test 6.1: Trigger Function
```sql
-- Check trigger exists
SELECT tgname FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

#### Test 6.2: Updated At Trigger
```sql
-- Update a profile
UPDATE profiles 
SET role = 'cliente' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'newcliente@betlink.com');

-- Check updated_at changed
SELECT updated_at FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'newcliente@betlink.com');
```

## Test Checklist Summary

### Core Functionality
- [ ] Signup creates user as 'cliente'
- [ ] Login works for all roles
- [ ] Redirect based on role works
- [ ] Logout clears session

### Access Control
- [ ] Cliente blocked from other dashboards
- [ ] Tipster blocked from admin/master
- [ ] Admin blocked from master
- [ ] Master can access everything

### Database
- [ ] Profiles table structure correct
- [ ] RLS policies active
- [ ] Triggers functioning
- [ ] Foreign key constraints work

## Common Issues & Solutions

### Issue: "Database error saving new user"
**Cause**: Missing INSERT policy
**Solution**: Apply migration 002

### Issue: "Invalid login credentials"
**Cause**: User created via SQL
**Solution**: Create user via signup UI

### Issue: Import errors in build
**Cause**: Mixing client/server code
**Solution**: Use separate files

## Test Credentials

All test users use pattern:
- Email: new[role]@betlink.com
- Password: New[Role]123!

Current test users:
1. newmaster@betlink.com
2. newadmin@betlink.com
3. newtipster@betlink.com
4. newcliente@betlink.com

---

**Important**: All dashboard pages return 404 in Feature 1.2. This is expected as pages will be created in Feature 1.3.