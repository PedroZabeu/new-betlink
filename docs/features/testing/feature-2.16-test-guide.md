# Feature 2.16: Migrar Listagem de Canais - Guia de Testes E2E

## 📋 Visão Geral
Este guia detalha os testes E2E com Playwright para validar a migração da listagem de canais de dados mockados para dados reais do Supabase.

## 🎯 Objetivos dos Testes
1. Verificar presença do badge "Live Data"
2. Confirmar que todos os 12 canais aparecem
3. Validar funcionamento dos filtros
4. Testar ordenação
5. Verificar performance e ausência de erros

## 🧪 Testes Detalhados

### Test Suite: Channel Listing Migration

```typescript
test.describe('Feature 2.16: Channel Listing with Supabase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/canais');
  });

  test('should display Live Data badge', async ({ page }) => {
    // Verificar que o badge existe
    const badge = await page.locator('text="Live Data"').first();
    await expect(badge).toBeVisible();
    
    // Verificar que tem ícone vermelho
    const badgeContainer = await page.locator('[class*="destructive"]').filter({ hasText: 'Live Data' });
    await expect(badgeContainer).toBeVisible();
    
    // Verificar animação pulse (classe CSS)
    const animatedBadge = await page.locator('[class*="animate-pulse"]').filter({ hasText: 'Live Data' });
    await expect(animatedBadge).toBeVisible();
  });

  test('should load all 12 channels from database', async ({ page }) => {
    // Aguardar carregamento dos cards
    await page.waitForSelector('[data-testid="channel-card"]', { timeout: 5000 });
    
    // Contar cards de canal
    const channelCards = await page.locator('[data-testid="channel-card"]').count();
    expect(channelCards).toBe(12);
    
    // Verificar que não há mensagem de erro
    const errorMessage = await page.locator('text="Erro ao carregar canais"');
    await expect(errorMessage).not.toBeVisible();
  });

  test('should display correct channel data', async ({ page }) => {
    // Verificar primeiro canal (exemplo)
    const firstCard = await page.locator('[data-testid="channel-card"]').first();
    
    // Verificar elementos essenciais
    await expect(firstCard.locator('h3')).toBeVisible(); // Nome
    await expect(firstCard.locator('text=/R\\$/')).toBeVisible(); // Preço
    await expect(firstCard.locator('text=/ROI/')).toBeVisible(); // ROI
    await expect(firstCard.locator('text=/[0-9]+\\/[0-9]+/')).toBeVisible(); // Ocupação
  });

  test('should filter by sport', async ({ page }) => {
    // Expandir filtros se necessário
    const filterButton = await page.locator('button:has-text("Filtros")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
    
    // Aplicar filtro de futebol
    await page.locator('label:has-text("Futebol")').click();
    
    // Aguardar atualização
    await page.waitForTimeout(500);
    
    // Verificar que há menos canais
    const filteredCards = await page.locator('[data-testid="channel-card"]').count();
    expect(filteredCards).toBeLessThan(12);
    expect(filteredCards).toBeGreaterThan(0);
  });

  test('should filter by price range', async ({ page }) => {
    // Expandir filtros
    const filterButton = await page.locator('button:has-text("Filtros")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
    
    // Selecionar faixa de preço
    await page.locator('label:has-text("R$ 50 - R$ 100")').click();
    
    // Aguardar atualização
    await page.waitForTimeout(500);
    
    // Verificar filtro aplicado
    const filteredCards = await page.locator('[data-testid="channel-card"]').count();
    expect(filteredCards).toBeLessThan(12);
  });

  test('should sort channels', async ({ page }) => {
    // Abrir dropdown de ordenação
    await page.locator('button:has-text("Ordenar")').click();
    
    // Selecionar ordenação por ROI
    await page.locator('text="Maior ROI"').click();
    
    // Aguardar reordenação
    await page.waitForTimeout(500);
    
    // Pegar ROI do primeiro e segundo card
    const firstROI = await page.locator('[data-testid="channel-card"]').first().locator('text=/[0-9]+\\.[0-9]+%/').textContent();
    const secondROI = await page.locator('[data-testid="channel-card"]').nth(1).locator('text=/[0-9]+\\.[0-9]+%/').textContent();
    
    // Converter para números
    const firstValue = parseFloat(firstROI.replace('%', ''));
    const secondValue = parseFloat(secondROI.replace('%', ''));
    
    // Verificar ordem decrescente
    expect(firstValue).toBeGreaterThanOrEqual(secondValue);
  });

  test('should handle loading state', async ({ page }) => {
    // Recarregar página
    await page.reload();
    
    // Verificar skeleton ou loading indicator
    const loadingIndicator = await page.locator('[data-testid="loading-skeleton"], [class*="skeleton"], text="Carregando..."');
    
    // Deve aparecer brevemente
    if (await loadingIndicator.isVisible()) {
      // Aguardar desaparecer
      await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
    }
    
    // Canais devem aparecer após loading
    await expect(page.locator('[data-testid="channel-card"]').first()).toBeVisible();
  });

  test('should not show mock data warning', async ({ page }) => {
    // Verificar que não há indicações de dados mockados
    const mockIndicators = [
      'text="Dados de exemplo"',
      'text="Mock"',
      'text="Demonstração"',
      'text="[DEV]"'
    ];
    
    for (const indicator of mockIndicators) {
      await expect(page.locator(indicator)).not.toBeVisible();
    }
  });

  test('performance: should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Navegar para página
    await page.goto('/canais');
    
    // Aguardar primeiro canal aparecer
    await page.waitForSelector('[data-testid="channel-card"]', { timeout: 2000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should maintain filter state after applying', async ({ page }) => {
    // Aplicar filtro
    const filterButton = await page.locator('button:has-text("Filtros")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
    
    await page.locator('label:has-text("Basquete")').click();
    
    // Verificar que checkbox permanece marcado
    const checkbox = await page.locator('input[type="checkbox"]').filter({ hasText: 'Basquete' });
    await expect(checkbox).toBeChecked();
    
    // Verificar contagem reduzida
    const cards = await page.locator('[data-testid="channel-card"]').count();
    expect(cards).toBeLessThan(12);
  });

  test('should clear all filters', async ({ page }) => {
    // Aplicar múltiplos filtros
    const filterButton = await page.locator('button:has-text("Filtros")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
    
    await page.locator('label:has-text("Futebol")').click();
    await page.waitForTimeout(200);
    
    // Limpar filtros
    await page.locator('button:has-text("Limpar")').click();
    
    // Verificar que voltou aos 12 canais
    await page.waitForTimeout(500);
    const cards = await page.locator('[data-testid="channel-card"]').count();
    expect(cards).toBe(12);
  });

  test('responsive: should work on mobile', async ({ page }) => {
    // Definir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que cards aparecem
    await expect(page.locator('[data-testid="channel-card"]').first()).toBeVisible();
    
    // Verificar layout responsivo (1 coluna)
    const grid = await page.locator('[class*="grid"]').filter({ has: page.locator('[data-testid="channel-card"]') });
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('grid-cols-1');
  });

  test('should handle database connection error gracefully', async ({ page }) => {
    // Interceptar requisição e simular erro
    await page.route('**/supabase*', route => {
      route.abort('failed');
    });
    
    // Recarregar página
    await page.reload();
    
    // Verificar mensagem de erro amigável
    const errorMessage = await page.locator('text=/Erro|erro|Falha|falha/i');
    await expect(errorMessage).toBeVisible();
    
    // Não deve mostrar erro técnico
    const technicalError = await page.locator('text=/TypeError|undefined|null/');
    await expect(technicalError).not.toBeVisible();
  });
});
```

