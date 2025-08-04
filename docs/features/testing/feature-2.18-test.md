# 🧪 Guia de Teste - Feature 2.18: Sistema de Métricas Dinâmicas

## 📋 Checklist de Validação

### 1️⃣ **Verificar Estrutura da View**
```sql
-- No Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'channel_metrics_live';
```

**Resultado Esperado:**
- ✅ Deve incluir todas as colunas base (channel_id, tipster_id, etc.)
- ✅ Deve incluir profit_7d, profit_30d, profit_12m, profit_all_time
- ✅ Deve incluir roi_7d, roi_30d, roi_12m, roi_all_time
- ✅ Deve incluir mdd_7d, mdd_30d, mdd_12m, mdd_all_time
- ✅ Deve incluir hit_rate_7d, hit_rate_30d, hit_rate_12m, hit_rate_all_time

### 2️⃣ **Testar Métricas do Canal 1**
```sql
-- Verificar métricas do canal mais ativo
SELECT 
  channel_id,
  tipster_id,
  total_tips,
  active_subscribers,
  profit_7d,
  profit_30d,
  roi_30d,
  mdd_30d,
  hit_rate_30d,
  avg_odd,
  status,
  last_tip_at
FROM channel_metrics_live
WHERE channel_id = 1;
```

**Resultado Esperado:**
- ✅ profit_30d deve ser ~7.82
- ✅ roi_30d deve ser ~7.82%
- ✅ mdd_30d deve ser ~9.21
- ✅ hit_rate_30d deve ser ~52.00%
- ✅ total_tips deve ser 68

### 3️⃣ **Validar MDD (Maximum Drawdown)**
```sql
-- Verificar se MDD está sempre positivo
SELECT 
  channel_id,
  mdd_7d,
  mdd_30d,
  mdd_12m,
  mdd_all_time,
  profit_30d
FROM channel_metrics_live
WHERE mdd_30d IS NOT NULL
ORDER BY channel_id;
```

**Resultado Esperado:**
- ✅ Todos os valores de MDD devem ser ≥ 0
- ✅ MDD deve ser realista (geralmente < 50 para períodos curtos)
- ✅ Canais com lucro negativo podem ter MDD alto

### 4️⃣ **Testar Performance da View**
```sql
-- Medir tempo de execução
EXPLAIN ANALYZE
SELECT * FROM channel_metrics_live;
```

**Resultado Esperado:**
- ✅ Execution Time < 10ms
- ✅ Planning Time < 5ms
- ✅ Não deve haver Sequential Scans desnecessários

### 5️⃣ **Verificar Função MDD**
```sql
-- Testar função diretamente
SELECT calculate_channel_mdd(1, 30) as mdd_30d;
SELECT calculate_channel_mdd(2, 7) as mdd_7d;
SELECT calculate_channel_mdd(3, 365) as mdd_12m;
```

**Resultado Esperado:**
- ✅ Função deve retornar valores numéricos
- ✅ Valores devem ser consistentes com a view
- ✅ Não deve gerar erros

### 6️⃣ **Validar Agregações por Período**
```sql
-- Comparar métricas de diferentes períodos
SELECT 
  channel_id,
  profit_7d,
  profit_30d,
  profit_all_time,
  CASE 
    WHEN profit_all_time >= profit_30d AND profit_30d >= profit_7d THEN 'Lógico'
    ELSE 'Verificar'
  END as consistencia
FROM channel_metrics_live
WHERE channel_id IN (1,2,3,4,5);
```

**Resultado Esperado:**
- ✅ profit_all_time deve incluir profit_30d
- ✅ profit_30d deve incluir profit_7d
- ✅ Valores devem ser logicamente consistentes

### 7️⃣ **Testar Hit Rate**
```sql
-- Verificar cálculo de hit rate
SELECT 
  channel_id,
  hit_rate_7d,
  hit_rate_30d,
  hit_rate_all_time,
  total_tips,
  winning_tips
FROM channel_metrics_live
WHERE total_tips > 0
ORDER BY hit_rate_30d DESC;
```

