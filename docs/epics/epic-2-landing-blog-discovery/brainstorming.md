# EPIC 2: Landing, Blog & Discovery - Brainstorming

## = Todo List Completo - Todas as Features Concludas

###  Fase 1: Landing Page Polish (5 features)
- [x] **Feature 2.1**: Indicador de Pgina Ativa (underline) - Navegao com underline indicando pgina atual
- [x] **Feature 2.2**: Seo de Vantagens - 4 cards de vantagens substituindo nmeros genricos
- [x] **Feature 2.3**: Melhorar Textos Seo Como Funciona - Textos mais claros e relevantes
- [x] **Feature 2.4**: Seo CTA para Blog - Call-to-action para o blog antes do footer
- [x] **Feature 2.5**: Landing Page Polish - Otimizaes de performance e acessibilidade

###  Fase 2: Blog Educacional (5 features)
- [x] **Feature 2.6**: Novos Posts de Apostas - 4 posts educacionais sobre apostas (1500+ palavras cada)
- [x] **Feature 2.7**: Sistema de Tags e Categorias - Filtros funcionais por categoria e tags com contadores
- [x] **Feature 2.8**: Pginas Individuais de Posts - Pginas dinmicas com navegao, compartilhamento e posts relacionados
- [x] **Feature 2.9**: Sistema de Busca no Blog - Busca inteligente com scoring e highlight de termos
- [x] **Feature 2.10**: Performance Blog (SSG + Skeletons) - Static Generation, loading states e otimizaes

###  Fase 3: Discovery de Canais (3 features)
- [x] **Feature 2.11**: Refinamento dos Cards - Cards com 6 mtricas, tags, filtros avanados e ordenao
- [x] **Feature 2.12**: Pgina de Detalhes do Canal - Pgina completa com grficos, planos, mtricas e reviews
- [x] **Feature 2.13**: Fluxo de Checkout Completo - 5 steps de checkout com validaes e mscaras brasileiras

###  Fase 4: Integrao Supabase (4 features)
- [x] **Feature 2.14**: Setup Supabase + Tabelas Core + Pgina de Status - 5 tabelas criadas comndices e pgina de monitoramento
- [x] **Feature 2.15**: Popular Dados + Queries Bsicas + Dashboard de Comparao - 123 registros inseridos e dashboard de migrao
- [x] **Feature 2.16**: Migrar Listagem de Canais para Supabase - Listagem usando dados reais com badge "Live Data"
- [x] **Feature 2.17**: Resolver Tech Debt da Feature 2.16 - 6 tech debts resolvidos (tipsters, detalhes, mtricas, error handling, logs, keys)

###  Fase 5: Sistema de Métricas Reais (5 features)
- [ ] **Feature 2.18**: Criar Tabela Tips e Sistema de Métricas Dinâmicas
- [ ] **Feature 2.19**: Implementar Gráfico de Performance Real
- [ ] **Feature 2.20**: Migrar Todas as Métricas para Cálculo Dinâmico
- [ ] **Feature 2.21**: Timeline de Tips Recentes
- [ ] **Feature 2.22**: Polish Final e Documentação do Epic 2

## = Detalhamento das Features Finais

### 🔴 Feature 2.18: Criar Tabela Tips e Sistema de Métricas Dinâmicas

**Objetivo Principal**: Criar a infraestrutura de dados que permitirá calcular todas as métricas (ROI, Win Rate, MDD, etc) baseadas em apostas reais, eliminando valores hardcoded.

**O que será implementado**:
- Uma tabela `tips` completa no Supabase que armazenará todas as apostas dos tipsters
- Cada tip terá informações detalhadas: esporte, liga, evento, mercado, odds, stake, resultado e lucro/prejuízo
- Funções PostgreSQL para calcular ROI, Win Rate, Drawdown e outras métricas em tempo real
- Sistema de cache inteligente para manter performance mesmo com muitos dados
- Badge visual "Real-time Metrics ⚡" para indicar quando os dados são calculados dinamicamente

**Por que é importante**: Atualmente as métricas são valores fixos na tabela. Com essa feature, todas as métricas serão calculadas automaticamente baseadas no histórico real de apostas, tornando a plataforma muito mais transparente e confiável.

**Nota importante**: Esta feature foca apenas na infraestrutura de dados. O sistema de criação e gerenciamento de tips pelos tipsters ficará para o Epic específico dos tipsters.

### 🔴 Feature 2.19: Implementar Gráfico de Performance Real

**Objetivo Principal**: Substituir o gráfico placeholder por uma visualização real da evolução do bankroll baseada no histórico de tips.

**O que será implementado**:
- Gráfico interativo mostrando a evolução do lucro acumulado ao longo do tempo
- Diferentes períodos de visualização (7 dias, 30 dias, 3 meses, 6 meses, 1 ano)
- Área destacada para períodos de drawdown (quando o lucro cai)
- Pontos de destaque para dias com performance excepcional
- Tooltip rico mostrando detalhes de cada ponto do gráfico
- Animações suaves quando trocar entre períodos

**Por que é importante**: O gráfico atual é apenas visual. Com dados reais, os usuários poderão ver exatamente como o tipster performou ao longo do tempo, incluindo períodos bons e ruins, aumentando a transparência.

### 🟡 Feature 2.20: Migrar Todas as Métricas para Cálculo Dinâmico

**Objetivo Principal**: Remover completamente a dependência de valores hardcoded na tabela channel_metrics e usar apenas cálculos em tempo real.

