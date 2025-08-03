# Feature 2.17: Resolver Tech Debt da Feature 2.16

## 📋 Contexto
Durante a implementação da Feature 2.16, identificamos vários tech debts. Esta feature resolverá os 3 mais importantes:

### Tech Debt 1: Tipsters Vazios 🚨
- **Problema**: Tabela `channel_tipsters` está vazia (0 registros)
- **Impacto**: Todos os 12 canais mostram "Tipster Pro" hardcoded
- **Solução**: Criar 4 tipsters e distribuir os 12 canais entre eles

### Tech Debt 2: Página de Detalhes Mockada 🚨
- **Problema**: `/canais/[slug]` ainda usa `mock-channel-details.ts`
- **Impacto**: Inconsistência - lista usa Supabase, detalhes usa mock
- **Solução**: Migrar página para queries Supabase

### Tech Debt 3: Time Windows Duplicados ⚠️
- **Problema**: Apenas 30d tem dados reais, outros períodos são cópia
- **Impacto**: Gráficos mostram mesmos valores para todos períodos
- **Solução**: Criar métricas proporcionais por período

### Tech Debt 4: Error Handling Incompleto ⚠️
- **Problema**: Página quebra se Supabase falhar
- **Impacto**: UX ruim em caso de erro (tela branca)
- **Solução**: Adicionar error boundary e fallback gracioso

### Tech Debt 5: Console Logs de Debug 🧹
- **Problema**: Vários console.logs deixados no código
- **Impacto**: Poluição do console em produção
- **Solução**: Remover todos ou converter para logger estruturado

### Tech Debt 6: React Keys Faltantes 🧹
- **Problema**: Warnings sobre keys em DataComparisonTable
- **Impacto**: Performance e warnings no console
- **Solução**: Adicionar keys apropriadas em todos os loops

## 🎯 Objetivo
Resolver os 6 tech debts em ordem de prioridade:
1. Primeiro: Criar tipsters e popular associações ✅
2. Segundo: Migrar página de detalhes para dados reais
3. Terceiro: Implementar métricas proporcionais por período
4. Quarto: Adicionar error handling robusto
5. Quinto: Limpar console.logs (pode ser paralelo)
6. Sexto: Corrigir React keys (pode ser paralelo)

## 📊 Escopo

### PARTE 1: Tech Debt Tipsters Vazios (2h)

#### Fase 1: Criar Tipsters via Signup (30min)
- [ ] Abrir Playwright MCP e navegar para /auth/signup
- [ ] Criar João Silva (3 canais de arbitragem/ML)
- [ ] Criar Maria Santos (3 canais de value/trading)
- [ ] Criar Pedro Costa (3 canais de apostas ao vivo)
- [ ] Criar Ana Oliveira (3 canais de sistemas)
- [ ] Documentar credenciais em test-credentials.md

#### Fase 2: Atualizar Roles no Banco (15min)
- [ ] Criar .cursor-instructions/update-tipster-roles.md
- [ ] Incluir SQL para UPDATE de 4 registros
- [ ] Aguardar Cursor executar via Supabase MCP
- [ ] Verificar: `SELECT COUNT(*) FROM profiles WHERE role = 'tipster'` = 4

#### Fase 3: Popular channel_tipsters (30min)
- [ ] Criar .cursor-instructions/populate-channel-tipsters.md
- [ ] Mapear cada tipster aos seus 3 canais específicos
- [ ] Aguardar Cursor inserir 12 registros
- [ ] Verificar: `SELECT COUNT(*) FROM channel_tipsters` = 12

#### Fase 4: Atualizar Código Listagem (45min)
- [ ] Modificar getChannelsWithDetails() em channels.ts
- [ ] Adicionar JOIN com channel_tipsters e profiles
- [ ] Remover "Tipster Pro" hardcoded
- [ ] Testar listagem mostrando nomes reais

### PARTE 2: Tech Debt Página de Detalhes (2h)