**Resultado Esperado:**
- ✅ Hit rate deve estar entre 0 e 100
- ✅ Deve ser calculado como (winning_tips/total_tips)*100
- ✅ Valores NULL são aceitáveis para períodos sem tips

### 8️⃣ **Verificar ROI**
```sql
-- Validar cálculo de ROI
SELECT 
  channel_id,
  profit_30d,
  roi_30d,
  total_tips,
  ROUND(profit_30d::numeric, 2) as profit_calc,
  ROUND(roi_30d::numeric, 2) as roi_calc
FROM channel_metrics_live
WHERE channel_id IN (1,2,3,4,5);
```

**Resultado Esperado:**
- ✅ ROI = profit quando stake = 1
- ✅ ROI deve ser percentual do investimento
- ✅ Valores devem ser consistentes

### 9️⃣ **Testar Cenários Extremos**
```sql
-- Canal sem tips
SELECT * FROM channel_metrics_live WHERE total_tips = 0;

-- Canal com apenas tips perdedoras
SELECT * FROM channel_metrics_live WHERE winning_tips = 0 AND total_tips > 0;

-- Canal com 100% de acerto
SELECT * FROM channel_metrics_live WHERE winning_tips = total_tips AND total_tips > 0;
```

**Resultado Esperado:**
- ✅ Não deve haver erros de divisão por zero
- ✅ Valores NULL são aceitáveis onde não há dados
- ✅ Sistema deve lidar graciosamente com extremos

### 🔟 **Validação Final Integrada**
```sql
-- Query completa para dashboard
SELECT 
  c.id,
  c.name,
  c.sport,
  p.name as tipster_name,
  m.active_subscribers,
  m.total_tips,
  m.profit_30d,
  m.roi_30d,
  m.mdd_30d,
  m.hit_rate_30d,
  m.avg_odd,
  m.status,
  m.last_tip_at
FROM channels c
JOIN channel_metrics_live m ON c.id = m.channel_id
JOIN profiles p ON m.tipster_id = p.id
WHERE c.status = 'active'
ORDER BY m.profit_30d DESC NULLS LAST
LIMIT 10;
```

**Resultado Esperado:**
- ✅ Todos os joins devem funcionar
- ✅ Dados devem estar completos
- ✅ Ordenação deve funcionar corretamente
- ✅ Performance < 15ms

## 📊 Métricas de Sucesso

### ✅ Funcionalidade
- [ ] View `channel_metrics_live` existe e funciona
- [ ] Função `calculate_channel_mdd` retorna valores corretos
- [ ] Todas as métricas são calculadas dinamicamente
- [ ] MDD sempre positivo ou zero

### ✅ Performance
- [ ] Query principal < 10ms
- [ ] Função MDD < 5ms por execução
- [ ] View completa < 15ms

### ✅ Integridade
- [ ] Sem erros de divisão por zero
- [ ] Valores NULL tratados corretamente
- [ ] Dados consistentes entre períodos
- [ ] MDD realista e validado

### ✅ Cobertura
- [ ] 7 dias ✓
- [ ] 30 dias ✓
- [ ] 12 meses ✓
- [ ] All time ✓

## 🎯 Resultado Final

**Feature 2.18 está 100% funcional quando:**
1. Todos os testes acima passam ✅
2. Performance está dentro dos limites ✅
3. MDD está calculando corretamente ✅
4. Integração com UI funcionando ✅

## 📝 Notas de Teste

- **Data de Teste**: 2024-01-XX
- **Ambiente**: Desenvolvimento/Produção
- **Testador**: [Nome]
- **Status**: ⏳ Aguardando / ✅ Aprovado / ❌ Falhou

### Observações:
```
[Adicionar observações durante o teste]
```

---

**🚀 Feature 2.18 pronta para produção após todos os testes passarem!**