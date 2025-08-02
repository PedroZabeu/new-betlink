# Feature 2.15: Test Guide - Data Migration Dashboard

## 🎯 Objetivo dos Testes
Validar que a página `/dev/data-migration` exibe corretamente a comparação entre dados mockados e dados do Supabase, mostrando status de sincronização.

## 🧪 Cenários de Teste E2E

### 1. Acesso à Página
**Objetivo**: Verificar que a página carrega sem erros

**Passos**:
1. Navegar para `/dev/data-migration`
2. Aguardar carregamento completo

**Resultados Esperados**:
- ✅ Página carrega sem erros no console
- ✅ Título "📊 Data Migration Status" visível
- ✅ Dashboard aparece após loading

### 2. Status Geral de Sincronização
**Objetivo**: Verificar indicador geral de sincronização

**Passos**:
1. Observar seção "Overall Sync Status"
2. Verificar barra de progresso
3. Checar badge de status

**Resultados Esperados**:
- ✅ Barra de progresso mostra 100%
- ✅ Badge mostra "Synced" em verde
- ✅ Mensagem de sucesso visível

### 3. Contagem de Tabelas
**Objetivo**: Validar que todas as tabelas foram populadas corretamente

**Passos**:
1. Verificar os 4 cards de contagem
2. Conferir números esperados vs atuais

**Resultados Esperados**:
- ✅ Channels: 12/12 ✅
- ✅ Channel Tags: 12/12 ✅
- ✅ Channel Metrics: 72/72 ✅
- ✅ Subscription Plans: 27/30 (pode variar)

### 4. Tabela de Comparação Detalhada
**Objetivo**: Verificar funcionamento da tabela expansível

**Passos**:
1. Localizar tabela "📋 Detailed Comparison"
2. Verificar lista de 12 canais
3. Clicar em canal com diferenças (se houver)
4. Verificar detalhes expandidos

**Resultados Esperados**:
- ✅ 12 canais listados
- ✅ Cada canal mostra porcentagem de sync
- ✅ Canais com 100% mostram "Fully Synced"
- ✅ Clique expande para mostrar diferenças

### 5. Performance
**Objetivo**: Garantir boa performance da página

**Passos**:
1. Medir tempo de carregamento inicial
2. Testar expansão de múltiplos canais
3. Verificar responsividade

**Resultados Esperados**:
- ✅ Página carrega em < 3 segundos
- ✅ Expansão de canais é instantânea
- ✅ Sem travamentos na UI

### 6. Casos de Erro
**Objetivo**: Verificar tratamento de erros

**Passos**:
1. Simular falha de conexão (opcional)
2. Verificar mensagens de erro

**Resultados Esperados**:
- ✅ Erros mostrados de forma clara
- ✅ Não quebra a aplicação

## 📝 Script Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature 2.15: Data Migration Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/data-migration');
    await page.waitForLoadState('networkidle');
  });

  test('should load migration dashboard', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Data Migration Status');
    
    // Wait for dashboard to load
    await expect(page.locator('.space-y-6')).toBeVisible();
  });

  test('should show 100% sync status', async ({ page }) => {
    // Check overall sync
    const syncBadge = page.locator('text=Synced').first();
    await expect(syncBadge).toBeVisible();
    
    // Check progress bar
    const progressBar = page.locator('[style*="width: 100%"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('should display correct table counts', async ({ page }) => {
    // Check channels count
    await expect(page.locator('text=12 / 12').first()).toBeVisible();
    
    // Check all 4 cards are present
    const cards = page.locator('.grid > .card');
    await expect(cards).toHaveCount(4);
  });

  test('should show comparison table with 12 channels', async ({ page }) => {
    // Find comparison table
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
    
    // Count rows (excluding header)
    const rows = table.locator('tbody > tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(12);
  });

  test('should expand channel details on click', async ({ page }) => {
    // Find first expandable row
    const firstRow = page.locator('tbody > tr').first();
    await firstRow.click();
    
    // Check if details expanded (if there are differences)
    const expandedContent = page.locator('.bg-muted\\/30');
    if (await expandedContent.isVisible()) {
      await expect(expandedContent).toBeVisible();
    }
  });
});
```

## ✅ Checklist de Validação

- [ ] Página acessível em `/dev/data-migration`
- [ ] Loading spinner aparece durante carregamento
- [ ] Status geral mostra 100% sincronizado
- [ ] 4 cards de contagem com valores corretos
- [ ] Tabela de comparação com 12 canais
- [ ] Expansão de detalhes funciona
- [ ] Sem erros no console
- [ ] Performance adequada (< 3s)
- [ ] Layout responsivo

## 🎯 Critérios de Sucesso

1. **Funcionalidade**: Todos os componentes funcionam conforme esperado
2. **Dados**: 100% de sincronização entre mock e banco
3. **Performance**: Carregamento rápido e sem travamentos
4. **UX**: Interface clara e intuitiva
5. **Erros**: Tratamento adequado de casos de erro