#### Fase 5: Criar Query para Detalhes (45min)
- [ ] Criar getChannelBySlug() em channels.ts
- [ ] Incluir todos os JOINs necessários (tipster, metrics, plans, tags)
- [ ] Retornar métricas para todos os períodos (7d, 30d, 180d, etc)
- [ ] Testar query no Supabase dashboard

#### Fase 6: Migrar Página de Detalhes (45min)
- [ ] Modificar /app/canais/[slug]/page.tsx
- [ ] Remover importação de mock-channel-details
- [ ] Usar getChannelBySlug() para buscar dados
- [ ] Manter estrutura visual idêntica

#### Fase 7: Implementar Troca de Período (30min)
- [ ] Criar getChannelMetricsByPeriod() para buscar métricas específicas
- [ ] Atualizar ChannelDetailsClient para usar dados reais
- [ ] Testar troca entre 7d, 30d, 6m, YTD, Total
- [ ] Verificar se gráfico atualiza corretamente

### PARTE 3: Tech Debt Time Windows (1.5h)

#### Fase 8: Criar Métricas Proporcionais (45min)
- [ ] Criar documento .cursor-instructions/populate-time-windows.md
- [ ] Calcular métricas proporcionais:
  - 7d: 23% dos valores de 30d
  - 180d (6m): 600% dos valores de 30d
  - YTD: baseado na data atual
  - Total: histórico completo
- [ ] Inserir ~60 novos registros em channel_metrics
- [ ] Verificar: cada canal deve ter 5 time_windows

#### Fase 9: Atualizar Queries (30min)
- [ ] Modificar getChannelsWithDetails() para aceitar time_window param
- [ ] Criar getChannelMetricsByTimeWindow() genérica
- [ ] Garantir que listagem use sempre 30d por padrão
- [ ] Testar performance com múltiplos períodos

#### Fase 10: Validar Gráficos (15min)
- [ ] Testar página de detalhes com cada período
- [ ] Verificar se valores mudam proporcionalmente
- [ ] Confirmar que gráfico reflete período selecionado
- [ ] Validar tooltips com valores corretos

### PARTE 4: Tech Debt Error Handling (1h)

#### Fase 11: Error Boundary Global (30min)
- [ ] Criar componente GlobalErrorBoundary em components/error-boundary.tsx
- [ ] Implementar fallback UI com mensagem amigável
- [ ] Botão "Tentar Novamente" com reset
- [ ] Logar erros para monitoramento
- [ ] Envolver app em providers.tsx

#### Fase 12: Error Handling nas Páginas (20min)
- [ ] Criar error.tsx em /app/canais/
- [ ] Criar error.tsx em /app/canais/[slug]/
- [ ] Implementar try-catch em getChannelsWithDetails()
- [ ] Retornar dados vazios com mensagem se falhar

#### Fase 13: Loading e Fallback States (10min)
- [ ] Melhorar skeleton loading em /canais
- [ ] Adicionar timeout de 10s para queries
- [ ] Mostrar "Dados temporários indisponíveis"
- [ ] Testar desligando Supabase localmente

### PARTE 5: Tech Debt Console Logs (30min)

#### Fase 14: Identificar Console Logs (10min)
- [ ] Fazer grep global por console.log/error/warn
- [ ] Listar todos os arquivos afetados
- [ ] Categorizar: debug vs info vs error
- [ ] Criar lista de prioridade

#### Fase 15: Substituir por Logger (15min)
- [ ] Converter console.error para logger.error
- [ ] Converter console.warn para logger.warn
- [ ] Converter console.log info para logger.info
- [ ] Remover console.logs de debug

#### Fase 16: Validar e Testar (5min)
- [ ] Rodar app e verificar console limpo
- [ ] Testar logger funcionando corretamente
- [ ] Verificar níveis de log em desenvolvimento
- [ ] Confirmar que produção não mostra debug

### PARTE 6: Tech Debt React Keys (15min)

