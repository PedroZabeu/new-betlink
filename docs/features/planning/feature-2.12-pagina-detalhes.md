# Feature 2.12: Página de Detalhes do Canal

## 📋 Descrição
Criar página completa e detalhada para cada canal de tipster, com todas as informações necessárias para conversão, incluindo métricas dinâmicas por período e visualização profissional dos resultados.

## 🎯 Objetivos
- Apresentar informações completas do canal de forma organizada
- Implementar filtro de janela temporal para métricas (estilo Bet Analytix)
- Criar gráfico interativo de evolução do bankroll
- Mostrar resultados recentes em tabela profissional
- Exibir planos de assinatura flexíveis (mensal, trimestral, semestral, temporada)
- Maximizar conversão com CTAs estratégicos e opções de planos

## 🧪 Teste Humano

### Cenário Principal
1. Acessar `/canais/[slug]` de um canal específico
2. Verificar carregamento de todos os cards
3. Testar seletor de período (7d, 30d, 3m, 6m, 1a, Total)
4. Confirmar que gráfico e métricas atualizam com a janela
5. Verificar responsividade em mobile/tablet
6. Testar botões de assinatura

### Validações Específicas
- [ ] Header com informações básicas carrega corretamente
- [ ] Card de planos mostra opções disponíveis para o tipster
- [ ] Planos exibem preços, descontos e duração corretamente
- [ ] Gráfico renderiza e é interativo (hover tooltips)
- [ ] Métricas atualizam ao mudar período
- [ ] Tabela de resultados mostra dados formatados
- [ ] Cards empilham corretamente no mobile
- [ ] Loading states aparecem durante transições
- [ ] CTAs funcionam e são visíveis

## 🔧 Implementação Técnica

### Arquitetura Escalável
- **Uma página dinâmica**: `/app/canais/[slug]/page.tsx` renderiza TODOS os canais
- **Dados centralizados**: Expandir `/lib/data/mock-channels.ts` com detalhes
- **Zero pastas por tipster**: Uso de roteamento dinâmico do Next.js
- **generateStaticParams**: Para pre-renderizar todas as páginas

### Estrutura de Componentes
```
/app/canais/[slug]/
  └── page.tsx (Server Component - dados iniciais)

/components/channels/detail/
  ├── channel-header.tsx
  ├── subscription-plans-card.tsx (Client Component - seleção de planos)
  ├── metrics-card.tsx (Client Component - filtros)
  ├── performance-chart.tsx (Recharts)
  ├── results-table.tsx (shadcn Table)
  ├── about-card.tsx
  ├── reviews-card.tsx
  └── faq-card.tsx
```

### Dados Mockados Necessários
```typescript
interface ChannelDetail {
  // Básico
  id: string
  slug: string
  name: string
  avatar: string
  rating: number
  subscribersCount: number
  description: string
  
  // Planos de Assinatura (flexível por tipster)
  subscriptionPlans: SubscriptionPlan[]
  
  // Métricas por período
  metrics: {
    [period: string]: {
      roi: number
      profit: number
      winRate: number
      totalBets: number
      avgOdds: number
      maxDrawdown: number
      chartData: ChartPoint[]
    }
  }
  
  // Resultados
  recentTips: Tip[]
  
  // Informações
  about: {
    bio: string
    methodology: string
    specialties: string[]
    experience: string
  }
  
  reviews: Review[]
  faqs: FAQ[]
}

interface SubscriptionPlan {
  id: string
  name: string // "Mensal", "Trimestral", "Semestral", "Temporada"
  duration: number // em dias
  price: number
  originalPrice?: number // para mostrar desconto
  discount?: number // percentual de desconto
  features?: string[] // benefícios específicos do plano
  isPopular?: boolean // destacar plano mais vendido
}
```

### Bibliotecas e Componentes Verificados
- ✅ Recharts (instalado) - Para gráficos interativos
- ✅ shadcn/ui componentes:
  - Card - Para todos os cards da página
  - Table - Para tabela de resultados
  - Select - Para filtro de período
  - Badge - Para tags e status
  - Button - Para CTAs
  - Skeleton - Para loading states
  - Separator - Para divisões visuais
  - Collapsible - Para FAQ
- ✅ date-fns (já instalado) - Para formatação de datas
- ✅ lucide-react (já instalado) - Para ícones

## 🚫 Guardrails
- Não modificar estrutura dos cards da listagem (Feature 2.11)
- Manter consistência visual com design system existente
- Não implementar funcionalidades de assinatura real (apenas UI)
- Preservar performance com lazy loading apropriado

## 📦 Dependências
- Feature 2.11 completa (cards de canais)
- Componentes shadcn/ui instalados
- Sistema de roteamento `/canais/[slug]`

## 🎨 Requisitos de Design
- Cards com sombra e bordas consistentes
- Gráfico com cores do tema (verde/vermelho para lucro/prejuízo)
- Tabela com badges visuais para resultados
- CTAs destacados com cor primária
- Skeleton loading para cada card

## ⏱️ Estimativas
- Complexidade: Média-Alta
- Tempo estimado: 3-4 horas
- Componentes novos: 7
- Integrações: Recharts

## 📝 Notas Adicionais
- Gráfico deve ser similar ao Bet Analytix em funcionalidade
- Período padrão: 30 dias
- Mínimo 10 canais mockados com dados completos
- Performance é crítica - usar React.memo onde apropriado
- Cada tipster deve ter combinação diferente de planos:
  - Alguns só mensal
  - Outros mensal + trimestral (10-15% desconto)
  - Outros incluem semestral (20-25% desconto)
  - Alguns oferecem plano temporada (maior desconto)
- Destacar plano mais popular ou com melhor custo-benefício