# Fase 4 - Etapa 4.3: Funcionalidades Interativas - Plano Detalhado

## 📋 Visão Geral da Etapa

**Objetivo**: Adicionar interatividade real com o banco de dados, permitindo que usuários interajam com reviews, vejam gráficos dinâmicos e tenham uma experiência completa baseada em dados reais.

**Duração Estimada**: 8-10 horas
**Features**: 3 (2.21, 2.22, 2.23)
**Complexidade**: Alta

## 🎯 Objetivos Específicos

1. **Migração Completa**: Página de detalhes 100% Supabase
2. **Interatividade**: Sistema funcional de reviews
3. **Visualização Dinâmica**: Gráficos com dados reais e filtros
4. **Performance**: Manter experiência fluida

## 📊 Features Detalhadas

### Feature 2.21: Detalhes do Canal (Supabase)
**Complexidade**: 🔴 Alta (3-4 horas)
**Prioridade**: Alta - Base para próximas features

#### Objetivos:
1. Migrar página de detalhes para dados 100% Supabase
2. Manter exatamente o mesmo visual/UX
3. Implementar todas as queries necessárias
4. Cache inteligente para performance

#### Queries Necessárias:
```typescript
// 1. Query principal do canal com joins
const getChannelDetails = async (slug: string) => {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_tipsters!inner(
        tipster:profiles(*)
      ),
      channel_tags(
        name,
        type,
        value
      ),
      channel_metrics(
        period,
        roi,
        profit,
        mdd,
        avg_odd,
        win_rate,
        total_picks,
        updated_at
      ),
      subscription_plans(
        id,
        name,
        price,
        original_price,
        duration_months,
        features
      )
    `)
    .eq('slug', slug)
    .single();
};