#### Fase 17: Identificar Components sem Keys (5min)
- [ ] Buscar warnings de React keys no console
- [ ] Localizar DataComparisonTable e outros
- [ ] Listar todos os .map() sem key
- [ ] Priorizar por frequência de uso

#### Fase 18: Adicionar Keys Apropriadas (8min)
- [ ] Adicionar key em DataComparisonTable rows
- [ ] Usar IDs únicos ou índices+conteúdo
- [ ] Evitar usar apenas index como key
- [ ] Verificar outros componentes com loops

#### Fase 19: Validar Performance (2min)
- [ ] Rodar app sem warnings de keys
- [ ] Testar re-renders em listas grandes
- [ ] Confirmar melhoria de performance

## 🔧 Detalhes Técnicos

### Tipsters a Criar
```javascript
const tipsters = [
  {
    name: "João Silva",
    email: "joao.silva@betlink.com",
    password: "Test@123!",
    phone: "+5511999991111",
    telegram: "@joaosilva",
    channels: ["arbitragem-tennis-pro", "modelo-ml-basquete", "analise-cantos-asiaticos"]
  },
  {
    name: "Maria Santos",
    email: "maria.santos@betlink.com", 
    password: "Test@123!",
    phone: "+5511999992222",
    telegram: "@mariasantos",
    channels: ["value-betting-europeu", "cash-out-automatizado", "trading-pre-jogo"]
  },
  {
    name: "Pedro Costa",
    email: "pedro.costa@betlink.com",
    password: "Test@123!",
    phone: "+5511999993333",
    telegram: "@pedrocosta",
    channels: ["apostas-ao-vivo-premium", "dutching-inteligente", "lay-favoritos-sistema"]
  },
  {
    name: "Ana Oliveira",
    email: "ana.oliveira@betlink.com",
    password: "Test@123!",
    phone: "+5511999994444", 
    telegram: "@anaoliveira",
    channels: ["sistema-gols-asiaticos", "estrategia-zebras", "combo-multiplas-seguras"]
  }
];
```

### Mapeamento Tipster → Canais

```javascript
const tipsterChannelMap = {
  "joao.silva@betlink.com": [
    "arbitragem-tennis-pro",
    "modelo-ml-basquete",
    "analise-cantos-asiaticos"
  ],
  "maria.santos@betlink.com": [
    "value-betting-europeu",
    "cash-out-automatizado",
    "trading-pre-jogo"
  ],
  "pedro.costa@betlink.com": [
    "apostas-ao-vivo-premium",
    "dutching-inteligente",
    "lay-favoritos-sistema"
  ],
  "ana.oliveira@betlink.com": [
    "sistema-gols-asiaticos",
    "estrategia-zebras",
    "combo-multiplas-seguras"
  ]
};
```

### Query Esperada Após JOIN
```typescript
// Em channels.ts - getChannelsWithDetails()
const { data } = await supabase
  .from('channels')
  .select(`
    *,
    channel_tags!inner(*),
    channel_metrics!inner(*),
    subscription_plans!inner(*),
    channel_tipsters!inner(
      user_id,
      role,
      profiles!inner(
        id,
        name,
        email
      )
    )
  `)
  .eq('is_active', true)
  .eq('channel_metrics.time_window', '30d');
```

## ⚠️ Guardrails

### NUNCA Modificar
- Fluxo de autenticação existente
- Estrutura das tabelas (apenas INSERT/UPDATE)
- Badge "Live Data 🔴" funcionando
- Filtros e ordenação já implementados

### SEMPRE Preservar
- Performance < 2s na listagem
- Todos os 12 canais devem continuar aparecendo
- Métricas e tags existentes
- Responsividade mobile

## 📈 Métricas de Sucesso

### Para Tech Debt 1 (Tipsters):
- [ ] 4 tipsters com role = 'tipster' em profiles
- [ ] 12 registros em channel_tipsters
- [ ] Cada canal mostrando nome único de tipster
- [ ] Zero ocorrências de "Tipster Pro" no código

