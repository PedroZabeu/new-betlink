# BetLink - Project Master Plan

## 📋 Status Legend
- ⬜ **Pending**: Not started
- 🟦 **In Progress**: Currently working
- ✅ **Done**: Completed and tested
- ❌ **Blocked**: Has dependencies or issues
- 🔄 **Revised**: Modified from original plan
- 🧪 **Mock**: Temporary implementation for testing

---

## 🎨 Mock Data & Placeholders Tracking

### Active Mocks:
```markdown
<!-- AI updates this section as it creates/removes mocks -->
- [✅] Test users for each role (master, admin, tipster, cliente) - Created in Feature 1.2
- [✅] Mock data for channels (6 fake channels) - Created in Feature 1.6
- [✅] Mock blog posts (8 posts) - Created in Feature 1.6
- [ ] Mock Telegram bot responses (needed for EPIC 6)
- [ ] Mock Stripe webhooks (needed for EPIC 5)
```

---

## 🎯 EPIC 1: Sistema Base com Autenticação e Navegação

### Status: ✅ Done
### Start Date: 2025-01-24
### End Date: 2025-01-25
### Progress File: `docs/epics/epic-1-base-system/progress.md`
### Handover File: `docs/epics/epic-1-base-system/handover.md`

#### Objetivo
Implementar e testar o sistema completo de autenticação com roles, criando todas as páginas como placeholders e garantindo controle de acesso funcional.

#### Features Checklist:

```markdown
- [✅] Feature 1.1: Base Infrastructure
  - [✅] Remover componentes do tutorial
  - [✅] Criar landing page básica
  - [✅] Header com logo e área de auth
  - [✅] Navigation bar com dropdown
  - [✅] Páginas de erro e access denied
  - [✅] Test: Ver nova home e navigation

- [✅] Feature 1.2: Database Schema + Auth Pages
  - [✅] Criar tabela profiles com enum roles
  - [✅] Trigger de sincronização users → profiles
  - [✅] Página de login funcional
  - [✅] Página de signup funcional
  - [✅] Sistema de logout
  - [✅] Test: Criar conta, login, logout

- [✅] Feature 1.3: Client Pages + Access Control
  - [✅] /cliente/dashboard - placeholder
  - [✅] /cliente/assinaturas - placeholder
  - [✅] /cliente/historico - placeholder
  - [✅] Middleware redirecionando não-autorizados
  - [✅] Test: Todos os roles tentando acessar

- [✅] Feature 1.4: Tipster Pages + Access Control
  - [✅] /tipster/dashboard - placeholder
  - [✅] /tipster/canais - placeholder
  - [✅] /tipster/assinantes - placeholder
  - [✅] /tipster/metricas - placeholder
  - [✅] Test: Todos os roles tentando acessar

- [✅] Feature 1.5: Admin Area Unificada + Access Control
  - [✅] /admin/dashboard - visão geral (admin e master)
  - [✅] /admin/tipsters - gerenciar tipsters (admin e master)
  - [✅] /admin/clientes - gerenciar clientes (admin e master)
  - [✅] /admin/canais - moderar canais (admin e master)
  - [✅] /admin/admins - gerenciar administradores (MASTER ONLY)
  - [✅] /admin/configuracoes - configurações do sistema (seções condicionais)
  - [✅] Test: Validar controle granular (master vê mais opções)

- [✅] Feature 1.6: Polish + Final Testing
  - [✅] Páginas institucionais (/sobre, /blog)
  - [⏳] Páginas de compliance (/termos, /privacidade) - aguardando Cursor
  - [✅] Sistema de cookie consent
  - [✅] Avatar do usuário no header (já implementado)
  - [✅] Testes de fluxo completo
  - [✅] Documentação de handover EPIC 1
  - [✅] Test: Fluxo completo funcionando
```

---

## 🎯 EPIC 2: Landing, Blog & Discovery

### Status: 🟦 In Progress
### Dependencies: EPIC 1
### Start Date: 2025-01-29
### End Date: -
### Progress File: `docs/epics/epic-2-landing-blog-discovery/progress.md`

#### Objetivo
Criar landing page completa, sistema de blog aprimorado e discovery de canais com interface moderna, dividido em 4 fases progressivas.

#### Features por Fase:

**Fase 1: Landing Page Features (5 features)**
```markdown
- [✅] Feature 2.1: Ajustes na Navegação
  - [✅] Underline para aba ativa
  - [✅] Hover states suaves
  - [✅] Transições fluidas
  - [✅] Test: Estados visuais corretos

- [✅] Feature 2.2: Seção de Vantagens
  - [✅] Remover números genéricos
  - [✅] 4 cards de vantagens
  - [✅] Grid responsivo
  - [✅] Test: Cards visíveis e alinhados

- [✅] Feature 2.3: Melhoria "Como Funciona"
  - [✅] Novos textos dos 3 passos
  - [✅] Manter layout atual
  - [✅] Test: Textos atualizados

- [✅] Feature 2.4: Seção CTA Blog
  - [✅] Call-to-action para blog
  - [✅] Design harmonioso
  - [✅] Test: Link funcionando

- [✅] Feature 2.5: Polimento Final
  - [✅] Performance optimization
  - [✅] Lighthouse > 90
  - [✅] Test: Métricas validadas
```

**Fase 2: Blog Features (5 features)**
```markdown
- [✅] Feature 2.6: Criar 4 Novos Posts sobre Apostas
  - [✅] Setup estrutura /_posts e configuração
  - [✅] Post 1: Métricas Essenciais nas Apostas Esportivas
  - [✅] Post 2: Entendendo o EV+ (Expected Value Positivo)
  - [✅] Post 3: Estratégias para Manter Contas Ativas
  - [✅] Post 4: Montando sua Carteira de Tipsters
  - [✅] Test: Posts renderizando em Markdown

- [✅] Feature 2.7: Sistema de Tags e Categorias - COMPLETO
  - [✅] Approach: Server Component + Client Interactivity (baseado em Next.js Blog Starter)
  - [✅] Estrutura Híbrida:
    * Server Component (/app/blog/page.tsx) - data loading com fs access
    * Client Component (/components/blog/blog-client.tsx) - filtros interativos
    * API utilitários (/lib/blog/api.ts) - baseado no Next.js starter pattern
  - [✅] Fase 1: Server Component com data loading (30min)
  - [✅] Fase 2: Client Component com filtros (45min)  
  - [✅] Fase 3: Integração e polish (15min)
  - [✅] Test: Filtros funcionando sem erros de fs/client

- [✅] Feature 2.8: Páginas Individuais de Posts - COMPLETO
  - [✅] Server Component /app/blog/[slug]/page.tsx
  - [✅] generateStaticParams para todas as páginas
  - [✅] Links clicáveis nos cards do blog
  - [✅] Breadcrumbs: Home > Blog > [Categoria] > [Post]
  - [✅] Posts relacionados (mesma categoria)
  - [✅] Reading Progress + Share Buttons + Post Navigation
  - [✅] Test: Static generation + navegação funcionando

- [✅] Feature 2.9: Sistema de Busca no Blog - COMPLETO
  - [✅] Componente SearchBar reutilizando Input
  - [✅] Busca client-side nos dados carregados com scoring inteligente
  - [✅] Debounce 300ms para performance otimizada
  - [✅] Highlight dos termos encontrados em títulos e excerpts
  - [✅] Integração perfeita com filtros existentes
  - [✅] Test: Busca retorna < 200ms com feedback visual

- [✅] Feature 2.10: Melhorias de Performance e UX - COMPLETO
  - [✅] Static Generation para todas as páginas (SSG)
  - [✅] generateStaticParams para posts + generateMetadata dinâmico
  - [✅] Skeleton loading para componentes client + ScrollToTop button
  - [✅] Lazy loading de imagens com blur placeholder + Cache system
  - [✅] Test: Lighthouse estimado 95+, TTI < 1s, validado via Playwright
```

**Fase 3: Discovery de Canais (3 features)**
```markdown
- [✅] Feature 2.11: Refinamento dos Cards
  - [✅] Cards com métricas: ROI, Lucro, MDD, Odds Média, Volume, Avaliação
  - [✅] Tags: esporte, bookmaker, método, mercado, liquidez
  - [✅] Sistema de filtros colapsáveis
  - [✅] Ordenação: popularidade, ROI, preço
  - [✅] 12 canais mockados
  - [✅] Test: Cards responsivos e filtros funcionando

- [✅] Feature 2.12: Página de Detalhes
  - [✅] Página completa do canal com cards organizados
  - [✅] Gráfico interativo com filtro de período (7d, 30d, 6m, YTD, Total)
  - [✅] Tabela de resultados com shadcn/ui Table
  - [✅] Cards: Métricas, Sobre, Avaliações, FAQ
  - [✅] Planos de assinatura flexíveis por tipster
  - [✅] Test: Gráfico atualiza com filtros, todos dados visíveis

- [✅] Feature 2.13: Fluxo de Checkout Completo
  - [✅] Multi-step até pagamento (6 etapas)
  - [✅] Máscaras customizadas (React 18+ compatível)
  - [✅] Test: Fluxo completo com Playwright MCP
```