## 📝 Checklist de Validação Manual

### Antes de Rodar os Testes
- [ ] Servidor local rodando (`npm run dev`)
- [ ] Supabase com dados populados (12 canais)
- [ ] Nenhum erro no console do navegador

### Durante os Testes
1. **Badge Live Data**
   - [ ] Badge vermelho visível
   - [ ] Animação pulsando
   - [ ] Posicionado ao lado do título

2. **Dados dos Canais**
   - [ ] 12 canais carregados
   - [ ] Preços em reais (não centavos)
   - [ ] ROI com porcentagem
   - [ ] Ocupação (ex: 312/400)

3. **Filtros Funcionando**
   - [ ] Filtro por esporte
   - [ ] Filtro por bookmaker
   - [ ] Filtro por método
   - [ ] Filtro por preço

4. **Ordenação**
   - [ ] Por popularidade
   - [ ] Por ROI
   - [ ] Por preço

5. **Performance**
   - [ ] Carrega em < 2 segundos
   - [ ] Sem travamentos
   - [ ] Transições suaves

## 🚀 Como Executar

### Com Playwright (Automático)
```bash
# Instalar dependências se necessário
npm install --save-dev @playwright/test

# Rodar todos os testes
npx playwright test feature-2.16

# Rodar com UI
npx playwright test feature-2.16 --ui

# Rodar específico
npx playwright test feature-2.16 -g "should display Live Data badge"
```

### Manual
1. Abrir http://localhost:3000/canais
2. Seguir checklist acima
3. Documentar resultados

## 📊 Critérios de Sucesso

### Must Have (Crítico)
- ✅ Badge "Live Data" visível
- ✅ 12 canais carregados do Supabase
- ✅ Sem erros no console
- ✅ Filtros funcionando

### Should Have (Importante)
- ✅ Performance < 2s
- ✅ Loading states adequados
- ✅ Ordenação funcionando
- ✅ Responsivo

### Nice to Have
- ✅ Animações suaves
- ✅ Tratamento de erros elegante
- ✅ Feedback visual nos filtros

## 🐛 Problemas Conhecidos

1. **Warning de React Keys**
   - Impacto: Baixo
   - Apenas em desenvolvimento
   - Não afeta funcionalidade

2. **Primeira carga pode ser lenta**
   - Cold start do Supabase
   - Normal em desenvolvimento

## 📝 Template de Reporte

```markdown
## Resultado dos Testes - Feature 2.16

**Data**: [DATA]
**Executor**: [NOME]
**Ambiente**: Development

### Resumo
- Total de testes: 13
- Passou: [X]
- Falhou: [Y]

### Detalhes
[Listar testes que falharam e por quê]

### Screenshots
[Anexar se relevante]

### Observações
[Qualquer nota adicional]
```