// 2. Query para reviews
const getChannelReviews = async (channelId: string) => {
  const { data } = await supabase
    .from('channel_reviews')
    .select(`
      *,
      user:profiles(name, avatar_url)
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(10);
};

// 3. Query para tips recentes
const getRecentTips = async (channelId: string, limit = 20) => {
  const { data } = await supabase
    .from('tips')
    .select('*')
    .eq('channel_id', channelId)
    .order('match_date', { ascending: false })
    .limit(limit);
};
```

#### Estratégia de Cache:
```typescript
// React Query para cache inteligente
import { useQuery } from '@tanstack/react-query';

export function useChannelDetails(slug: string) {
  return useQuery({
    queryKey: ['channel', slug],
    queryFn: () => getChannelDetails(slug),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Prefetch na listagem
const prefetchChannelDetails = async (slug: string) => {
  await queryClient.prefetchQuery({
    queryKey: ['channel', slug],
    queryFn: () => getChannelDetails(slug),
  });
};
```

#### Componentes a Atualizar:
1. **ChannelDetailPage** (`/app/canais/[slug]/page.tsx`):
   - Substituir mock por queries reais
   - Adicionar loading states
   - Error boundaries

2. **MetricsCard**:
   - Receber dados do banco
   - Formatar baseado no período selecionado

3. **PricingPlans**:
   - Mostrar planos do banco
   - Preços dinâmicos

#### Indicador Visual:
```tsx
// Badge indicando dados reais
<Badge className="animate-pulse bg-red-500">
  <Database className="w-3 h-3 mr-1" />
  Live Data
</Badge>
```

#### Teste Visual:
- Página idêntica visualmente
- Dados mudando ao editar no banco
- Performance < 2s no carregamento
- Loading states funcionando

---

### Feature 2.22: Sistema de Reviews
**Complexidade**: 🔴 Alta (3-4 horas)
**Dependências**: Feature 2.21

#### Objetivos:
1. Permitir usuários deixarem reviews
2. Sistema de rating (1-5 estrelas)
3. Moderação básica
4. Atualização em tempo real

#### Schema Necessário:
```sql
-- Tabela de reviews
CREATE TABLE IF NOT EXISTS channel_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Review data
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  
  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE channel_reviews ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver reviews aprovadas
CREATE POLICY "Reviews são públicas quando aprovadas" ON channel_reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

-- Usuários autenticados podem criar
CREATE POLICY "Usuários autenticados podem criar reviews" ON channel_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem editar suas próprias reviews
CREATE POLICY "Usuários podem editar suas reviews" ON channel_reviews
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Trigger para atualizar rating médio
CREATE OR REPLACE FUNCTION update_channel_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE channels
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(2,1)
      FROM channel_reviews
      WHERE channel_id = NEW.channel_id
      AND status = 'approved'
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM channel_reviews
      WHERE channel_id = NEW.channel_id
      AND status = 'approved'
    )
  WHERE id = NEW.channel_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
AFTER INSERT OR UPDATE OF status ON channel_reviews
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_channel_rating();
```

#### Componentes Novos:
1. **ReviewForm**:
   ```tsx
   export function ReviewForm({ channelId }: { channelId: string }) {
     const [rating, setRating] = useState(0);
     const [isSubmitting, setIsSubmitting] = useState(false);
     
     return (
       <Card className="p-6">
         <h3 className="text-lg font-semibold mb-4">Deixe sua avaliação</h3>
         
         {/* Star Rating */}
         <div className="flex gap-1 mb-4">
           {[1, 2, 3, 4, 5].map((star) => (
             <Star
               key={star}
               className={cn(
                 "w-6 h-6 cursor-pointer transition-colors",
                 star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
               )}
               onClick={() => setRating(star)}
             />
           ))}
         </div>
         
         {/* Review Form */}
         <form onSubmit={handleSubmit}>
           <Input
             placeholder="Título da avaliação"
             className="mb-3"
           />
           <Textarea
             placeholder="Compartilhe sua experiência..."
             rows={4}
             className="mb-4"
           />
           <Button type="submit" disabled={!rating || isSubmitting}>
             {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
           </Button>
         </form>
       </Card>
     );
   }
   ```

2. **ReviewsList**:
   - Mostrar reviews aprovadas
   - Paginação infinita
   - Ordenação (mais recentes, mais úteis)
   - Filtros por rating

3. **ReviewCard**:
   - Avatar do usuário
   - Rating com estrelas
   - Data formatada
   - Botões "Útil" / "Não útil"

#### Sistema de Moderação:
- **Auto-aprovação**: Reviews de usuários verificados
- **Fila de moderação**: `/admin/reviews`
- **Filtro de palavrões**: Biblioteca de profanity filter
- **Rate limiting**: 1 review por canal por semana

#### Teste Visual:
- Deixar review e ver aparecer
- Rating médio atualizando
- Filtros funcionando
- Loading states suaves

---

### Feature 2.23: Gráficos Dinâmicos
**Complexidade**: 🔴 Alta (2-3 horas)
**Dependências**: Feature 2.22

#### Objetivos:
1. Gráficos com dados históricos reais
2. Filtros de período totalmente funcionais
3. Animações e transições suaves
4. Múltiplos tipos de visualização

#### Queries para Dados:
```typescript
// Query para evolução do bankroll
const getBankrollEvolution = async (
  channelId: string,
  period: '7d' | '30d' | '6m' | 'ytd' | 'total'
) => {
  const startDate = getStartDate(period);
  
  const { data } = await supabase
    .from('tips')
    .select('match_date, profit, status')
    .eq('channel_id', channelId)
    .gte('match_date', startDate)
    .order('match_date', { ascending: true });
  
  // Calcular evolução acumulada
  let accumulated = 1000; // Bankroll inicial
  return data?.map(tip => {
    if (tip.status === 'won' || tip.status === 'lost') {
      accumulated += tip.profit * 10; // Assumindo stake de 10u
    }
    return {
      date: tip.match_date,
      value: accumulated,
      profit: tip.profit
    };
  });
};

// Query para distribuição por mercado
const getMarketDistribution = async (channelId: string) => {
  const { data } = await supabase
    .rpc('get_market_distribution', { channel_id: channelId });
  
  return data;
};
```

#### Componentes de Gráfico:
1. **BankrollChart** (Recharts):
   ```tsx
   export function BankrollChart({ data, period }: Props) {
     return (
       <ResponsiveContainer width="100%" height={400}>
         <AreaChart data={data}>
           <defs>
             <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
             </linearGradient>
           </defs>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis 
             dataKey="date" 
             tickFormatter={(date) => format(new Date(date), 'dd/MM')}
           />
           <YAxis />
           <Tooltip 
             content={<CustomTooltip />}
             animationDuration={200}
           />
           <Area
             type="monotone"
             dataKey="value"
             stroke="#10b981"
             fillOpacity={1}
             fill="url(#colorProfit)"
             animationDuration={500}
           />
         </AreaChart>
       </ResponsiveContainer>
     );
   }
   ```

2. **StatsDistribution** (Gráfico de Pizza):
   - Distribuição por esporte
   - Distribuição por mercado
   - Win rate por odd range

3. **HeatmapCalendar**:
   - Calendário mostrando dias com tips
   - Cores indicando lucro/prejuízo
   - Hover para detalhes

#### Otimizações:
```typescript
// Memoização dos cálculos pesados
const memoizedData = useMemo(() => {
  return processChartData(rawData);
}, [rawData, period]);

// Debounce para mudanças de período
const debouncedPeriod = useDebounce(period, 300);

// Skeleton loading
if (isLoading) {
  return <ChartSkeleton />;
}
```

#### Interações:
- **Zoom**: Selecionar área para zoom
- **Pan**: Arrastar para navegar
- **Hover**: Tooltips detalhados
- **Export**: Baixar como imagem

#### Teste Visual:
- Gráficos carregando com dados reais
- Transições suaves ao mudar período
- Performance fluida com muitos pontos
- Responsivo em mobile

## 🔄 Fluxo de Desenvolvimento

1. **Feature 2.21** → Base com dados reais
2. **Feature 2.22** → Interatividade com reviews
3. **Feature 2.23** → Visualizações dinâmicas

## 📋 Checklist de Conclusão

### Feature 2.21:
- [ ] Todas queries implementadas
- [ ] Cache configurado
- [ ] Loading states
- [ ] Error boundaries
- [ ] Badge "Live Data"
- [ ] Performance < 2s

### Feature 2.22:
- [ ] Schema de reviews criado
- [ ] RLS policies configuradas
- [ ] Form de review funcional
- [ ] Sistema de rating
- [ ] Trigger de média
- [ ] Moderação básica

### Feature 2.23:
- [ ] Queries de dados históricos
- [ ] Gráfico de evolução
- [ ] Filtros de período
- [ ] Animações suaves
- [ ] Tooltips informativos
- [ ] Export de imagem

## ⚠️ Pontos de Atenção

1. **Performance**: Queries com muitos JOINs
2. **Cache**: Estratégia de invalidação
3. **UX**: Feedback durante carregamento
4. **Segurança**: RLS bem configurado
5. **Mobile**: Gráficos responsivos

## 🎯 Critério de Sucesso

- Página de detalhes 100% funcional com Supabase
- Reviews funcionando com moderação
- Gráficos dinâmicos e interativos
- Performance mantida (< 3s total)
- Zero dados mockados restantes

## 🚀 Próximos Passos

Após conclusão da Etapa 4.3:
- **Etapa 4.4**: Sistema de captura de leads
- **Etapa 4.5**: Otimizações e real-time