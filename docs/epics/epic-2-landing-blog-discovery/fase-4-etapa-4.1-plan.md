# Fase 4 - Etapa 4.1: Foundation (Setup e Dados)

## 📋 Visão Geral

A Etapa 4.1 estabelece toda a infraestrutura do Supabase e migra os dados mockados para o banco real, mantendo a interface idêntica mas com dados dinâmicos.

## 🎯 Objetivos Específicos

1. **Criar estrutura completa no Supabase** - Todas as tabelas necessárias
2. **Popular com dados reais** - Migrar os 12 canais mockados
3. **Manter UX idêntica** - Usuário não percebe mudança visual
4. **Adicionar indicadores visuais** - Mostrar que dados são do banco
5. **Criar ferramentas de debug** - Páginas /dev/* para monitoramento

## 📊 Features da Etapa

### Feature 2.14: Setup Supabase + Tabelas Core + Página de Status
**Complexidade**: 🟡 Média (4-5 horas)

#### Entregáveis:
1. **Estrutura de Tabelas**:
   ```sql
   -- profiles (já existe)
   -- adicionar campos necessários
   
   -- channels
   CREATE TABLE channels (
     id SERIAL PRIMARY KEY,
     tipster_id UUID REFERENCES profiles(id),
     name VARCHAR(255) NOT NULL UNIQUE,
     slug VARCHAR(255) NOT NULL UNIQUE,
     description TEXT,
     is_premium BOOLEAN DEFAULT false,
     avatar VARCHAR(10),
     
     -- Limites de assinantes
     subscribers_count INTEGER DEFAULT 0,
     max_subscribers INTEGER NOT NULL,
     
     -- Preço base (centavos)
     base_price INTEGER NOT NULL,
     
     -- Metadata
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     is_active BOOLEAN DEFAULT true,
     
     -- Dados do canal
     total_tips INTEGER DEFAULT 0,
     about_bio TEXT,
     about_methodology TEXT,
     about_specialties TEXT[],
     about_experience VARCHAR(255)
   );
   
   -- channel_tags
   CREATE TABLE channel_tags (
     id SERIAL PRIMARY KEY,
     channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
     sport VARCHAR(50),
     bookmaker VARCHAR(50),
     method VARCHAR(50),
     market VARCHAR(50),
     liquidity VARCHAR(20) CHECK (liquidity IN ('alta', 'média', 'baixa')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- channel_metrics
   CREATE TABLE channel_metrics (
     id SERIAL PRIMARY KEY,
     channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
     time_window VARCHAR(10) NOT NULL,
     roi DECIMAL(5,2),
     profit_units DECIMAL(10,2),
     mdd DECIMAL(10,2), -- Maximum Drawdown (negativo)
     avg_odds DECIMAL(5,2),
     volume_units INTEGER,
     rating DECIMAL(3,2),
     win_rate DECIMAL(5,2),
     total_bets INTEGER,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(channel_id, time_window)
   );
   
   -- subscription_plans
   CREATE TABLE subscription_plans (
     id SERIAL PRIMARY KEY,
     channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
     name VARCHAR(100) NOT NULL,
     duration_days INTEGER NOT NULL,
     price INTEGER NOT NULL, -- em centavos
     original_price INTEGER,
     discount INTEGER,
     features TEXT[],
     is_popular BOOLEAN DEFAULT false,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Página de Status** (`/dev/supabase-status`):
   - Dashboard visual mostrando:
     - ✅ Conexão com Supabase (verde/vermelho)
     - 📊 Lista de tabelas criadas com contagem de registros
     - 🔑 Status das Foreign Keys
     - 🛡️ RLS policies aplicadas (preparação)
     - 📈 Métricas de performance da conexão
   - Layout: Grid de cards com ícones e status coloridos

#### Teste Visual:
1. Acessar `/dev/supabase-status`
2. Ver todos os componentes em verde
3. Clicar em cada tabela para ver estrutura
4. Verificar tempo de resposta < 100ms

---

### Feature 2.15: Popular Dados + Queries Básicas + Comparador Visual
**Complexidade**: 🟢 Baixa (2-3 horas)

#### Entregáveis:
1. **Script de Migração**:
   - Converter os 12 canais de `mock-channels.ts` para registros no banco
   - Criar métricas para cada time window
   - Popular tags e planos de assinatura
   - Gerar slugs únicos

2. **Página Comparador** (`/dev/data-migration`):
   - Layout split-screen:
     - Esquerda: "Dados Mockados 📄"
     - Direita: "Dados Supabase 🗄️"
   - Para cada canal, mostrar:
     - Card resumido com principais infos
     - Badge de status: ✅ Migrado, ⏳ Pendente, ❌ Erro
   - Botão "Executar Migração" com progress bar
   - Log de ações em tempo real

#### Queries Básicas:
```typescript
// lib/supabase/queries/channels.ts
export async function getChannels() {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_tags(*),
      channel_metrics(*)
    `)
    .eq('is_active', true)
    .order('subscribers_count', { ascending: false });
    
  return { data, error };
}

export async function getChannelBySlug(slug: string) {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      tipster:profiles(id, name, email),
      channel_tags(*),
      channel_metrics(*),
      subscription_plans(*)
    `)
    .eq('slug', slug)
    .single();
    
  return { data, error };
}
```

#### Teste Visual:
1. Acessar `/dev/data-migration`
2. Ver comparação lado a lado
3. Executar migração e ver progress
4. Confirmar que todos ficam verdes

---

### Feature 2.16: Migrar Listagem de Canais + Indicador Live Data
**Complexidade**: 🟢 Baixa (1-2 horas)

#### Entregáveis:
1. **Atualizar `/canais`**:
   - Substituir `mockChannels` por query do Supabase
   - Manter EXATAMENTE a mesma interface
   - Adicionar tratamento de loading/error states

2. **Badge "Live Data 🔴"**:
   - Posição: Canto superior direito da página
   - Animação: Pulse suave (vermelho)
   - Tooltip: "Dados em tempo real do banco"
   - Componente reutilizável: `<LiveDataIndicator />`

3. **Fallback Inteligente**:
   ```typescript
   // Se Supabase falhar, usar mock com warning
   const channels = supabaseData || mockChannels;
   const isLive = !!supabaseData;
   ```

#### Teste Visual:
1. Acessar `/canais`
2. Ver badge "Live Data 🔴" pulsando
3. Filtros e ordenação funcionando
4. Performance idêntica ao mock

## 🔧 Estrutura de Arquivos

```
lib/
├── supabase/
│   ├── queries/
│   │   ├── channels.ts      # Queries de canais
│   │   └── metrics.ts        # Queries de métricas
│   ├── migrations/
│   │   └── seed-channels.ts  # Script de migração
│   └── types/
│       └── database.ts       # Types do Supabase
│
app/
├── dev/
│   ├── supabase-status/
│   │   └── page.tsx         # Dashboard de status
│   └── data-migration/
│       └── page.tsx         # Comparador de dados
│
components/
├── dev/
│   ├── StatusCard.tsx       # Card de status
│   ├── MigrationProgress.tsx # Barra de progresso
│   └── DataComparator.tsx   # Comparador lado a lado
└── ui/
    └── LiveDataIndicator.tsx # Badge Live Data
```

## 📝 Checklist de Implementação

### Feature 2.14
- [ ] Criar todas as tabelas no Supabase
- [ ] Implementar página `/dev/supabase-status`
- [ ] Adicionar cards de status visual
- [ ] Testar conexão e performance

### Feature 2.15
- [ ] Criar script de migração
- [ ] Implementar página `/dev/data-migration`
- [ ] Popular dados dos 12 canais
- [ ] Validar integridade dos dados

### Feature 2.16
- [ ] Criar queries tipadas
- [ ] Atualizar página `/canais`
- [ ] Implementar `LiveDataIndicator`
- [ ] Testar fallback para mocks

## ⚠️ Pontos de Atenção

1. **Não Quebrar Features Existentes**:
   - Manter filtros funcionando
   - Preservar ordenação
   - Não alterar layouts

2. **Performance**:
   - Queries otimizadas com select específico
   - Implementar loading states
   - Cache no cliente quando apropriado

3. **Segurança** (preparação):
   - Estrutura pronta para RLS
   - Usar anon key do Supabase
   - Não expor dados sensíveis

4. **Dados Consistentes**:
   - IDs únicos e sequenciais
   - Slugs únicos para URLs
   - Métricas coerentes entre períodos

## 🎯 Critérios de Sucesso

1. ✅ Todas as tabelas criadas e populadas
2. ✅ Página `/canais` idêntica mas com dados reais
3. ✅ Páginas de desenvolvimento funcionando
4. ✅ Zero erros no console
5. ✅ Performance < 3s no carregamento
6. ✅ Badge Live Data visível e animado

## 🚀 Próximos Passos

Após completar a Etapa 4.1:
1. Commit com mensagem descritiva
2. Atualizar progress.md
3. Iniciar Etapa 4.2 (Dados Dinâmicos)