**Fase 4: Integração Supabase (15 features)**

*Etapa 4.1: Foundation (3 features)*
```markdown
- [✅] Feature 2.14: Setup Supabase + Tabelas Core
  - [✅] Criar tabelas: channels, channel_tags, subscription_plans
  - [✅] Página /dev/supabase-status mostrando conexão
  - [✅] Dashboard visual com status de cada tabela
  - [✅] Test: Página mostra todas tabelas criadas

- [✅] Feature 2.15: Popular Dados + Queries Básicas
  - [✅] Migrar 12 canais mockados para banco (123 registros)
  - [✅] Dados 100% populados via MCP Supabase
  - [✅] Verificação de integridade realizada
  - [✅] Test: 4 tabelas populadas com sucesso

- [ ] Feature 2.16: Migrar Listagem de Canais
  - [ ] Substituir mock por dados reais em /canais
  - [ ] Badge "Live Data 🔴" indicando fonte
  - [ ] Filtros funcionando com banco
  - [ ] Test: Página com badge e dados do Supabase
```

*Etapa 4.2: Dados Dinâmicos (3 features)*
```markdown
- [ ] Feature 2.17: Sistema de Métricas Real
  - [ ] Tabela channel_metrics com períodos
  - [ ] Cálculo de ROI, MDD, winrate
  - [ ] Atualização via functions/triggers
  - [ ] Test: Métricas mudando em tempo real

- [ ] Feature 2.18: Ocupação e Waitlist Dinâmicos
  - [ ] Views para calcular ocupação
  - [ ] Sistema de waitlist funcional
  - [ ] Badges "Lotado" dinâmicos
  - [ ] Test: Ocupação refletindo assinantes reais

- [ ] Feature 2.19: Histórico de Tips
  - [ ] Tabela tips com resultados
  - [ ] Timeline de apostas
  - [ ] Cálculo de lucros/prejuízos
  - [ ] Test: Tips aparecendo na página de detalhes
```

*Etapa 4.3: Funcionalidades Interativas (3 features)*
```markdown
- [ ] Feature 2.20: Detalhes do Canal (Supabase)
  - [ ] Página completa com dados reais
  - [ ] Todas abas funcionando
  - [ ] Performance mantida
  - [ ] Test: Página idêntica mas 100% Supabase

- [ ] Feature 2.21: Sistema de Reviews
  - [ ] Tabela channel_reviews com RLS
  - [ ] Usuários podem avaliar
  - [ ] Rating médio calculado
  - [ ] Test: Deixar review e ver atualizar

- [ ] Feature 2.22: Gráficos Dinâmicos
  - [ ] Dados históricos reais
  - [ ] Filtros de período funcionais
  - [ ] Animações suaves
  - [ ] Test: Gráfico muda com período selecionado
```

*Etapa 4.4: Captura e Analytics (3 features)*
```markdown
- [ ] Feature 2.23: Salvar Leads no Banco
  - [ ] Tabela captured_leads
  - [ ] Integração com checkout flow
  - [ ] Validações server-side
  - [ ] Test: Lead salvo após checkout

- [ ] Feature 2.24: Dashboard de Leads
  - [ ] Nova rota /tipster/leads
  - [ ] Visualizar leads capturados
  - [ ] Filtros e exportação
  - [ ] Test: Tipster vê seus leads

- [ ] Feature 2.25: Analytics de Conversão
  - [ ] Métricas de abandono
  - [ ] Funil de conversão
  - [ ] Insights acionáveis
  - [ ] Test: Dashboard com métricas reais
```

