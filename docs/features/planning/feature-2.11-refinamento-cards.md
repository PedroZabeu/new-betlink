# Feature 2.11: Refinamento dos Cards e Sistema de Filtros

## Objetivo
Refinar a página de exploração de canais (/canais) com cards mais informativos, sistema de filtros avançado e ordenação, mantendo o design atual como base.

## Human Test
**Fluxo principal:**
1. Acessar /canais
2. Ver 10-12 canais mockados com novas métricas
3. Testar ordenação (popularidade, ROI, preço)
4. Aplicar filtros (janela temporal, tags, preço, vagas)
5. Ver métricas mudarem conforme janela temporal
6. Testar responsividade mobile

**Resultado esperado:**
- Cards mostram ROI, Lucro, MDD, Odds Média, Volume, Avaliação
- Filtros colapsáveis funcionando
- Ordenação altera ordem dos cards
- Métricas mudam com janela temporal (7d, 30d, etc)
- Mobile: filtros em drawer

## Dependencies
- Feature 2.10 ✅ (estrutura base do blog)
- Página /canais existente
- Sistema de componentes UI

## Guardrails
- **NÃO MODIFICAR**: Design base dos cards (manter harmonia)
- **NÃO ADICIONAR**: Emojis nos cards
- **MANTER**: Performance < 3s de carregamento
- **PRESERVAR**: Responsividade atual

## Technical Context

### Card Structure
```typescript
interface ChannelCard {
  // Identificação
  id: number;
  name: string;
  tipster: string;
  avatar: string;
  isPremium: boolean;
  
  // Métricas (dinâmicas por janela)
  metrics: {
    roi: number;          // Ex: +18.5
    profitUnits: number;  // Ex: +127.3
    mdd: number;          // Ex: -23.5 (Maximum Drawdown)
    avgOdds: number;      // Ex: 2.15
    volumeUnits: number;  // Ex: 892
    rating: number;       // Ex: 4.8
  };
  
  // Tags
  tags: {
    sport: string;        // futebol, basquete, NFL, etc
    bookmaker: string;    // bet365, pinnacle, betfair
    method: string;       // model, arb, chasing, comp
    market: string;       // player_prop, spread, total, ML
    liquidity: 'alta' | 'média' | 'baixa';
  };
  
  // Ocupação
  subscribers: number;
  maxSubscribers: number;
  
  // Preço
  price: number;
}
```

### Filter System
```typescript
interface FilterState {
  timeWindow: '7d' | 'MTD' | '30d' | '180d' | 'YTD' | 'all';
  priceRange: [number, number];
  tags: {
    sports: string[];
    bookmakers: string[];
    methods: string[];
    markets: string[];
    liquidity: string[];
  };
  availability: 'available' | 'waitlist' | 'all';
}

interface SortOption {
  value: 'popular' | 'roi' | 'price-low' | 'price-high';
  label: string;
}
```

## Implementation Tasks

### 1. Data Structure (30min)
- [ ] Criar tipos TypeScript para cards e filtros
- [ ] Mockar 10-12 canais com dados realistas
- [ ] Implementar métricas por janela temporal
- [ ] Criar mapeamento de tags

### 2. Card Component (45min)
- [ ] Atualizar grid de métricas (substituir taxa acerto por MDD)
- [ ] Implementar tags com badges
- [ ] Manter barra de ocupação com cores neutras
- [ ] Adicionar responsividade

### 3. Filter System (60min)
- [ ] Implementar Collapsible para cada seção
- [ ] Criar filtro de janela temporal
- [ ] Adicionar filtros de tags (checkbox groups)
- [ ] Implementar range slider para preço
- [ ] Adicionar badge contador de filtros ativos

### 4. Sorting & State (45min)
- [ ] Implementar ordenação (popular, ROI, preço)
- [ ] Sincronizar filtros com URL params
- [ ] Aplicar filtros client-side
- [ ] Atualizar métricas por janela temporal

### 5. Mobile Optimization (30min)
- [ ] Implementar Sheet/Drawer para filtros mobile
- [ ] Ajustar grid responsivo
- [ ] Testar touch interactions

### 6. Polish & Testing (45min)
- [ ] Adicionar animações suaves
- [ ] Implementar skeleton loading
- [ ] Validar acessibilidade
- [ ] Otimizar performance
- [ ] Adicionar logs estratégicos (usar logger-specialist agent)
- [ ] Criar guia de teste E2E (usar test-guide-creator agent)
- [ ] Executar testes com Playwright
- [ ] Realizar refinamentos finais

### 7. Documentation & Commit (15min)
- [ ] Atualizar progress trackers (epic e feature)
- [ ] Criar documento de aprendizados se necessário
- [ ] Commit com mensagem descritiva

## Mock Data Examples

```typescript
const mockChannels = [
  {
    id: 1,
    name: "Futebol Europeu Premium",
    tipster: "Carlos Silva",
    tags: {
      sport: "Futebol",
      bookmaker: "Pinnacle",
      method: "Model",
      market: "Over/Under",
      liquidity: "alta"
    },
    metrics: {
      // Mudam conforme timeWindow
      '7d': { roi: 23.5, profitUnits: 45.2, mdd: -12.3, ... },
      '30d': { roi: 18.5, profitUnits: 127.3, mdd: -23.5, ... },
      // ...
    }
  },
  // ... mais 9-11 canais
];
```

## Success Criteria
- [ ] Cards exibem todas as novas métricas
- [ ] Filtros funcionam individualmente e em conjunto
- [ ] Ordenação altera ordem visual dos cards
- [ ] Métricas mudam ao trocar janela temporal
- [ ] Mobile: UX fluida com drawer
- [ ] Performance: filtros < 100ms
- [ ] Testes E2E passando

## Estimates
- **Complexity**: Medium
- **Time**: 4-5 hours
- **Risk**: Low (extending existing design)