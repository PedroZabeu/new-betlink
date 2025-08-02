# Feature 2.17: Resolver Tech Debt da Feature 2.16

## 📋 Contexto
Durante a implementação da Feature 2.16, identificamos tech debt crítico que precisa ser resolvido antes de prosseguir com outras features. Os principais problemas são:

1. **Tabela channel_tipsters vazia** - sem tipsters associados aos canais
2. **Campos NULL em channel_metrics** - profit_units, mdd, avg_odds
3. **Página de detalhes ainda mockada** - inconsistência com listagem
4. **Problemas de UI** - botões cortados e sobreposição de elementos

## 🎯 Objetivo
Resolver todo o tech debt identificado através de uma abordagem sistemática:
1. Criar tipsters reais no sistema
2. Popular dados faltantes
3. Garantir consistência entre todas as páginas

## 📊 Escopo

### Parte 1: Criar Tipsters Reais (2h)
- [ ] Usar Playwright MCP para criar 4 tipsters via sign-up
- [ ] Atualizar test-credentials.md com credenciais
- [ ] Documentar processo para futura referência

### Parte 2: Atualizar Dados no Banco (1h)
- [ ] Criar documento para Cursor alterar roles em profiles
- [ ] Conectar channel_tipsters com tipsters criados
- [ ] Popular campos NULL em channel_metrics
- [ ] Criar métricas proporcionais por período

### Parte 3: Migrar Página de Detalhes (2h)
- [ ] Substituir mock-channel-details por queries Supabase
- [ ] Implementar busca de todas as métricas
- [ ] Garantir consistência com cards da listagem
- [ ] Testar troca de período temporal

### Parte 4: Validação e Testes (1h)
- [ ] Criar guia de teste para 3 tipsters
- [ ] Executar testes end-to-end
- [ ] Verificar consistência de dados
- [ ] Documentar resultados

## 🔧 Detalhes Técnicos

### Tipsters a Criar
```javascript
const tipsters = [
  {
    name: "João Silva",
    email: "joao.silva@betlink.com",
    password: "Test@123!",
    phone: "+5511999991111",
    telegram: "@joaosilva",
    channels: ["arbitragem-tennis-pro", "modelo-ml-basquete", "analise-cantos-asiaticos"]
  },
  {
    name: "Maria Santos",
    email: "maria.santos@betlink.com", 
    password: "Test@123!",
    phone: "+5511999992222",
    telegram: "@mariasantos",
    channels: ["value-betting-europeu", "cash-out-automatizado", "trading-pre-jogo"]
  },
  {
    name: "Pedro Costa",
    email: "pedro.costa@betlink.com",
    password: "Test@123!",
    phone: "+5511999993333",
    telegram: "@pedrocosta",
    channels: ["apostas-ao-vivo-premium", "dutching-inteligente", "lay-favoritos-sistema"]
  },
  {
    name: "Ana Oliveira",
    email: "ana.oliveira@betlink.com",
    password: "Test@123!",
    phone: "+5511999994444", 
    telegram: "@anaoliveira",
    channels: ["sistema-gols-asiaticos", "estrategia-zebras", "combo-multiplas-seguras"]
  }
];
```

### Queries SQL Necessárias

#### 1. Atualizar roles para tipster
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

#### 2. Conectar tipsters aos canais
```sql
-- Será gerado dinamicamente baseado nos IDs reais
INSERT INTO channel_tipsters (channel_id, user_id, role, joined_at)
SELECT 
  c.id as channel_id,
  p.id as user_id,
  'owner' as role,
  NOW() - INTERVAL '6 months' as joined_at
FROM channels c
JOIN profiles p ON ...
```

#### 3. Popular métricas faltantes
```sql
-- Ver arquivo .cursor-instructions/populate-channel-metrics.md
```

## ⚠️ Guardrails

### NUNCA Modificar
- Sistema de autenticação
- Estrutura de tabelas existentes
- Funcionalidades já implementadas
- UI/UX da listagem de canais

### SEMPRE Preservar
- Badge "Live Data" funcionando
- Filtros e ordenação
- Performance < 2s
- Responsividade mobile

## 📈 Métricas de Sucesso
- [ ] 4 tipsters criados e funcionais
- [ ] Zero campos NULL em channel_metrics
- [ ] Página de detalhes 100% Supabase
- [ ] Consistência total entre card e detalhes
- [ ] Todos os testes passando

## 🧪 Plano de Testes

### Teste 1: Verificar Tipsters
```bash
# SQL para verificar
SELECT p.name, p.email, p.role, ct.role as channel_role, c.name as channel_name
FROM profiles p
JOIN channel_tipsters ct ON ct.user_id = p.id
JOIN channels c ON c.id = ct.channel_id
WHERE p.role = 'tipster'
ORDER BY p.name, c.name;
```

### Teste 2: Verificar Métricas
```bash
# SQL para verificar NULL
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN profit_units IS NULL THEN 1 END) as null_profit,
  COUNT(CASE WHEN mdd IS NULL THEN 1 END) as null_mdd,
  COUNT(CASE WHEN avg_odds IS NULL THEN 1 END) as null_odds
FROM channel_metrics;
```

### Teste 3: Consistência Visual
1. Acessar /canais e anotar métricas de um canal
2. Clicar em "Ver Detalhes"
3. Verificar se métricas são idênticas
4. Trocar período temporal
5. Verificar se métricas mudam proporcionalmente

## 📝 Documentação Relacionada
- Progress: `/docs/features/progress/feature-2.17-progress.md`
- Handover anterior: `/docs/features/handover/feature-2.16-handover.md`
- Instruções Cursor: `/.cursor-instructions/populate-channel-metrics.md`

## 🚀 Como Começar

### Passo 1: Criar Progress File
```bash
docs/features/progress/feature-2.17-progress.md
```

### Passo 2: Iniciar com Playwright MCP
```javascript
// Navegador já aberto
await page.goto('http://localhost:3000/auth/signup');
// Começar criação dos tipsters
```

### Passo 3: Seguir ordem
1. Criar tipsters (Claude + Playwright)
2. Atualizar banco (Cursor + MCP)
3. Migrar detalhes (Claude)
4. Testar tudo (Claude + Playwright)

## ⏱️ Estimativas
- **Complexidade**: Alta (6h total)
- **Prioridade**: Crítica
- **Dependências**: Feature 2.16 completa
- **Risco**: Médio (dados de produção)

---

*Criado em: 02/08/2025*
*Feature anterior: 2.16 - Migrar Listagem de Canais*
*Próxima feature: 2.18 - Sistema de Métricas Real*