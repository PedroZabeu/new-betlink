# EPIC 1 - Replanejado com Trabalho Paralelo

## 🚀 Nova Estratégia: Maximizar Paralelização

Cada feature agora tem tarefas paralelas para Claude e Cursor, reduzindo tempo total de implementação.

## 📊 Features com Divisão de Trabalho

### Feature 1.1: Base Infrastructure
**Tempo estimado: 1.5h (antes: 2h)**

**Claude implementa:**
- Header component com logo e navegação
- Landing page com hero section
- Sistema de navegação responsivo
- Páginas de erro e access-denied

**Cursor em paralelo:**
```markdown
1. Deletar todos arquivos em /components/tutorial/*
2. Deletar: hero.tsx, deploy-button.tsx, next-logo.tsx, supabase-logo.tsx
3. Criar estrutura de pastas:
   /app/cliente/
   /app/tipster/
   /app/admin/
   /app/master/
4. Verificar build: npm run build
```

---

### Feature 1.2: Database Schema + Auth Pages
**Tempo estimado: 2h (antes: 3h)**

**Claude implementa:**
- Atualiza middleware para usar getUser()
- Melhora páginas de auth (login/signup)
- Cria fluxo de onboarding
- Implementa redirecionamento por role

**Cursor em paralelo:**
```markdown
# Supabase Setup via MCP:

1. Create migration:
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  app_role TEXT NOT NULL CHECK (app_role IN ('master','admin','tipster','client')),
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

2. Create trigger for auto-sync:
CREATE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, app_role)
  VALUES (new.id, 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

3. Enable RLS and create policies
4. Test user creation flow
```

---

### Feature 1.3: Client Pages + Access Control
**Tempo estimado: 1.5h (antes: 2.5h)**

**Claude implementa:**
- Todas as páginas do cliente (dashboard, assinaturas, etc.)
- Layouts específicos do cliente
- Componentes de navegação interna
- Atualiza middleware com rotas públicas

**Cursor em paralelo:**
```markdown
1. Add routes to user-nav.tsx dropdown
2. Create placeholder pages with basic structure:
   /cliente/dashboard/page.tsx
   /cliente/assinaturas/page.tsx
   /cliente/perfil/page.tsx
   /cliente/historico/page.tsx
3. Test navigation works
4. Verify middleware allows access
```

---

### Feature 1.4: Tipster Pages + Access Control
**Tempo estimado: 2h (antes: 3h)**

**Claude implementa:**
- Páginas do tipster com layouts
- Primeira verificação de role no middleware
- Sistema de permissões básico
- Componentes específicos do tipster

**Cursor em paralelo:**
```markdown
# Database work:
1. Create tipster_profiles table:
CREATE TABLE tipster_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  bio TEXT,
  telegram_channel TEXT,
  subscription_price DECIMAL(10,2)
);

2. Insert test tipster via Supabase MCP

3. Test access control:
   - Login as client → access /tipster/* → should redirect
   - Login as tipster → access /tipster/* → should work
```

---

### Feature 1.5: Admin Pages + Access Control
**Tempo estimado: 1.5h (antes: 2.5h)**

**Claude implementa:**
- Sistema expandido de permissões
- Páginas admin com gerenciamento
- Tratamento de erros no middleware
- Dashboard administrativo

**Cursor em paralelo:**
```markdown
1. Create admin menu structure
2. Add permission constants:
   /lib/constants/permissions.ts
3. Create admin_logs table:
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id),
  action TEXT,
  target_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
4. Test hierarchical access (admin can access client pages)
```

---

### Feature 1.6: Master Pages + Test Users
**Tempo estimado: 1h (antes: 2h)**

**Claude implementa:**
- Sistema final de permissões por dados
- Páginas master exclusivas
- Funções auxiliares no middleware
- Sistema completo de roles

**Cursor em paralelo:**
```markdown
# Create all test users via Supabase MCP:

1. Create users in auth.users:
- master@betlink.test (senha: Master123!)
- admin@betlink.test (senha: Admin123!)
- tipster@betlink.test (senha: Tipster123!)
- client@betlink.test (senha: Client123!)

2. Update profiles with correct roles:
UPDATE profiles SET app_role = 'master' WHERE...
UPDATE profiles SET app_role = 'admin' WHERE...

3. Document credentials in:
/docs/test-users.md (git ignored)

4. Verify each user can only access allowed routes
```

---

### Feature 1.7: Polish + Final Testing
**Tempo estimado: 1h (antes: 1.5h)**

**Claude implementa:**
- Logs de debugging
- Otimizações de performance
- Ajustes finais de UI
- Documentação inline

**Cursor em paralelo:**
```markdown
# Comprehensive Testing via Playwright MCP:

1. Test full auth flow for each role
2. Test access matrix:
   - Master: all routes ✓
   - Admin: admin + tipster + client ✓
   - Tipster: tipster + public ✓
   - Client: client + public ✓

3. Performance test:
   - Page loads < 3s
   - Middleware < 100ms

4. Create test report in:
   /docs/test-results/epic-1-final.md
```

## 📈 Ganho de Tempo Total

| Feature | Tempo Original | Tempo Paralelo | Economia |
|---------|----------------|----------------|----------|
| 1.1 | 2h | 1.5h | 25% |
| 1.2 | 3h | 2h | 33% |
| 1.3 | 2.5h | 1.5h | 40% |
| 1.4 | 3h | 2h | 33% |
| 1.5 | 2.5h | 1.5h | 40% |
| 1.6 | 2h | 1h | 50% |
| 1.7 | 1.5h | 1h | 33% |
| **Total** | **16.5h** | **10.5h** | **36%** |

## 🎯 Princípios da Paralelização

1. **Claude sempre lidera** - começa implementação complexa primeiro
2. **Cursor nunca espera** - sempre tem tarefas independentes
3. **Supabase via Cursor** - todas migrations e queries
4. **Testes via Cursor** - Playwright MCP para validação
5. **Merge points claros** - sincronização a cada 1-2h

## 📝 Template de Comunicação

### Claude inicia feature:
```markdown
# Starting Feature X.Y

I'm implementing [complex part].
Please handle these parallel tasks:
[list of simple tasks]

Expected completion: X hours
Sync point: [when to merge]
```

### Cursor responde:
```markdown
# Status Feature X.Y

Completed:
- ✅ Task 1
- ✅ Task 2
- ❌ Task 3 (error: ...)

Supabase:
- Migration executed
- Test data inserted

Ready for merge: YES/NO
```

## 🚦 Checkpoints

Após cada feature:
1. Build passa sem erros
2. Tipos validados
3. Rotas testadas manualmente
4. Permissões verificadas
5. Git commit realizado

Com essa abordagem paralela, o EPIC 1 pode ser completado em ~2 dias úteis ao invés de 3-4 dias.