*Etapa 4.5: Otimização e Polish (3 features)*
```markdown
- [ ] Feature 2.26: RLS e Segurança
  - [ ] Policies para todas tabelas
  - [ ] Página /dev/security-test com testes visuais
  - [ ] Botões testando cada permissão
  - [ ] Test: Página mostra todos testes passando

- [ ] Feature 2.27: Performance e Índices
  - [ ] Criar índices otimizados
  - [ ] Dashboard mostrando métricas de performance
  - [ ] Gráfico antes/depois da otimização
  - [ ] Test: Dashboard mostra queries < 100ms

- [ ] Feature 2.28: Real-time Updates
  - [ ] Subscriptions Supabase
  - [ ] Badge "LIVE 🔴" pulsando com updates
  - [ ] Dados atualizando sem refresh
  - [ ] Test: Ver mudanças em tempo real
```

---

## 🎯 EPIC 3: Central do Tipster

### Status: ⬜ Pending
### Dependencies: EPIC 1
### Start Date: -
### End Date: -
### Progress File: `docs/epics/epic-3-tipster-central/progress.md`

#### Features Checklist:

```markdown
- [ ] Feature 3.1: Dashboard do Tipster
  - [ ] Rota /tipster/dashboard
  - [ ] Cards com métricas principais
  - [ ] Lista de canais do tipster
  - [ ] Status de cada canal
  - [ ] Botão "Solicitar Canal"
  - [ ] Test: Ver dashboard com dados

- [ ] Feature 3.2: Sistema de Solicitação de Canal
  - [ ] Modal de solicitação
  - [ ] Formulário completo
  - [ ] Validações de campos
  - [ ] Salvar no banco
  - [ ] Feedback de sucesso
  - [ ] Test: Enviar solicitação

- [ ] Feature 3.3: Gestão de Assinantes
  - [ ] Rota /tipster/canal/[id]/assinantes
  - [ ] Tabela de assinantes
  - [ ] Filtros por status
  - [ ] Exportar lista
  - [ ] Métricas de retenção
  - [ ] Test: Ver e filtrar assinantes

- [ ] Feature 3.4: Sistema de Tips
  - [ ] Formulário de envio de tips
  - [ ] Template estruturado
  - [ ] Preview antes de enviar
  - [ ] Histórico de tips
  - [ ] Test: Criar e visualizar tips

- [ ] Feature 3.5: Métricas e Relatórios
  - [ ] Gráficos de evolução
  - [ ] Taxa de acerto
  - [ ] ROI acumulado
  - [ ] Relatório mensal
  - [ ] Test: Visualizar todas as métricas
```

---

## 🎯 EPIC 4: Painel Administrativo

### Status: ⬜ Pending
### Dependencies: EPIC 1, EPIC 3
### Start Date: -
### End Date: -
### Progress File: `docs/epics/epic-4-admin-panel/progress.md`

#### Features Checklist:

```markdown
- [ ] Feature 4.1: Dashboard Administrativo
  - [ ] KPIs da plataforma
  - [ ] Atividades recentes
  - [ ] Alertas e notificações
  - [ ] Gráficos de crescimento
  - [ ] Test: Dashboard carregando dados

- [ ] Feature 4.2: Gestão de Tipsters
  - [ ] CRUD de tipsters
  - [ ] Aprovar/rejeitar solicitações
  - [ ] Suspender/ativar tipsters
  - [ ] Histórico de ações
  - [ ] Test: Todas operações CRUD

- [ ] Feature 4.3: Gestão de Canais
  - [ ] Aprovar solicitações de canal
  - [ ] Editar informações
  - [ ] Moderar conteúdo
  - [ ] Definir destaques
  - [ ] Test: Aprovar canal e ver publicado

- [ ] Feature 4.4: Gestão de Clientes
  - [ ] Lista completa de clientes
  - [ ] Histórico de assinaturas
  - [ ] Resolver disputas
  - [ ] Comunicação em massa
  - [ ] Test: Filtrar e gerenciar clientes

- [ ] Feature 4.5: Relatórios e Finanças
  - [ ] Receita por período
  - [ ] Comissões a pagar
  - [ ] Exportar relatórios
  - [ ] Métricas de crescimento
  - [ ] Test: Gerar relatórios completos
```

---

## 🎯 EPIC 5: Sistema de Pagamentos

### Status: ⬜ Pending
### Dependencies: EPIC 1-4
### Start Date: -
### End Date: -
### Progress File: `docs/epics/epic-5-payment-system/progress.md`

#### Features Checklist:

