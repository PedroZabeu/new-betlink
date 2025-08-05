# Feature 2.19: Guia de Testes E2E - Performance Chart

## 🎯 Objetivo
Validar que o sistema unificado de métricas está funcionando com 100% de consistência entre todos os componentes.

## 🔍 Passos para Debug Manual

### 1. Abrir o Console do Navegador
1. Acesse: http://localhost:3000/canais/futebol-europeu-premium
2. Abra o Console (F12 ou Cmd+Option+I)
3. Procure por logs com "[Feature 2.19]"

### 2. Verificar os Logs Esperados
Você deve ver:
```
[Feature 2.19] Query params - channelId: 1, period: 30d, startDate: [data 30 dias atrás]
[Feature 2.19] Raw tips response: [array de tips]
[Feature 2.19] Fetched X tips for channel 1, period 30d
[Feature 2.19] Summary metrics: { roi: X, profit: Y, ... }
[Feature 2.19] Timeline data points: Z
```

### 3. Possíveis Problemas e Soluções

#### Problema A: "No QueryClient set"
- **Causa**: QueryProvider não está configurado
- **Solução**: Já corrigido, reinicie o servidor

#### Problema B: "Fetched 0 tips"
- **Causa**: Filtro de data muito restritivo ou channel_id incorreto
- **Verificar**: 
  - O channelId está correto?
  - Existem tips no período selecionado?
  - O formato da data está correto?

#### Problema C: Métricas aparecem mas gráfico não
- **Causa**: Problema no componente PerformanceChart
- **Verificar**: Erros específicos do Recharts no console

## 📊 Valores Esperados (Canal 1 - 30 dias)

Com base na análise em R:
- **ROI**: ~74.7%
- **Lucro**: ~63.5 unidades
- **Hit Rate**: ~58%
- **Total Tips**: ~85

## 🧪 Checklist de Validação

### Funcionalidades Básicas
- [ ] Página carrega sem erros
- [ ] MetricsCard mostra valores
- [ ] Gráfico de performance aparece
- [ ] Seletor de período funciona

### Consistência de Dados
- [ ] Valores do MetricsCard batem com o header do gráfico
- [ ] Mudança de período atualiza ambos componentes
- [ ] Valores são consistentes com análise em R (tolerância < 0.01)

### Períodos
- [ ] 7D funciona
- [ ] 30D funciona
- [ ] 3M funciona
- [ ] 6M funciona
- [ ] YTD funciona
- [ ] 12M funciona
- [ ] All funciona

### Performance
- [ ] Mudança de período < 500ms
- [ ] Sem flicker ao trocar período
- [ ] Loading states aparecem corretamente

## 🐛 Comandos Úteis para Debug

### No Console do Browser:
```javascript
// Ver todas as queries do React Query
window.__REACT_QUERY_DEVTOOLS__

// Verificar se o channelId está correto
document.querySelector('[data-channel-id]')?.dataset.channelId
```

### No Supabase:
```sql
-- Verificar tips do canal
SELECT COUNT(*), MIN(event_date), MAX(event_date) 
FROM tips 
WHERE channel_id = 1;

-- Ver distribuição por status
SELECT status, COUNT(*) 
FROM tips 
WHERE channel_id = 1 
GROUP BY status;
```

## 📝 Reportar Problemas

Se encontrar problemas, forneça:
1. Screenshot do console com erros
2. Logs com "[Feature 2.19]"
3. Período selecionado quando ocorreu o erro
4. Channel ID da página

---

*Última atualização: 05/08/2025*