# Feature 1.2: Database Schema + Auth Pages

## Overview
**Objetivo**: Implementar o schema de banco de dados com roles e páginas de autenticação funcionais
**Duração Estimada**: 2-3 horas
**Prioridade**: High - Bloqueia todas as features seguintes

## Definição de Sucesso
- [ ] Usuários podem criar conta (sempre como role 'cliente')
- [ ] Login funciona e redireciona baseado no role do usuário
- [ ] Logout limpa sessão corretamente
- [ ] Tabela profiles sincronizada com auth.users
- [ ] Middleware identifica role do usuário
- [ ] 4 usuários teste criados (um para cada role)

## Divisão de Trabalho: Claude vs Cursor

### Claude (Trabalho Principal - 75%)
1. **Schema do Banco de Dados**
   - Criar migration para tabela profiles
   - Definir enum de roles
   - Criar trigger de sincronização (sempre cria como 'cliente')
   - Definir RLS policies

2. **Lógica de Autenticação**
   - Implementar lógica de redirecionamento por role após login
   - Atualizar middleware para ler role do usuário
   - Criar helper functions para verificação de roles
   - Ajustar fluxo de login para redirecionar baseado no role

3. **Ajustes no Sistema**
   - Garantir que signup sempre cria usuário como 'cliente'
   - Auth flow management com redirecionamento por role
   - Session handling com role information

### Cursor (Trabalho de Suporte - 25%)
1. **Execução de Migrations**
   - Rodar migrations no Supabase via MCP
   - Verificar se tabelas foram criadas
   - Testar trigger funcionando

2. **Criação de Usuários Teste via MCP**
   - Criar usuário master@betlink.com no auth.users
   - Criar usuário admin@betlink.com no auth.users  
   - Criar usuário tipster@betlink.com no auth.users
   - Criar usuário cliente@betlink.com no auth.users
   - Atualizar role na tabela profiles para cada usuário via SQL

3. **Validação e Documentação**
   - Verificar redirecionamentos funcionando
   - Testar logout
   - Documentar credenciais em arquivo seguro

## Implementação Passo a Passo

### Fase 1: Database Schema (30 min)
1. **Claude**: Criar arquivo de migration SQL
2. **Cursor**: Executar migration via Supabase MCP
3. **Claude**: Verificar e ajustar se necessário

### Fase 2: Auth Logic Update (45 min)
1. **Claude**: Garantir que SignUpForm sempre cria usuário como 'cliente'
2. **Claude**: Implementar redirecionamento por role no login
3. **Cursor**: Criar os 4 usuários teste via Supabase MCP

### Fase 3: Login Flow (45 min)
1. **Claude**: Implementar redirecionamento por role
2. **Claude**: Atualizar middleware
3. **Cursor**: Testar login de cada role

### Fase 4: Testing & Documentation (30 min)
1. **Cursor**: Validar que cada usuário teste acessa seu dashboard correto
2. **Cursor**: Documentar credenciais em arquivo seguro
3. **Claude**: Verificar fluxo completo e ajustar se necessário

## Arquivos a Serem Criados/Modificados

### Novos Arquivos
```
/supabase/migrations/001_create_profiles.sql
/lib/auth/helpers.ts
/docs/test-credentials.md
```

### Arquivos a Modificar
```
/components/sign-up-form.tsx
/components/login-form.tsx
/middleware.ts
/lib/supabase/server.ts
```

## SQL Schema Detalhado

```sql
-- Enum para roles
CREATE TYPE user_role AS ENUM ('master', 'admin', 'tipster', 'cliente');

-- Tabela profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger para criar profile automaticamente (sempre como 'cliente')
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'cliente'::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Redirecionamentos por Role

```typescript
const roleRedirects = {
  master: '/master/dashboard',
  admin: '/admin/dashboard',
  tipster: '/tipster/dashboard',
  cliente: '/cliente/dashboard'
};
```

## Riscos e Mitigações

### Riscos
1. **Migration falhar**: Ter SQL de rollback pronto
2. **Trigger não funcionar**: Validar com inserts manuais
3. **RLS muito restritivo**: Começar permissivo, depois restringir

### Mitigações
- Testar cada etapa incrementalmente
- Manter backup do schema anterior
- Logs detalhados em cada operação

## Checklist de Validação

### Funcionalidades
- [ ] Criar conta com role "cliente" ✓
- [ ] Criar conta com role "tipster" ✓
- [ ] Criar conta com role "admin" ✓
- [ ] Criar conta com role "master" ✓
- [ ] Login redireciona para /cliente/dashboard
- [ ] Login redireciona para /tipster/dashboard
- [ ] Login redireciona para /admin/dashboard
- [ ] Login redireciona para /master/dashboard
- [ ] Logout limpa sessão
- [ ] Middleware bloqueia acesso não autorizado

### Técnico
- [ ] Migration executada sem erros
- [ ] Trigger criando profiles
- [ ] RLS policies funcionando
- [ ] Tipos TypeScript atualizados
- [ ] Sem erros no console
- [ ] Build passando

## Instruções Específicas para Cursor

### Task 1: Executar Migration
```markdown
Após Claude criar o arquivo de migration:
1. Use Supabase MCP para executar a migration
2. Verifique se a tabela profiles foi criada
3. Verifique se o enum user_role existe
4. Teste inserir um usuário manualmente
```

### Task 2: Criar Usuários Teste via Supabase MCP
```markdown
IMPORTANTE: Criar usuários diretamente via Supabase MCP

1. Criar usuário no auth.users:
   - Email: master@betlink.com (senha: Master123!)
   - Email: admin@betlink.com (senha: Admin123!)
   - Email: tipster@betlink.com (senha: Tipster123!)
   - Email: cliente@betlink.com (senha: Cliente123!)

2. Para cada usuário criado, executar SQL para atualizar role:
   UPDATE profiles SET role = 'master' WHERE id = (SELECT id FROM auth.users WHERE email = 'master@betlink.com');
   UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@betlink.com');
   UPDATE profiles SET role = 'tipster' WHERE id = (SELECT id FROM auth.users WHERE email = 'tipster@betlink.com');
   -- cliente@betlink.com já terá role 'cliente' pelo trigger

3. Documentar em /mnt/c/Users/pedro/Projetos/new-betlink/docs/test-credentials.md
```

### Task 3: Validar Redirecionamentos
```markdown
Para cada usuário teste:
1. Fazer login
2. Verificar se foi para o dashboard correto
3. Tentar acessar dashboards de outros roles
4. Verificar se foi bloqueado
5. Fazer logout e verificar redirecionamento
```

## Notas de Implementação

- Manter compatibilidade com auth existente
- Não quebrar fluxo de forgot password
- Role padrão sempre será 'cliente' (definido no trigger)
- Todos os usuários criados via signup serão 'cliente'
- Apenas admin/master poderão alterar roles (feature futura)
- Master role deve ser criado apenas via SQL direto
- Considerar adicionar campo 'name' na profiles futuramente

## Próximos Passos (Feature 1.3)
Após conclusão desta feature, teremos a base para implementar:
- Páginas específicas por role
- Controle de acesso granular
- Dashboard personalizado por tipo de usuário