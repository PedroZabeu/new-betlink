# Feature 2.16: Tarefas de Suporte para Cursor

## 📋 Contexto
Claude está implementando a Feature 2.16 - Migrar Listagem de Canais para usar dados reais do Supabase. Estas são tarefas de suporte que você pode executar em paralelo.

## ✅ Tarefas para Executar

### 1. Verificar Integridade dos Dados (ALTA PRIORIDADE)
**Objetivo**: Confirmar que os dados populados em 2.15 estão corretos

**Execute estas queries no Supabase**:
```sql
-- Verificar contagem total
SELECT 
  (SELECT COUNT(*) FROM channels) as channels_count,
  (SELECT COUNT(*) FROM channel_tags) as tags_count,
  (SELECT COUNT(*) FROM channel_metrics) as metrics_count,
  (SELECT COUNT(*) FROM subscription_plans) as plans_count;

-- Verificar se todos os canais têm tags
SELECT c.id, c.name 
FROM channels c
LEFT JOIN channel_tags ct ON c.id = ct.channel_id
WHERE ct.id IS NULL;

-- Verificar se todos os canais têm métricas
SELECT c.id, c.name, COUNT(cm.id) as metrics_count
FROM channels c
LEFT JOIN channel_metrics cm ON c.id = cm.channel_id
GROUP BY c.id, c.name
HAVING COUNT(cm.id) < 6;
```

**Resultado esperado**:
- 12 channels, 12 tags, 72 metrics, 27+ plans
- Nenhum canal sem tags
- Todos os canais com 6 métricas (uma por período)

### 2. Criar Índices de Performance
**Objetivo**: Otimizar queries que serão usadas na listagem

**Execute no Supabase**:
```sql
-- Índice para filtros por esporte
CREATE INDEX IF NOT EXISTS idx_channel_tags_sport 
ON channel_tags(sport);

-- Índice para filtros por preço
CREATE INDEX IF NOT EXISTS idx_channels_base_price 
ON channels(base_price);

-- Índice para ordenação por criação
CREATE INDEX IF NOT EXISTS idx_channels_created_at 
ON channels(created_at DESC);

-- Índice composto para métricas por período
CREATE INDEX IF NOT EXISTS idx_channel_metrics_period_roi 
ON channel_metrics(channel_id, period, roi);
```

### 3. Testar Query Principal
**Objetivo**: Validar que a query complexa funciona

**Execute e documente o tempo de resposta**:
```sql
SELECT 
  c.*,
  ct.*,
  cm.*,
  sp.*,
  p.name as tipster_name,
  p.avatar_url as tipster_avatar
FROM channels c
INNER JOIN channel_tags ct ON c.id = ct.channel_id
INNER JOIN channel_metrics cm ON c.id = cm.channel_id
INNER JOIN subscription_plans sp ON c.id = sp.channel_id
INNER JOIN channel_tipsters ctp ON c.id = ctp.channel_id
INNER JOIN profiles p ON ctp.tipster_id = p.id
WHERE c.is_active = true
  AND cm.period = 'MONTH'
ORDER BY c.created_at DESC;
```

**Documente**:
- Tempo de execução: _____ms
- Número de registros retornados: _____
- Algum erro ou warning: _____

### 4. Preparar Ambiente de Teste
**Objetivo**: Facilitar testes durante desenvolvimento

1. **Abra duas abas no navegador**:
   - http://localhost:3000/canais (versão atual com mock)
   - http://localhost:3000/dev/data-migration (para referência)

2. **Tire screenshots**:
   - Página /canais atual (antes da migração)
   - Salve em: `/Users/pedroivozabeu/Projetos/new-betlink/docs/features/testing/screenshots/2.16-before.png`

3. **Liste funcionalidades atuais**:
   - [ ] Filtro por esporte funciona
   - [ ] Filtro por bookmaker funciona
   - [ ] Filtro por método funciona
   - [ ] Filtro por liquidez funciona
   - [ ] Ordenação funciona
   - [ ] Cards mostram ROI, lucro, MDD
   - [ ] Ocupação (312/400) visível

### 5. Monitorar Logs do Supabase
**Durante a implementação do Claude**:

1. Abra o dashboard do Supabase
2. Vá para Logs → API Logs
3. Monitore queries em tempo real
4. Reporte qualquer erro 500 ou query lenta (>1000ms)

## 📊 Status Report Template

Após completar as tarefas, crie o arquivo:
`/Users/pedroivozabeu/Projetos/new-betlink/.claude-instructions/feature-2.16-cursor-status.md`

```markdown
# Feature 2.16 - Status Report do Cursor

## ✅ Tarefas Completadas

### 1. Verificação de Integridade
- Contagens: ✅ 12/12/72/27
- Canais sem tags: 0
- Canais com métricas incompletas: 0

### 2. Índices Criados
- [ ] idx_channel_tags_sport
- [ ] idx_channels_base_price
- [ ] idx_channels_created_at
- [ ] idx_channel_metrics_period_roi

### 3. Performance da Query
- Tempo: ___ms
- Registros: ___
- Status: ✅ Funcionando / ❌ Com erros

### 4. Ambiente Preparado
- Screenshots: ✅ Salvos
- Funcionalidades documentadas: ✅

### 5. Observações
[Adicione qualquer problema ou observação importante]
```

## ⚠️ Importante
- **NÃO modifique** nenhum arquivo de código
- **NÃO delete** nenhum dado
- **Apenas execute** queries SELECT (não INSERT/UPDATE/DELETE)
- **Reporte imediatamente** se encontrar dados faltando ou incorretos