### Para Tech Debt 2 (Detalhes):
- [ ] Página de detalhes usando 100% Supabase
- [ ] Zero importações de mock-channel-details
- [ ] Métricas mudando com período selecionado
- [ ] Consistência total entre listagem e detalhes
- [ ] Performance < 2s no carregamento

### Para Tech Debt 3 (Time Windows):
- [ ] 72 registros em channel_metrics (12 canais × 6 períodos)
- [ ] Valores proporcionais por período (não duplicados)
- [ ] Gráficos refletindo período selecionado
- [ ] Performance mantida < 100ms por query

### Para Tech Debt 4 (Error Handling):
- [ ] Error boundary global capturando falhas
- [ ] Páginas com error.tsx customizado
- [ ] Mensagens amigáveis ao invés de tela branca
- [ ] Botão "Tentar Novamente" funcional
- [ ] Logs estruturados de erros

### Para Tech Debt 5 (Console Logs):
- [ ] Zero console.log/error/warn em produção
- [ ] Todos os logs usando logger estruturado
- [ ] Níveis de log apropriados (info, warn, error)
- [ ] Console limpo durante uso normal

### Para Tech Debt 6 (React Keys):
- [ ] Zero warnings de React keys no console
- [ ] Todos os .map() com keys únicas
- [ ] Performance melhorada em listas
- [ ] DataComparisonTable otimizada

## 🧪 Plano de Testes

### Teste Tech Debt 1: Verificar Tipsters
```sql
-- 1. Verificar tipsters criados
SELECT id, name, email, role FROM profiles WHERE role = 'tipster';

-- 2. Verificar associações
SELECT p.name, c.name as channel, ct.role
FROM channel_tipsters ct
JOIN profiles p ON p.id = ct.user_id
JOIN channels c ON c.id = ct.channel_id
ORDER BY p.name;
```

### Teste Tech Debt 2: Verificar Detalhes
1. Acessar `/canais` e anotar dados de um canal
2. Clicar em "Ver Detalhes" do mesmo canal
3. Verificar consistência total de dados
4. Confirmar zero imports de mock

### Teste Tech Debt 3: Verificar Time Windows
```sql
-- Verificar distribuição de períodos
SELECT 
  c.name as channel,
  cm.time_window,
  cm.roi,
  cm.profit_units
FROM channel_metrics cm
JOIN channels c ON c.id = cm.channel_id
WHERE c.slug = 'arbitragem-tennis-pro'
ORDER BY 
  CASE cm.time_window
    WHEN '7d' THEN 1
    WHEN '30d' THEN 2
    WHEN '180d' THEN 3
    WHEN 'ytd' THEN 4
    WHEN 'all' THEN 5
  END;
```

**Validação Visual:**
1. Selecionar cada período no dropdown
2. ROI deve mudar proporcionalmente:
   - 7d: ~23% do valor de 30d
   - 180d: ~6x o valor de 30d
3. Gráfico deve atualizar imediatamente

### Teste Tech Debt 4: Simular Falhas
1. **Teste de conexão:**
   - Desligar Supabase local
   - Acessar /canais
   - Deve mostrar mensagem amigável
   - NÃO deve mostrar tela branca

2. **Teste de timeout:**
   - Adicionar delay artificial de 15s
   - Verificar se timeout de 10s funciona
   - Mostrar "Dados indisponíveis"

3. **Teste de recovery:**
   - Clicar "Tentar Novamente"
   - Com Supabase ligado, deve funcionar
   - Verificar se estado é resetado

### Teste Tech Debt 5: Console Limpo
1. **Antes da limpeza:**
   ```bash
   # Contar ocorrências
   grep -r "console\." --include="*.ts" --include="*.tsx" | wc -l
   ```

2. **Após limpeza:**
   - Abrir DevTools
   - Navegar por todas as páginas
   - Console deve estar vazio
   - Apenas logs do Next.js permitidos