```markdown
- [ ] Feature 5.1: Integração Stripe/Mercado Pago
  - [ ] Setup das contas
  - [ ] Configurar webhooks
  - [ ] Tokens de teste
  - [ ] Documentar fluxos
  - [ ] Test: Conexão funcionando

- [ ] Feature 5.2: Checkout de Assinatura
  - [ ] Página de checkout
  - [ ] Múltiplos métodos (cartão, PIX)
  - [ ] Cálculo de taxas
  - [ ] Confirmação de pagamento
  - [ ] Test: Pagamento teste completo

- [ ] Feature 5.3: Gestão de Assinaturas
  - [ ] Renovação automática
  - [ ] Cancelamento
  - [ ] Período de graça
  - [ ] Retry de pagamentos
  - [ ] Test: Ciclo completo de assinatura

- [ ] Feature 5.4: Split de Pagamentos
  - [ ] Calcular comissões
  - [ ] Distribuir valores
  - [ ] Relatório para tipsters
  - [ ] Comprovantes
  - [ ] Test: Split funcionando corretamente

- [ ] Feature 5.5: Códigos Promocionais
  - [ ] Sistema de cupons
  - [ ] Descontos por período
  - [ ] Primeira mensalidade grátis
  - [ ] Gestão pelo tipster
  - [ ] Test: Aplicar cupom no checkout
```

---

## 🎯 EPIC 6: Automação Telegram

### Status: ⬜ Pending
### Dependencies: Todos EPICs anteriores
### Start Date: -
### End Date: -
### Progress File: `docs/epics/epic-6-telegram-automation/progress.md`

#### Features Checklist:

```markdown
- [ ] Feature 6.1: Bot de Gestão de Membros
  - [ ] Configurar bot Telegram
  - [ ] Adicionar/remover membros
  - [ ] Sincronizar com assinaturas
  - [ ] Logs de ações
  - [ ] Test: Add/remove automático

- [ ] Feature 6.2: Recepção de Tips
  - [ ] Webhook para mensagens
  - [ ] Parser de template
  - [ ] Validar tipster
  - [ ] Salvar no banco
  - [ ] Test: Receber tip do Telegram

- [ ] Feature 6.3: Sistema de Resultados
  - [ ] Atualizar status das tips
  - [ ] Calcular lucros
  - [ ] Notificar canal
  - [ ] Atualizar métricas
  - [ ] Test: Resultado atualiza métricas

- [ ] Feature 6.4: Notificações Automáticas
  - [ ] Boas-vindas novos membros
  - [ ] Aviso de vencimento
  - [ ] Resumos semanais
  - [ ] Alertas importantes
  - [ ] Test: Notificações enviadas

- [ ] Feature 6.5: Comandos do Bot
  - [ ] /stats - estatísticas
  - [ ] /help - ajuda
  - [ ] /subscription - status
  - [ ] Comandos admin
  - [ ] Test: Todos comandos funcionando
```

---

## 📊 Progress Tracking

### Overall Progress: 19/54 Features (35.2%)

```
EPIC 1: ✅ 6/6 features (100%) - COMPLETE
EPIC 2: 🟦 13/28 features (46.4%) - Fase 1 ✅, Fase 2 ✅, Fase 3 ✅, Fase 4 🟦 IN PROGRESS (Etapa 4.1)
EPIC 3: ⬜ 0/5 features (0%)
EPIC 4: ⬜ 0/5 features (0%)
EPIC 5: ⬜ 0/5 features (0%)
EPIC 6: ⬜ 0/5 features (0%)
```

---

## 🔄 How to Update Status

### Para o Claude Code:

1. **Iniciando uma Feature**:
   ```markdown
   - [ ] → - [🟦] Feature name (marcar como In Progress)
   Atualizar status do EPIC para 🟦 In Progress
   Criar arquivo em docs/features/planning/
   ```

2. **Completando uma Feature**:
   ```markdown
   - [🟦] → - [✅] Feature name (marcar como Done)
   Se todas features prontas, atualizar EPIC para ✅ Done
   Criar arquivo em docs/features/handover/
   ```

3. **Bloqueios**:
   ```markdown
   - [🟦] → - [❌] Feature name (marcar como Blocked)
   Adicionar comentário: "BLOCKED: [razão]"
   ```

---

## 📝 Seção de Notas

