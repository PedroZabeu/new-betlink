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
- [ ] Test users for each role (master, admin, tipster, client)
- [ ] Seed data for channels (10 fake channels)
- [ ] Mock Telegram bot responses (needed for EPIC 6)
- [ ] Mock Stripe webhooks (needed for EPIC 5)
```

---

## 🎯 EPIC 1: Sistema Base com Autenticação e Navegação

### Status: ⬜ Pending
### Start Date: 2025-01-24
### Target End: 2025-01-31
### Progress File: `docs/epics/epic-1-base-system/progress.md`

#### Objetivo
Implementar e testar o sistema completo de autenticação com roles, criando todas as páginas como placeholders e garantindo controle de acesso funcional.

#### Features Checklist:

```markdown
- [ ] Feature 1.1: Base Infrastructure
  - [ ] Remover componentes do tutorial
  - [ ] Criar landing page básica
  - [ ] Header com logo e área de auth
  - [ ] Navigation bar com dropdown
  - [ ] Páginas de erro e access denied
  - [ ] Test: Ver nova home e navigation

- [ ] Feature 1.2: Database Schema + Auth Pages
  - [ ] Criar tabela profiles com enum roles
  - [ ] Trigger de sincronização users → profiles
  - [ ] Página de login funcional
  - [ ] Página de signup funcional
  - [ ] Sistema de logout
  - [ ] Test: Criar conta, login, logout

- [ ] Feature 1.3: Client Pages + Access Control
  - [ ] /cliente/dashboard - placeholder
  - [ ] /cliente/assinaturas - placeholder
  - [ ] /cliente/historico - placeholder
  - [ ] Middleware redirecionando não-autorizados
  - [ ] Test: Todos os roles tentando acessar

- [ ] Feature 1.4: Tipster Pages + Access Control
  - [ ] /tipster/dashboard - placeholder
  - [ ] /tipster/canais - placeholder
  - [ ] /tipster/assinantes - placeholder
  - [ ] /tipster/metricas - placeholder
  - [ ] Test: Todos os roles tentando acessar

- [ ] Feature 1.5: Admin Pages + Access Control
  - [ ] /admin/dashboard - placeholder
  - [ ] /admin/tipsters - placeholder
  - [ ] /admin/clientes - placeholder
  - [ ] /admin/canais - placeholder
  - [ ] Test: Todos os roles tentando acessar

- [ ] Feature 1.6: Master Pages + Test Users
  - [ ] /master/dashboard - placeholder
  - [ ] /master/configuracoes - placeholder
  - [ ] Criar 4 usuários de teste (um por role)
  - [ ] Documentar credenciais
  - [ ] Test: Cada usuário acessando suas páginas

- [ ] Feature 1.7: Polish + Final Testing
  - [ ] Melhorias visuais no header/nav
  - [ ] Avatar do usuário no header
  - [ ] Testes de fluxo completo
  - [ ] Documentação de handover
  - [ ] Test: Fluxo completo funcionando
```

---

## 🎯 EPIC 2: Discovery de Canais (Área Pública)

### Status: ⬜ Pending
### Dependencies: EPIC 1
### Start Date: -
### End Date: -
### Progress File: `docs/epics/epic-2-channel-discovery/progress.md`

#### Features Checklist:

```markdown
- [ ] Feature 2.1: Landing Page Completa
  - [ ] Hero section com CTA
  - [ ] Seção "Como funciona"
  - [ ] Grid de canais em destaque
  - [ ] Estatísticas da plataforma
  - [ ] Footer com links
  - [ ] Test: Todas as seções renderizando

- [ ] Feature 2.2: Página de Lista de Canais
  - [ ] Rota /canais pública
  - [ ] Componente de card de canal
  - [ ] Grid responsivo
  - [ ] Estados de loading e vazio
  - [ ] Dados mockados de canais
  - [ ] Test: Ver lista de canais mockados

- [ ] Feature 2.3: Filtros e Busca
  - [ ] Sidebar de filtros
  - [ ] Filtro por preço
  - [ ] Filtro por ROI
  - [ ] Filtro por esporte/mercado
  - [ ] Busca por nome
  - [ ] Test: Filtros funcionando em tempo real

- [ ] Feature 2.4: Página Individual do Canal
  - [ ] Rota /canal/[id]
  - [ ] Header com infos do tipster
  - [ ] Métricas detalhadas
  - [ ] Descrição e regras
  - [ ] CTA para assinatura
  - [ ] Test: Navegar para detalhes do canal

- [ ] Feature 2.5: Modal de Assinatura
  - [ ] Modal com planos/preços
  - [ ] Integração com auth
  - [ ] Redirecionamento pós-login
  - [ ] Preview para não-logados
  - [ ] Test: Fluxo completo de interesse em assinar
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

### Overall Progress: 0/42 Features (0%)

```
EPIC 1: ⬜ 0/7 features (0%)
EPIC 2: ⬜ 0/5 features (0%)
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
<!-- Claude Code adiciona decisões aqui -->

### Débito Técnico:
<!-- Rastrear itens para refatorar depois -->

### Aprendizados:
<!-- Documentar descobertas importantes -->

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