# Feature 2.14 - Instruções para Deletar Tabelas do EPIC 2

## 🎯 Objetivo
Deletar TODAS as tabelas criadas durante o EPIC 2, mantendo apenas:
- `profiles` (tabela principal de usuários)
- `auth.users` (tabela do Supabase Auth - NÃO TOCAR)

## ⚠️ IMPORTANTE
**NUNCA delete as tabelas `profiles` ou `auth.users`!** Isso quebraria todo o sistema de autenticação.

## 📋 Tarefas para Cursor

### 1. Deletar as Seguintes Tabelas

Execute estas queries SQL no Supabase, uma por vez:

```sql
-- 1. Deletar tabela de métricas em cache
DROP TABLE IF EXISTS channel_metrics_cache CASCADE;

-- 2. Deletar tabela de tips/apostas
DROP TABLE IF EXISTS tips CASCADE;

-- 3. Deletar tabela de canais
DROP TABLE IF EXISTS channels CASCADE;

-- 4. Deletar qualquer outra tabela relacionada ao EPIC 2
-- (Se existirem outras tabelas como channel_tags, subscription_plans, etc)
DROP TABLE IF EXISTS channel_tags CASCADE;
DROP TABLE IF EXISTS channel_metrics CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
```

### 2. Verificar Tabelas Restantes

Após deletar, execute esta query para confirmar que só restaram as tabelas corretas:

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado**: Deve mostrar APENAS a tabela `profiles` no schema public.

### 3. Limpar Campos Extras em Profiles (Opcional)

Se foram adicionados campos específicos do EPIC 2 na tabela profiles, você pode removê-los:

```sql
-- Verificar estrutura atual da tabela profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Se existirem campos como is_tipster, tipster_since, bio que não são necessários:
-- ALTER TABLE profiles 
-- DROP COLUMN IF EXISTS is_tipster,
-- DROP COLUMN IF EXISTS tipster_since,
-- DROP COLUMN IF EXISTS bio;
```

### 4. Reportar Status

Crie um arquivo em:
`/Users/pedroivozabeu/Projetos/new-betlink/.claude-instructions/feature-2.14-tables-deleted-status.md`

Com o seguinte conteúdo:

```markdown
# Feature 2.14 - Status de Deleção de Tabelas EPIC 2

## ✅ Tabelas Deletadas
- [ ] channel_metrics_cache
- [ ] tips
- [ ] channels
- [ ] channel_tags (se existia)
- [ ] channel_metrics (se existia)
- [ ] subscription_plans (se existia)

## 📊 Tabelas Restantes no Schema Public
(Cole aqui o resultado da query de verificação)

## ✅ Confirmações
- [ ] Tabela `profiles` ainda existe
- [ ] Tabela `auth.users` NÃO foi tocada
- [ ] Nenhuma tabela do EPIC 2 restante

## 🚨 Problemas Encontrados
(Liste aqui qualquer erro ou problema)

## Timestamp
Executado em: [DATA/HORA]
```

## ⚠️ AVISOS CRÍTICOS
1. **NUNCA** delete `profiles` ou `auth.users`
2. Use `CASCADE` para deletar dependências automaticamente
3. Execute uma query por vez para identificar erros
4. Sempre verifique o resultado antes de prosseguir