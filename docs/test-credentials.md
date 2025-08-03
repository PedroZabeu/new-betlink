# Test Credentials - BetLink

## ⚠️ DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION

## ✅ Working Test Users (Created via Signup)

These users were created through the signup flow and can authenticate normally:

### Master User
- **Email**: newmaster@betlink.com
- **Password**: NewMaster123!
- **Role**: master
- **Access**: Full system access
- **Dashboard**: `/master/dashboard`
- **Status**: ✅ Working

### Admin User
- **Email**: newadmin@betlink.com
- **Password**: NewAdmin123!
- **Role**: admin
- **Access**: Admin dashboard, user management
- **Dashboard**: `/admin/dashboard`
- **Status**: ✅ Working

### Tipster User
- **Email**: newtipster@betlink.com
- **Password**: NewTipster123!
- **Role**: tipster
- **Access**: Tipster dashboard, channel management
- **Dashboard**: `/tipster/dashboard`
- **Status**: ✅ Working

### Client User
- **Email**: newcliente@betlink.com
- **Password**: NewCliente123!
- **Role**: cliente
- **Access**: Client dashboard, subscriptions
- **Dashboard**: `/cliente/dashboard`
- **Status**: ✅ Working

## How These Users Were Created

1. **Created via signup form** at `/auth/sign-up`
2. **Email confirmed** via SQL to enable immediate login
3. **Roles updated** via SQL (except cliente which is default)

### SQL Commands Used:
```sql
-- Update roles after signup
UPDATE profiles SET role = 'master' WHERE id = (SELECT id FROM auth.users WHERE email = 'newmaster@betlink.com');
UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'newadmin@betlink.com');
UPDATE profiles SET role = 'tipster' WHERE id = (SELECT id FROM auth.users WHERE email = 'newtipster@betlink.com');
-- newcliente@betlink.com keeps default 'cliente' role
```

## Testing Instructions

### Login Test
1. Go to http://localhost:3001/auth/login
2. Use any of the credentials above
3. You will be redirected to the appropriate dashboard
4. Dashboards return 404 (expected - will be created in Feature 1.3)

### Access Control Test
After login, try accessing other dashboards:
- Master can access all routes
- Admin can access admin, tipster, and cliente routes
- Tipster can access tipster and cliente routes
- Cliente can only access cliente routes

## Important Notes

- **All users functional**: These users can login and authenticate
- **Roles are permanent**: Only admin/master can change roles via SQL
- **New signups**: Always get 'cliente' role by default
- **Email pattern**: new[role]@betlink.com
- **Password pattern**: New[Role]123!

## Database Information

- **Project**: Supabase - ohnuaxnygsnkupmoimtq
- **Tables**: auth.users (Supabase managed) + public.profiles (custom)
- **RLS**: Enabled on profiles table
- **Trigger**: Automatically creates profile on signup

---

## Tipsters Created for Feature 2.17

### João Silva
- **Email**: joao.silva@betlink.com
- **Password**: Test@123!
- **Role**: tipster (needs update from cliente)
- **Access**: Tipster dashboard, channel management
- **Dashboard**: `/tipster/dashboard`
- **Status**: ✅ Created, needs role update
- **Assigned Channels**:
  - arbitragem-tennis-pro
  - modelo-ml-basquete
  - analise-cantos-asiaticos

### Maria Santos
- **Email**: maria.santos@betlink.com
- **Password**: Test@123!
- **Role**: tipster (needs update from cliente)
- **Access**: Tipster dashboard, channel management
- **Dashboard**: `/tipster/dashboard`
- **Status**: ✅ Created, needs role update
- **Assigned Channels**:
  - value-betting-europeu
  - cash-out-automatizado
  - trading-pre-jogo

### Pedro Costa
- **Email**: pedro.costa@betlink.com
- **Password**: Test@123!
- **Role**: tipster (needs update from cliente)
- **Access**: Tipster dashboard, channel management
- **Dashboard**: `/tipster/dashboard`
- **Status**: ✅ Created, needs role update
- **Assigned Channels**:
  - apostas-ao-vivo-premium
  - dutching-inteligente
  - lay-favoritos-sistema

### Ana Oliveira
- **Email**: ana.oliveira@betlink.com
- **Password**: Test@123!
- **Role**: tipster (needs update from cliente)
- **Access**: Tipster dashboard, channel management
- **Dashboard**: `/tipster/dashboard`
- **Status**: ✅ Created, needs role update
- **Assigned Channels**:
  - sistema-gols-asiaticos
  - estrategia-zebras
  - combo-multiplas-seguras

### SQL to Update Roles (Phase 2):
```sql
UPDATE profiles 
SET role = 'tipster'
WHERE email IN (
  'joao.silva@betlink.com',
  'maria.santos@betlink.com',
  'pedro.costa@betlink.com',
  'ana.oliveira@betlink.com'
);
```

**Last Updated**: August 2, 2025  
**Feature**: 2.17 - Resolve Tech Debt (Tipsters)  
**Status**: ✅ Complete with working test users 