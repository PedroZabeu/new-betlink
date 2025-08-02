# Feature 2.14 - Guia de Testes E2E

## 🎯 Objetivo
Validar que a página `/dev/supabase-status` está funcionando corretamente e mostrando as informações do banco de dados.

## 📋 Cenários de Teste

### 1. Acesso à Página
```typescript
test('deve acessar a página de status do Supabase', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar título da página
  await expect(page.locator('h1')).toContainText('Supabase Status Dashboard');
  
  // Verificar que não há erros
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});
```

### 2. Status de Conexão
```typescript
test('deve mostrar conexão ativa com Supabase', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar indicador de conexão
  const connectionIndicator = page.locator('[data-testid="connection-status"]');
  await expect(connectionIndicator).toBeVisible();
  await expect(connectionIndicator).toContainText('Connected');
  
  // Verificar cor verde (classe CSS)
  await expect(connectionIndicator).toHaveClass(/bg-green-500|text-green-500/);
});
```

### 3. Performance
```typescript
test('deve mostrar tempo de resposta < 100ms', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar card de performance
  const performanceCard = page.locator('[data-testid="performance-metrics"]');
  await expect(performanceCard).toBeVisible();
  
  // Extrair tempo de resposta
  const responseTime = await performanceCard.locator('[data-testid="response-time"]').textContent();
  const timeValue = parseInt(responseTime.replace(/[^0-9]/g, ''));
  
  expect(timeValue).toBeLessThan(100);
});
```

### 4. Tabelas Listadas
```typescript
test('deve listar todas as 6 tabelas do sistema', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar seção de tabelas
  const tablesSection = page.locator('[data-testid="tables-section"]');
  await expect(tablesSection).toBeVisible();
  await expect(tablesSection.locator('h2')).toContainText('Database Tables');
  
  // Verificar cards de tabelas
  const tableCards = page.locator('[data-testid^="table-card-"]');
  await expect(tableCards).toHaveCount(6);
  
  // Verificar tabelas específicas
  const expectedTables = [
    'profiles',
    'channels', 
    'channel_tipsters',
    'channel_tags',
    'channel_metrics',
    'subscription_plans'
  ];
  
  for (const tableName of expectedTables) {
    await expect(page.locator(`[data-testid="table-card-${tableName}"]`)).toBeVisible();
  }
});
```

### 5. Contagem de Registros
```typescript
test('deve mostrar contagem correta de registros', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Profiles deve ter registros > 0
  const profilesCard = page.locator('[data-testid="table-card-profiles"]');
  const profilesCount = await profilesCard.locator('[data-testid="record-count"]').textContent();
  expect(parseInt(profilesCount)).toBeGreaterThan(0);
  
  // Novas tabelas devem ter 0 registros (inicialmente)
  const newTables = ['channels', 'channel_tipsters', 'channel_tags', 'channel_metrics', 'subscription_plans'];
  
  for (const table of newTables) {
    const card = page.locator(`[data-testid="table-card-${table}"]`);
    const count = await card.locator('[data-testid="record-count"]').textContent();
    expect(parseInt(count)).toBe(0);
  }
});
```

### 6. Foreign Keys Status
```typescript
test('deve mostrar status das foreign keys', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar indicador de foreign keys
  const fkStatus = page.locator('[data-testid="foreign-keys-status"]');
  await expect(fkStatus).toBeVisible();
  await expect(fkStatus).toContainText('All Connected');
  await expect(fkStatus).toContainText('✅');
});
```

### 7. RLS Status
```typescript
test('deve mostrar status preparado para RLS', async ({ page }) => {
  await page.goto('/dev/supabase-status');
  
  // Verificar indicador de RLS
  const rlsStatus = page.locator('[data-testid="rls-status"]');
  await expect(rlsStatus).toBeVisible();
  await expect(rlsStatus).toContainText('Prepared');
  await expect(rlsStatus).toContainText('0 active');
});
```

### 8. Responsividade
```typescript
test('deve ser responsivo em mobile', async ({ page }) => {
  // Definir viewport mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/dev/supabase-status');
  
  // Verificar que cards empilham verticalmente
  const tableCards = page.locator('[data-testid^="table-card-"]');
  const firstCard = await tableCards.first().boundingBox();
  const secondCard = await tableCards.nth(1).boundingBox();
  
  // Cards devem estar um abaixo do outro em mobile
  expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
});
```

### 9. Loading State
```typescript
test('deve mostrar loading state enquanto carrega', async ({ page }) => {
  // Interceptar request para simular loading
  await page.route('**/api/supabase/status', route => {
    setTimeout(() => route.fulfill({ status: 200, body: '{}' }), 1000);
  });
  
  await page.goto('/dev/supabase-status');
  
  // Verificar skeleton/spinner
  const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
  await expect(loadingIndicator).toBeVisible();
  
  // Aguardar carregamento completo
  await expect(loadingIndicator).not.toBeVisible({ timeout: 2000 });
});
```

### 10. Error Handling
```typescript
test('deve mostrar erro se conexão falhar', async ({ page }) => {
  // Simular erro de conexão
  await page.route('**/api/supabase/status', route => {
    route.fulfill({ status: 500 });
  });
  
  await page.goto('/dev/supabase-status');
  
  // Verificar mensagem de erro
  const errorMessage = page.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Failed to connect');
  
  // Verificar indicador vermelho
  const connectionIndicator = page.locator('[data-testid="connection-status"]');
  await expect(connectionIndicator).toHaveClass(/bg-red-500|text-red-500/);
});
```

## 🚀 Como Executar

### Via Playwright MCP
1. Use o comando Playwright MCP para executar todos os testes
2. Especifique o arquivo: `feature-2.14.spec.ts`
3. Aguarde resultados

### Manualmente
```bash
# Executar todos os testes da feature
npx playwright test feature-2.14.spec.ts

# Executar com UI
npx playwright test feature-2.14.spec.ts --ui

# Executar teste específico
npx playwright test feature-2.14.spec.ts -g "deve acessar a página"
```

## ✅ Critérios de Aprovação

- [ ] Todos os 10 testes passando
- [ ] Sem erros no console
- [ ] Performance < 100ms
- [ ] Responsivo em mobile
- [ ] Loading states funcionando
- [ ] Error handling apropriado

## 📝 Observações

1. **Dados Iniciais**: As novas tabelas terão 0 registros inicialmente
2. **Performance**: Pode variar dependendo da conexão
3. **Mobile**: Testar em pelo menos 2 tamanhos de viewport
4. **Acessibilidade**: Todos os elementos interativos devem ter data-testid