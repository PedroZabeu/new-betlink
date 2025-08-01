# 🧱 Plano Detalhado - EPIC 2: Landing, Blog & Discovery - Fase 3

## 📌 Visão Geral
- **Objetivo**: Criar interface completa de descoberta de canais com dados mockados, página de detalhes e fluxo de assinatura até o ponto pré-pagamento
- **Tipo de Projeto**: Web App
- **Valor**: Estabelecer o funil principal de conversão da plataforma
- **Complexidade**: Alta
- **Prazo estimado**: 12-15 horas (2-3 dias)
- **Divisão de trabalho**: 85% Claude Code, 15% Cursor

## 🔍 Estado Atual

### Análise de Velocidade das Fases Anteriores
- **Fase 1 (Landing)**: Estimado 8-12h → Real 6h ✅ (50% mais rápido)
- **Fase 2 (Blog)**: Estimado 15-20h → Real 12h ✅ (40% mais rápido)
- **Velocity média**: 0.8x do tempo estimado
- **Qualidade mantida**: 100% dos testes aprovados

### O que já existe
- **Página /canais**: Já implementada com 6 canais mockados básicos
- **Componentes base**: Cards, filtros, grid responsivo
- **Header/Navigation**: Funcionando perfeitamente
- **Sistema de rotas**: App Router configurado

### O que precisa evoluir
- Cards atuais são básicos, faltam informações críticas
- Não há página de detalhes individual
- Sem fluxo de assinatura
- Dados mockados limitados (apenas 6 canais)

## 📋 Features Refinadas com Análise Completa

### Feature 2.11: Refinamento dos Cards de Canal
**Prioridade**: CRÍTICA  
**Executor Recomendado**: Claude Code  
**Estimativa refinada**: 3-4 horas (baseado na velocity atual: ~3h)

#### 📊 Análise Detalhada

1. **Objetivo funcional**: 
   - Usuário verá cards de canais com TODAS as informações necessárias para decisão de assinatura
   - Incluir: unidades/mês, odds média, casas principais, indicador de limitação
   - Melhorar hierarquia visual e hover effects

**Estrutura de Dados Expandida**:
```typescript
interface Channel {
  // ... campos existentes
  unitsPerMonth: number;        // ex: 45 unidades/mês
  averageOdds: number;          // ex: 2.15
  mainBookmakers: string[];     // ex: ["Bet365", "Betfair", "1xBet"]
  hasLimitations: boolean;      // indicador se limita contas
  limitationLevel: "low" | "medium" | "high"; // nível de limitação
  monthsActive: number;         // tempo de operação
  lastTipDate: string;          // última tip enviada
}
```

2. **Visível e testável?**: 
   - ✅ Sim - alterações imediatamente visíveis na página /canais
   - Teste: comparar card antes/depois, verificar responsividade, hover states

3. **Dependências**: 
   - Página /canais já existe ✅
   - Componentes UI base (Card, Badge) já importados ✅
   - Nenhuma dependência bloqueante

4. **Paralelizável?**: 
   - ❌ Não inicialmente - é a base para features seguintes
   - ✅ Sim após conclusão - Cursor pode testar enquanto Claude inicia 2.12

5. **Entrega parcial?**: 
   - ✅ Viável - pode entregar cards melhorados sem página de detalhes
   - Não há risco de inconsistência
   - Desbloqueia testes de UX imediatos

6. **Reaproveitamento**: 
   - Card component existente
   - Badge component para status
   - Estrutura de grid já implementada
   - Mock data structure pode ser expandida

7. **Justificativa executor**: 
   - Claude Code: refatoração de componente existente, adição de lógica complexa
   - Complexidade média, requer decisões de arquitetura

**Critérios de Aceitação**:
- [ ] 10-12 canais mockados com dados realistas e variados
- [ ] Novas informações visíveis: unidades/mês, odds média, casas, limitação
- [ ] Hover effects implementados e transições suaves
- [ ] Loading skeleton para cada card
- [ ] Grid responsivo mantido (2 colunas desktop, 1 mobile)
- [ ] Performance: renderização < 100ms com 12 cards

### Feature 2.12: Página de Detalhes do Canal
**Prioridade**: ALTA  
**Executor Recomendado**: Claude Code (90%) + Cursor (10% - testes)  
**Estimativa refinada**: 8-10 horas (ajustado pela complexidade das 4 abas + gráficos)

#### 📊 Análise Detalhada

1. **Objetivo funcional**: 
   - Página completa `/canais/[slug]` com TODAS informações do tipster
   - Sistema de abas: Overview, Estatísticas, Distribuições, Tips Recentes
   - Sidebar fixa com box de assinatura e calculadora de lucro

**Estrutura de Dados para Gráficos**:
```typescript
interface ChannelStats {
  evolutionData: {
    month: string;
    roi: number;
    profit: number;
    tips: number;
  }[];
  distributionData: {
    sport: string;
    count: number;
    winRate: number;
  }[];
  oddsDistribution: {
    range: string;    // "1.5-2.0", "2.0-3.0", etc
    count: number;
    profit: number;
  }[];
}
```

