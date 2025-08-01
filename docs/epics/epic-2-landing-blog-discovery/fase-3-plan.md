# EPIC 2 - Fase 3: Discovery de Canais - Plano Detalhado

## 📊 Visão Geral da Fase 3
- **Objetivo**: Criar sistema completo de descoberta e exploração de canais de tipsters
- **Features**: 3 (2.11 ✅, 2.12 🟦, 2.13 ⬜)
- **Status**: 33% completo
- **Estimativa Total**: 17-21 horas

## 🎯 Features da Fase

### Feature 2.11: Refinamento dos Cards ✅
- **Status**: Concluída (01/02/2025)
- **Tempo**: ~4 horas
- **Entregues**:
  - Cards com 6 métricas principais
  - Sistema de filtros em 5 dimensões
  - Ordenação dinâmica
  - Mobile drawer
  - 12 canais mock

### Feature 2.12: Página de Detalhes 🟦
- **Status**: In Planning
- **Estimativa**: 3-4 horas
- **Objetivo**: Página completa do canal com todas as informações para conversão
- **Principais Elementos**:
  - Header com informações básicas e CTA
  - Gráfico interativo com filtro de período (7d, 30d, 3m, 6m, 1a, Total)
  - Tabela de resultados recentes (shadcn/ui)
  - Cards informativos (Sobre, Avaliações, FAQ)
  - Métricas que atualizam com a janela temporal

### Feature 2.13: Fluxo de Assinatura ⬜
- **Status**: Not Started
- **Estimativa**: 4-5 horas
- **Objetivo**: Multi-step flow até pré-pagamento
- **Principais Elementos**:
  - Seleção de plano
  - Formulário de cadastro/login
  - Preview da assinatura
  - Captura de leads
  - Mock do checkout

## 📈 Progresso Visual da Fase 3

```
Feature 2.11: ██████████ 100% ✅
Feature 2.12: ░░░░░░░░░░ 0%   🟦 (Planning)
Feature 2.13: ░░░░░░░░░░ 0%   ⬜

Total Fase 3: ███░░░░░░░ 33%
```

## 🔗 Integração entre Features

### De 2.11 para 2.12:
- Cards têm botão "Ver Detalhes" → `/canais/[slug]`
- Consistência visual entre card e página
- Mesmas métricas expandidas

### De 2.12 para 2.13:
- CTAs na página de detalhes → Fluxo de assinatura
- Informações do canal pré-preenchidas
- Contexto mantido durante o fluxo

## 🎨 Design Patterns da Fase

### Componentes Reutilizáveis:
- MetricsDisplay (usado em cards e detalhes)
- PeriodSelector (filtro de janela temporal)
- ChannelBadges (tags visuais)
- CTAButton (consistente em todo fluxo)

### Performance:
- Lazy loading de componentes pesados
- Cache de métricas por período
- Skeleton loading em todas as transições
- Static generation onde possível

## 📝 Notas Importantes

### Dados Mock:
- 12 canais com dados completos
- Métricas variam por período
- Histórico de 100+ tips por canal
- Reviews e FAQs realistas

### Mobile First:
- Todos os componentes mobile-optimized
- Drawer para filtros complexos
- Touch-friendly interactions
- Performance em 3G

## 🚀 Próximos Passos

1. **Implementar Feature 2.12** (Página de Detalhes)
   - Começar com estrutura base
   - Adicionar gráfico interativo
   - Implementar cards informativos
   - Testar responsividade

2. **Planejar Feature 2.13** (Fluxo de Assinatura)
   - Definir steps do multi-step
   - Criar wireframes
   - Preparar validações

3. **Preparar para Fase 4** (Integração Supabase)
   - Documentar todos os dados mock
   - Listar queries necessárias
   - Planejar migração gradual