3. **Verificar logger:**
   - Forcar um erro
   - Ver se aparece via logger
   - Não deve usar console.error

### Teste Tech Debt 6: React Keys
1. **Identificar warnings:**
   ```bash
   # No console do navegador
   Warning: Each child in a list should have a unique "key" prop
   ```

2. **Verificar componentes:**
   - DataComparisonTable
   - Qualquer lista renderizada com .map()
   - Tables, selects, cards em loop

3. **Após correção:**
   - Zero warnings no console
   - Performance suave em re-renders

## 📝 Documentação Relacionada
- Progress: `/docs/features/progress/feature-2.17-progress.md`
- Handover anterior: `/docs/features/handover/feature-2.16-handover.md`
- Instruções Cursor: `/.cursor-instructions/populate-channel-metrics.md`

## 🚀 Como Começar

### Passo 1: Verificar Estado Atual
```bash
# No Supabase (via Cursor MCP)
SELECT COUNT(*) FROM channel_tipsters; -- Deve retornar 0
SELECT COUNT(*) FROM profiles WHERE role = 'tipster'; -- Deve retornar 0 ou 1
```

### Passo 2: Iniciar Playwright MCP
```javascript
// Abrir navegador
await page.goto('http://localhost:3000/auth/signup');
// Preencher formulário para João Silva
await page.fill('input[name="email"]', 'joao.silva@betlink.com');
await page.fill('input[name="password"]', 'Test@123!');
// ... continuar com os campos
```

### Passo 3: Seguir Fases em Ordem
1. Criar 4 tipsters (Claude + Playwright) - 30min
2. Atualizar roles (Cursor + SQL) - 15min
3. Popular associações (Cursor + SQL) - 30min
4. Atualizar código (Claude) - 45min

## ⏱️ Estimativas
- **Complexidade Total**: Alta (7.25h total)
  - Tech Debt 1 (Tipsters): 2h ✅ (real: 45min)
  - Tech Debt 2 (Detalhes): 2h
  - Tech Debt 3 (Time Windows): 1.5h
  - Tech Debt 4 (Error Handling): 1h
  - Tech Debt 5 (Console Logs): 0.5h
  - Tech Debt 6 (React Keys): 0.25h
- **Prioridade**: 
  - Crítica: TD 1-3 (funcionalidade)
  - Média: TD 4 (UX)
  - Baixa: TD 5-6 (code quality)
- **Dependências**: Feature 2.16 completa ✅
- **Risco**: Médio (refatorações + testes)

## 📝 Notas Finais
- Tech Debt 1 ✅ Concluído em 45min (economizou 1h15min)
- Tech Debts 2-3 devem ser sequenciais
- Tech Debts 4-6 podem ser paralelos ou no final
- Após conclusão: código 100% limpo e otimizado
- Todos os tech debts resolvidos em uma única feature

## 🔍 Comando Útil para Console Logs
```bash
# Encontrar todos os console.logs
grep -r "console\." . \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next
```

## 🔧 Template Error Boundary
```tsx
// components/error-boundary.tsx
export class GlobalErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('Global error boundary', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

## 🔢 Fórmulas para Métricas Proporcionais
```javascript
// Base: valores de 30d
const metrics30d = { roi: 15.8, profit: 158, mdd: 12.5 };

// Cálculos proporcionais
const metrics7d = {
  roi: metrics30d.roi * 0.23,      // ~3.6%
  profit: metrics30d.profit * 0.23, // ~36
  mdd: metrics30d.mdd * 0.5        // MDD menor em período curto
};

const metrics180d = {
  roi: metrics30d.roi * 6,          // ~94.8%
  profit: metrics30d.profit * 6,    // ~948
  mdd: metrics30d.mdd * 1.8        // MDD maior em período longo
};
```

---

*Criado em: 02/08/2025*
*Feature anterior: 2.16 - Migrar Listagem de Canais*
*Próxima feature: 2.18 - Sistema de Métricas Real*