2. **Visível e testável?**: 
   - ✅ Sim - nova rota acessível, visual rico em dados
   - Teste: navegar entre abas, verificar gráficos, testar calculadora

3. **Dependências**: 
   - Feature 2.11 (cards devem ter link) ✅ 
   - Biblioteca de gráficos (Recharts recomendado)
   - Dados mockados expandidos

4. **Paralelizável?**: 
   - ✅ Parcialmente - após estrutura base, Cursor pode ajustar visual
   - Gráficos podem ser desenvolvidos em paralelo aos textos

5. **Entrega parcial?**: 
   - ✅ Sim - começar com Overview, adicionar abas incrementalmente
   - Mock de gráficos com imagens estáticas temporariamente
   - Calculadora pode vir em iteração seguinte

6. **Reaproveitamento**: 
   - Padrão de página individual do blog
   - Sistema de abas (Tabs component)
   - Layout com sidebar (similar ao blog filters)
   - Breadcrumbs component

7. **Justificativa executor**: 
   - Claude Code: arquitetura complexa, múltiplos componentes, gráficos
   - Cursor: ajustes visuais finais, testes de responsividade

**Critérios de Aceitação**:
- [ ] Rota dinâmica `/canais/[slug]` funcionando
- [ ] Header hero com informações do tipster
- [ ] 4 abas funcionais com conteúdo apropriado
- [ ] Mínimo 2 gráficos interativos (evolução + distribuição)
- [ ] Sidebar fixa no desktop, bottom bar no mobile
- [ ] Tips com blur para não-assinantes
- [ ] Tempo de carregamento < 2s

### Feature 2.13: Fluxo de Assinatura (Pré-Pagamento)
**Prioridade**: CRÍTICA  
**Executor Recomendado**: Claude Code (80%) + Cursor (20% - validação)  
**Estimativa refinada**: 4-5 horas (fluxo similar a multi-step forms)

#### 📊 Análise Detalhada

1. **Objetivo funcional**: 
   - Fluxo completo de 5 passos até "pré-checkout"
   - Captura de leads com validação completa
   - Persistência de dados entre steps

**Definição dos 5 Steps**:
```typescript
// Step 1: Verificação de Login
{ checkAuth: boolean, redirectUrl?: string }

// Step 2: Seleção de Plano
{ 
  plan: "monthly" | "quarterly" | "yearly",
  price: number,
  discount: number 
}

// Step 3: Dados Pessoais
{
  fullName: string,
  whatsapp: string,  // formato: (11) 98765-4321
  email: string,
  cpf?: string       // opcional
}

// Step 4: Método de Pagamento
{
  method: "credit_card" | "pix" | "boleto",
  saveMethod: boolean
}

// Step 5: Revisão e Confirmação
{
  summary: object,    // todos dados anteriores
  termsAccepted: boolean,
  leadCaptured: boolean  // flag para analytics
}
```

2. **Visível e testável?**: 
   - ✅ Sim - modal/página multi-step com progresso visual
   - Teste: completar fluxo, voltar passos, validações

3. **Dependências**: 
   - Botão "Assinar" nos cards (2.11) ✅
   - CTA na página de detalhes (2.12) ✅
   - Sistema de auth para detectar login

4. **Paralelizável?**: 
   - ❌ Não com 2.12 - precisa dos CTAs implementados
   - ✅ Sim internamente - steps podem ser desenvolvidos em paralelo

5. **Entrega parcial?**: 
   - ✅ Muito viável - entregar step por step
   - Começar com modal básico, adicionar steps incrementalmente
   - Validações podem vir depois

6. **Reaproveitamento**: 
   - Form components do auth flow
   - Modal/Dialog components
   - Validation patterns estabelecidos
   - Loading states do blog

7. **Justificativa executor**: 
   - Claude Code: lógica de estado complexa, validações, persistência
   - Cursor: testes end-to-end do fluxo completo

**Critérios de Aceitação**:
- [ ] 5 steps completos e navegáveis
- [ ] Validação em tempo real dos campos
- [ ] Máscara para WhatsApp brasileiro
- [ ] Cálculo automático de descontos
- [ ] Dados persistem ao navegar entre steps
- [ ] Mensagem clara sobre pagamento futuro
- [ ] Mobile-friendly (steps empilhados)

## 🚀 Estratégia de Execução

### Grupo 1: Fundação (Dia 1 - 3-4h)
**Executor**: Claude Code
- Feature 2.11: Refinamento dos Cards
  - Expandir mock data para 10-12 canais com novos campos
  - Adicionar novas informações aos cards (unidades, odds, casas, limitação)
  - Implementar hover effects e skeletons com React.memo
  - Criar tipos TypeScript robustos

### Grupo 2: Experiência Core (Dia 1-2 - 8-10h)
**Executor**: Claude Code (início) → Misto (refinamento)
- Feature 2.12 Parte 1: Estrutura base da página (Claude - 2h)
  - Rota dinâmica e layout
  - Header hero e informações básicas
  - Sistema de abas vazio