### Decisões Importantes:
- **25/01/2025**: Feature 1.1 - Optado por menu horizontal no mobile (hambúrguer adiado)
- **25/01/2025**: Logo BetLink como SVG inline para melhor performance
- **25/01/2025**: Theme system via cookies para evitar flash
- **25/01/2025**: Feature 1.2 - Todos os usuários entram como 'cliente' por padrão
- **25/01/2025**: Feature 1.2 - Roles só podem ser alterados por admin/master via SQL
- **25/01/2025**: Feature 1.5 - Área admin unificada para admin e master com controle granular
- **25/01/2025**: Feature 1.6 - Blog e Canais implementados, termos/privacidade delegados para Cursor
- **26/01/2025**: Implementado sistema de logging centralizado substituindo todos console.*
- **26/01/2025**: Menu hamburger mobile implementado resolvendo navegação em dispositivos móveis
- **26/01/2025**: Testes E2E manuais validados com 100% de aprovação

### Débito Técnico:
- ~~Menu hambúrguer mobile~~ ✅ Implementado (26/01/2025)
- ~~Sistema de logging estruturado~~ ✅ Implementado (26/01/2025)
- ~~Páginas de termos e privacidade~~ ✅ Implementado por Cursor
- ~~Testes E2E~~ ✅ Validado manualmente (26/01/2025) - Ver `/docs/testing/manual-e2e-test-report.md`

**Status: ZERO débito técnico! 🎉**

### Aprendizados:
- Supabase SSR (`@supabase/ssr`) simplifica muito a integração
- Middleware é crítico para manter sessão atualizada
- Documentar durante desenvolvimento economiza ~30min
- **RLS policies precisam incluir INSERT para triggers funcionarem**
- **Usuários de teste devem ser criados via signup, não SQL direto**
- **Separação client/server é mandatória no Next.js 13+**
- **Reuso de componentes acelera desenvolvimento em 50%+ após Feature 1.3**
- **Trabalho paralelo Claude/Cursor maximiza eficiência**
- **Cookie consent deve aparecer após 1s para melhor UX**
- **29/01/2025 - CRÍTICO: Next.js App Router Server/Client boundaries**
  - ❌ fs, path, gray-matter NÃO funcionam em Client Components ('use client')
  - ✅ Server Components podem acessar file system naturalmente
  - ✅ Approach Híbrida: Server loads data + Client handles interactivity
  - ✅ Padrão Next.js Blog Starter é referência gold standard
- **29/01/2025 - Arquitetura recomendada para features com dados + interatividade:**
  - Server Component: data loading, fs access, static generation
  - Client Component: filtros, estados, interatividade, URL sync
  - Separação clara de responsabilidades evita conflitos
- **01/02/2025 - react-input-mask incompatível com React 18+:**
  - ❌ findDOMNode deprecated causa erro fatal
  - ✅ Solução: Criar componente MaskedInput customizado
  - ✅ Approach controlada sem refs diretas ao DOM
- **02/02/2025 - Início da Fase 4 (Integração Supabase) - Etapa 4.1:**
  - ✅ Tabelas antigas deletadas (channels, tips, channel_metrics_cache)
  - ✅ Estrutura limpa mantendo apenas profiles e auth.users
  - 🟦 Feature 2.14 em planejamento detalhado
  - 📋 Etapa 4.1 dividida em 3 features focadas em foundation

---

## 🚀 Getting Started

### Pré-requisitos:
- [ ] Node.js 18+ instalado
- [ ] Conta Supabase criada
- [ ] Repositório Git inicializado
- [ ] Token bot Telegram (para EPICs posteriores)
- [ ] Conta Stripe/MP (para EPICs posteriores)

### Primeiros Passos:
1. **Iniciar EPIC 1**: Sistema Base com Autenticação
2. **Criar arquivo de progresso**: `docs/epics/epic-1-base-system/progress.md`
3. **Começar com Feature 1.1**: Landing Page e Header
4. **Atualizar este master plan** conforme progresso

---

## 🎯 Critérios de Conclusão do Projeto

### MVP Pronto:
- [ ] EPICs 1-3 completos
- [ ] Autenticação funcionando
- [ ] Discovery de canais operacional
- [ ] Gestão de tipsters básica
- [ ] Sem bugs críticos

### Produção Pronta:
- [ ] Todos EPICs 1-6 completos
- [ ] Sistema de pagamento operacional
- [ ] Automação Telegram funcionando
- [ ] Todos testes passando
- [ ] Performance otimizada
- [ ] Segurança revisada
- [ ] Documentação completa

**Tempo Estimado**: 6-8 semanas para MVP, 12-16 semanas para produção completa