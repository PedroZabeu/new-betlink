# Feature 1.2: Database Schema + Auth Pages - Learnings

## Resumo
Este documento captura os principais aprendizados durante a implementação da Feature 1.2, especialmente os desafios com RLS policies e autenticação.

## Aprendizados Técnicos

### 1. RLS Policies - INSERT é Crítico!
**Descoberta**: Triggers com SECURITY DEFINER ainda respeitam RLS policies
```sql
-- ERRADO: Apenas SELECT e UPDATE
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT...
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE...

-- CORRETO: Incluir INSERT para o trigger funcionar
CREATE POLICY "Trigger can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
```
**Lição**: SEMPRE incluir policy de INSERT quando usar triggers para criar registros

### 2. Usuários de Teste - Auth vs Database
**Descoberta**: Usuários criados via SQL não podem autenticar
```sql
-- Isso cria usuário no banco mas NÃO no Supabase Auth
INSERT INTO auth.users (email) VALUES ('test@example.com');
```
**Lição**: SEMPRE criar usuários de teste via signup UI ou Supabase Dashboard

### 3. Client/Server Separation no Next.js 13+
**Descoberta**: Misturar código client/server causa build errors
```typescript
// ERRADO: Um arquivo com ambos
export async function getProfile() { /* server code */ }
export function useProfile() { /* client hook */ }

// CORRETO: Arquivos separados
// server.ts - apenas server components
// client.ts - apenas client components
```
**Lição**: Manter separação estrita entre client e server code

### 4. Debug de Autenticação
**Descoberta**: Campo `last_sign_in_at` indica se usuário já funcionou
```sql
-- Útil para debug
SELECT email, last_sign_in_at, created_at 
FROM auth.users 
WHERE last_sign_in_at IS NOT NULL;
```
**Lição**: Verificar histórico de login ajuda a identificar se é problema novo ou antigo

## Aprendizados de Processo

### 1. Colaboração Claude + Cursor
**Problema**: Tarefas não eram específicas o suficiente
**Solução**: Instruções detalhadas com exemplos exatos
**Resultado**: Cursor executou perfeitamente quando instruções eram claras

### 2. Testes Incrementais
**Problema**: Testar tudo de uma vez mascara problemas
**Solução**: Testar cada parte isoladamente
1. Migration funciona?
2. Trigger dispara?
3. Policy permite?
4. Login funciona?
**Resultado**: Problema identificado rapidamente (INSERT policy)

### 3. Documentação de Credenciais
**Problema**: Confusão sobre quais usuários funcionam
**Solução**: Documentar claramente:
- Como foram criados
- Se podem autenticar
- Qual o propósito
**Resultado**: Menos tempo perdido em debug

## Padrões Estabelecidos

### 1. Migration Naming
```
001_create_profiles.sql         # Feature principal
002_fix_profiles_insert_policy.sql # Correções
```

### 2. Role System
```typescript
// Todos entram como 'cliente'
// Apenas admin/master podem alterar roles
// Hierarquia: master > admin > tipster > cliente
```

### 3. Test Users Pattern
```
new[role]@betlink.com / New[Role]123!
- newmaster@betlink.com
- newadmin@betlink.com
- newtipster@betlink.com
- newcliente@betlink.com
```

## Armadilhas Evitadas

### 1. Service Role Key no Frontend
**Tentação**: Usar service_role key para "resolver" problemas
**Realidade**: ENORME risco de segurança
**Decisão**: Manter apenas anon key no frontend
**Resultado**: Segurança mantida

### 2. Múltiplos Usuários de Teste
**Tentação**: Criar dezenas de usuários para "testar melhor"
**Realidade**: Confusão e banco poluído
**Decisão**: Apenas 4 usuários (um por role)
**Resultado**: Testes claros e reproduzíveis

### 3. Roles Complexos no Signup
**Tentação**: Permitir seleção de role no cadastro
**Realidade**: Risco de segurança
**Decisão**: Todos entram como 'cliente'
**Resultado**: Sistema mais seguro e simples

## Métricas de Sucesso

### Tempo Estimado vs Real
- **Estimado**: 2-3 horas
- **Real**: ~3 horas (incluindo debug)
- **Precisão**: 100% ✅

### Problemas vs Soluções
- **Blockers encontrados**: 1 (INSERT policy)
- **Tempo para resolver**: 15 minutos
- **Impacto**: Alto (bloqueava tudo)

### Qualidade Final
- **Funcionalidades**: 100% implementadas
- **Testes**: 100% passando
- **Débito técnico**: Mínimo

## Recomendações para Features Futuras

### 1. RLS Policies
- [ ] SEMPRE incluir todas as operações (SELECT, INSERT, UPDATE, DELETE)
- [ ] Testar policies isoladamente antes do código
- [ ] Documentar o propósito de cada policy

### 2. Autenticação
- [ ] Criar usuários teste via UI, não SQL
- [ ] Verificar `last_sign_in_at` para debug
- [ ] Manter log de mudanças em auth settings

### 3. Desenvolvimento
- [ ] Separar client/server code desde o início
- [ ] Testar incrementalmente
- [ ] Documentar decisões inline

## Ferramentas Úteis Descobertas

1. **Supabase SQL Editor**: Melhor que psql para queries rápidas
2. **auth.users view**: Mostra timestamps úteis para debug
3. **Migrations incrementais**: Facilitam rollback se necessário

## O Que Faria Diferente

### 1. Policy de INSERT desde o Início
Incluiria INSERT policy na migration inicial

### 2. Teste de Signup Primeiro
Antes de criar usuários SQL, testaria signup funcionando

### 3. Documentação de Policies
Comentários mais detalhados no SQL sobre cada policy

## Conclusão

Feature 1.2 estabeleceu a base sólida de autenticação com roles. O problema da INSERT policy foi uma lição valiosa sobre RLS no Supabase. A separação client/server é crítica para Next.js 13+.

### Citação Importante
> "RLS policies aplicam SEMPRE, mesmo em triggers SECURITY DEFINER"

### Maior Aprendizado
Usuários de teste devem simular o fluxo real de produção. Criar via SQL é atalho que não funciona com Supabase Auth.

---

**Documento criado**: 25/01/2025
**Próxima feature**: 1.3 - Client Pages + Access Control