- Feature 2.12 Parte 2: Conteúdo das abas (Claude - 4-5h)
  - Overview com descrição rica e estatísticas
  - 2 Gráficos interativos com Recharts (evolução + distribuição)
  - Tips mockadas com blur effect
  - Calculadora de lucro básica
- Feature 2.12 Parte 3: Polish (Cursor - 1-2h)
  - Ajustes visuais
  - Testes de responsividade
  - Validação de performance

### Grupo 3: Conversão (Dia 2-3 - 4-5h)
**Executor**: Claude Code → Cursor (validação)
- Feature 2.13: Fluxo completo de assinatura
  - Implementar 5 steps sequencialmente
  - Sistema de validação
  - Persistência e navegação
  - Testes end-to-end (Cursor)

### Alocação de Recursos:
- **Claude Code**: 85% - Arquitetura, componentes complexos, lógica
- **Cursor**: 15% - Testes visuais, validação de fluxo, ajustes finos

## 🔄 Alterações do Plano Original

### Otimizações identificadas:
1. **Página ao invés de modal** para detalhes (melhor SEO e UX)
2. **Recharts ao invés de Chart.js** (melhor integração com React)
3. **12 canais ao invés de 10** (grid 3x4 mais harmônico)
4. **Skeleton individual por card** (melhor percepção de performance)

### Simplificações estratégicas:
1. **Sem infinite scroll inicialmente** - paginação simples
2. **2 gráficos ao invés de 4** - foco no essencial
3. **Calculadora básica** - sem gráfico de projeção inicialmente

## 🚦 Riscos e Mitigações

### Risco 1: Complexidade dos gráficos
- **Probabilidade**: Média
- **Impacto**: Alto (3-4h extras)
- **Mitigação**: Começar com gráficos simples, exemplos do Recharts
- **Plano B**: Usar gráficos estáticos temporariamente

### Risco 2: Performance com 12 cards
- **Probabilidade**: Baixa (já temos 6 funcionando bem)
- **Impacto**: Médio (1-2h para otimizar)
- **Mitigação**: Implementar React.memo e useMemo desde o início
- **Plano B**: Lazy loading dos cards fora da viewport com Intersection Observer

### Risco 3: Fluxo de assinatura muito complexo
- **Probabilidade**: Média
- **Impacto**: Alto (confusão do usuário)
- **Mitigação**: Simplicidade primeiro, features depois
- **Plano B**: Reduzir para 3 steps essenciais

## 📊 Progress Tracker Completo

```markdown
## 🎯 EPIC 2: Landing, Blog & Discovery - Progress: 55.5%

### 📈 Progresso Visual: ██████████░░░░░░░░░░ 55.5%

### 📋 Features Detalhadas:

#### ✅ Fases 1-2: Completas (10/10 features)
[Detalhes já documentados]

#### 🟦 Fase 3: Discovery de Canais (0/3) - INICIANDO

##### ⬜ Feature 2.11: Refinamento dos Cards (0%)
- **Tipo**: Web App - UI Component
- **Executor**: Claude Code
- **Objetivo**: Cards com todas informações para decisão
- **Dependências**: Nenhuma
- **Paralelização**: Base para próximas
- **Status**: Pronto para iniciar
- **ETA**: 3 horas

##### ⬜ Feature 2.12: Página de Detalhes (0%)
- **Tipo**: Web App - Página complexa
- **Executor**: Claude Code + Cursor
- **Objetivo**: Conversão através de informação completa
- **Dependências**: Links dos cards (2.11)
- **Paralelização**: Após 2.11 iniciada
- **Status**: Aguardando 2.11
- **ETA**: 6-8 horas

##### ⬜ Feature 2.13: Fluxo de Assinatura (0%)
- **Tipo**: Web App - Multi-step form
- **Executor**: Claude Code → Cursor (testes)
- **Objetivo**: Captura de leads qualificados
- **Dependências**: CTAs implementados (2.11, 2.12)
- **Paralelização**: Após 2.12 ter CTAs
- **Status**: Aguardando predecessoras
- **ETA**: 4-5 horas

### 📊 Métricas da Fase 3
- **Tempo total estimado**: 15-19 horas (ajustado após revisão)
- **Com base na velocity**: ~12-15 horas esperadas
- **Complexidade**: Alta (gráficos e multi-step)
- **Risco técnico**: Médio (mitigações identificadas)
```

## ✅ Definição de "Pronto" - Fase 3

A Fase 3 estará completa quando:
- ✓ 10-12 canais renderizando com performance < 100ms
- ✓ Página de detalhes com mínimo 2 gráficos funcionais
- ✓ Fluxo de assinatura capturando dados (sem integração)
- ✓ Todos os componentes responsivos
- ✓ Loading states em todas as interações
- ✓ Zero regressões nas features anteriores
- ✓ Documentação de handover para Fase 4

## 🎯 Preparação para Fase 4 (Supabase)

Durante a implementação, já preparar:
1. **Interfaces TypeScript** que mapearão para tabelas
2. **Estrutura de queries** necessárias
3. **Mock data compatível** com schema futuro
4. **Componentes agnósticos** a fonte de dados

Isso facilitará enormemente a transição de mock para real na Fase 4!