**O que será implementado**:
- Substituir todas as queries que buscam métricas estáticas por chamadas para funções de cálculo
- Sistema de cache no frontend para evitar recálculos desnecessários
- Animações sutis quando os valores mudarem
- Fallback para valores mockados caso haja erro no cálculo
- Indicadores visuais de quando os dados são "live" vs "cached"

**Por que é importante**: Esta é a feature que conecta tudo. Todas as métricas em todas as páginas (listagem, detalhes, cards) passarão a usar dados reais calculados automaticamente.

### 🟢 Feature 2.21: Timeline de Tips Recentes

**Objetivo Principal**: Adicionar uma seção visual na página de detalhes mostrando as últimas apostas do canal, aumentando transparência e engajamento.

**O que será implementado**:
- Timeline visual mostrando as últimas 20 apostas do canal
- Cada tip mostra: evento, esporte, odds, stake, resultado e lucro/prejuízo
- Sistema de blur para não-assinantes (mostra apenas informações básicas)
- Filtros para mostrar apenas wins, losses ou pending
- Estatísticas resumidas ("12 wins, 8 losses nas últimas 20")
- Call-to-action para assinantes verem detalhes completos

**Por que é importante**: Aumenta significativamente a transparência. Os usuários podem ver o histórico recente real do tipster antes de assinar, não apenas métricas agregadas.

**Nota importante**: O sistema de blur garante que apenas assinantes vejam detalhes completos, incentivando assinaturas.

### 🟢 Feature 2.22: Polish Final e Documentação do Epic 2

**Objetivo Principal**: Garantir que todas as 21 features estejam polidas, documentadas e o Epic seja entregue com excelência.

**O que será implementado**:
- Auditoria completa de performance (Lighthouse > 85 em todas as páginas)
- Verificação de consistência visual em todo o design system
- Testes E2E cobrindo todo o fluxo do Epic 2
- Documentação técnica completa de todas as funções SQL criadas
- Limpeza de código (remover TODOs, imports não utilizados, warnings)
- Checklist de entrega com backup do banco e monitoring configurado
- Dashboard de métricas do Epic 2 mostrando todas as conquistas

**Por que é importante**: Um Epic deste tamanho merece uma entrega polida e bem documentada. Esta feature garante que tudo esteja funcionando perfeitamente e preparado para o próximo Epic.

## = Resumo do EPIC 2

**Total de Features**: 22  
**Status**: 19/22 Completo (86.4%)  
**Período**: Janeiro - Fevereiro 2025  

### Principais Conquistas:
1. **Landing Page** totalmente otimizada com Lighthouse > 90
2. **Blog** completo com 4 posts, filtros, busca e páginas dinâmicas
3. **Discovery** de canais com filtros avançados e páginas de detalhes
4. **Checkout** funcional com 5 steps e validações brasileiras
5. **Supabase** integrado com dados reais substituindo mocks
6. **Sistema de Métricas Reais** (em desenvolvimento) - Cálculos dinâmicos baseados em apostas reais

### Métricas de Sucesso:
- Performance < 3s em todas as páginas
- Zero bugs críticos em produção
- 100% das features testadas com E2E
- Dados reais do Supabase na listagem e detalhes
- Sistema de busca < 200ms para 50+ posts
- Checkout com recovery de abandono
- Métricas calculadas em tempo real (após Feature 2.20)

### Tecnologias Implementadas:
- Next.js 15 com App Router
- Supabase (PostgreSQL)
- TypeScript com tipos seguros
- Tailwind CSS + shadcn/ui
- Recharts para gráficos
- Framer Motion para animações
- React Hook Form + Zod
- Playwright para testes E2E

### Aprendizados Principais:
1. **Arquitetura Híbrida**: Server Components para dados + Client Components para interatividade
2. **Performance First**: SSG, lazy loading, debounce e otimizações desde o início
3. **Error Handling**: Boundaries globais + páginas de erro específicas
4. **Dados Reais**: Migração incremental de mocks para Supabase
5. **Tech Debt**: Resolver imediatamente evita acumulação
6. **Métricas Dinâmicas**: Cálculos em tempo real aumentam transparência e confiança

---

*EPIC 2 em desenvolvimento! 3 features finais para completar o sistema de métricas reais.*

---

## 📝 Notas para EPICs Futuros

### Para o EPIC de Dashboard de Clientes:
- **Sistema de Ocupação Real**: A taxa de ocupação dos canais está mockada atualmente. Quando implementarmos o dashboard de clientes e sistema de assinaturas, precisaremos:
  - Tabela `channel_subscriptions` para assinantes ativos
  - View calculando ocupação real (subscribers_count / max_subscribers)
  - Sistema de waitlist funcional quando canal estiver lotado
  - Atualização em tempo real das vagas disponíveis
  - Por enquanto, manter os valores mockados é suficiente

### Para o EPIC de Dashboard dos Tipsters:
- **Sistema de Criação de Tips**: A tabela `tips` criada na Feature 2.18 será a base para:
  - Interface de criação de apostas pelos tipsters
  - Sistema de aprovação de tips
  - Notificações para assinantes sobre novas apostas
  - Dashboard de performance individual do tipster
  - Sistema de análise e estatísticas avançadas

### Para o EPIC de Sistema de Pagamentos:
- **Integração com Checkout**: O fluxo de checkout da Feature 2.13 será integrado com:
  - Gateway de pagamento real (Stripe, PagSeguro, etc.)
  - Sistema de assinaturas recorrentes
  - Gestão de planos e preços
  - Sistema de reembolso e cancelamentos
  - Relatórios financeiros para tipsters