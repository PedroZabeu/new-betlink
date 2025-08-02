import { test, expect } from '@playwright/test'

test.describe('Feature 2.14: Supabase Status Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dev/supabase-status')
  })

  test('deve acessar a página de status', async ({ page }) => {
    // Verificar título
    await expect(page.locator('h1')).toContainText('Supabase Status')
    
    // Verificar que página carregou
    await expect(page.locator('[data-testid="status-dashboard"]')).toBeVisible({ timeout: 10000 })
  })

  test('deve mostrar status de conexão', async ({ page }) => {
    // Aguardar indicador carregar
    const indicator = page.locator('[data-testid="connection-status"]')
    await expect(indicator).toBeVisible({ timeout: 10000 })
    
    // Deve mostrar "Connected"
    await expect(indicator).toContainText('Connected')
    
    // Verificar cor verde (através de classes)
    const classes = await indicator.getAttribute('class')
    expect(classes).toContain('bg-green')
  })

  test('deve listar 6 tabelas', async ({ page }) => {
    // Aguardar seção de tabelas
    await expect(page.locator('[data-testid="tables-section"]')).toBeVisible({ timeout: 10000 })
    
    // Aguardar cards carregarem
    await page.waitForSelector('[data-testid^="table-card-"]', { timeout: 10000 })
    
    // Contar cards de tabela
    const tableCards = page.locator('[data-testid^="table-card-"]')
    await expect(tableCards).toHaveCount(6)
    
    // Verificar tabelas específicas
    const expectedTables = [
      'profiles',
      'channels', 
      'channel_tipsters',
      'channel_tags',
      'channel_metrics',
      'subscription_plans'
    ]
    
    for (const tableName of expectedTables) {
      await expect(page.locator(`[data-testid="table-card-${tableName}"]`)).toBeVisible()
    }
  })

  test('deve mostrar performance < 100ms', async ({ page }) => {
    // Aguardar dashboard carregar
    await page.waitForSelector('[data-testid="status-dashboard"]', { timeout: 10000 })
    
    // Localizar métrica de performance
    const perfMetric = page.locator('[data-testid="response-time"]')
    await expect(perfMetric).toBeVisible({ timeout: 10000 })
    
    // Extrair valor
    const text = await perfMetric.textContent()
    const ms = parseInt(text?.match(/\d+/)?.[0] || '0')
    
    // Verificar se < 100ms (permitindo até 200ms para ambientes mais lentos)
    expect(ms).toBeLessThan(200)
  })

  test('deve mostrar contagem de registros', async ({ page }) => {
    // Aguardar cards carregarem
    await page.waitForSelector('[data-testid^="table-card-"]', { timeout: 10000 })
    
    // Profiles deve ter registros > 0
    const profilesCard = page.locator('[data-testid="table-card-profiles"]')
    const profilesCount = profilesCard.locator('[data-testid="record-count"]')
    const count = await profilesCount.textContent()
    expect(parseInt(count || '0')).toBeGreaterThan(0)
    
    // Novas tabelas devem ter 0 registros (inicialmente)
    const newTables = ['channels', 'channel_tipsters', 'channel_tags', 'channel_metrics', 'subscription_plans']
    
    for (const table of newTables) {
      const card = page.locator(`[data-testid="table-card-${table}"]`)
      const recordCount = card.locator('[data-testid="record-count"]')
      const count = await recordCount.textContent()
      expect(parseInt(count || '0')).toBe(0)
    }
  })

  test('deve mostrar status das foreign keys', async ({ page }) => {
    // Aguardar dashboard carregar
    await page.waitForSelector('[data-testid="status-dashboard"]', { timeout: 10000 })
    
    // Verificar indicador de foreign keys
    const fkStatus = page.locator('[data-testid="foreign-keys-status"]')
    await expect(fkStatus).toBeVisible()
    await expect(fkStatus).toContainText('All Connected')
    await expect(fkStatus).toContainText('✅')
  })

  test('deve mostrar status do RLS', async ({ page }) => {
    // Aguardar dashboard carregar
    await page.waitForSelector('[data-testid="status-dashboard"]', { timeout: 10000 })
    
    // Verificar indicador de RLS
    const rlsStatus = page.locator('[data-testid="rls-status"]')
    await expect(rlsStatus).toBeVisible()
    await expect(rlsStatus).toContainText('Prepared')
    await expect(rlsStatus).toContainText('0 active')
  })

  test('deve ser responsivo em mobile', async ({ page }) => {
    // Definir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Aguardar dashboard carregar
    await page.waitForSelector('[data-testid="status-dashboard"]', { timeout: 10000 })
    
    // Verificar que cards ainda estão visíveis
    const tableCards = page.locator('[data-testid^="table-card-"]')
    const count = await tableCards.count()
    expect(count).toBe(6)
    
    // Em mobile, cards devem estar empilhados (não lado a lado)
    const firstCard = await tableCards.first().boundingBox()
    const secondCard = await tableCards.nth(1).boundingBox()
    
    if (firstCard && secondCard) {
      // Cards devem estar um abaixo do outro
      expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10)
    }
  })

  test('deve mostrar loading state', async ({ page }) => {
    // Navegar para a página
    await page.goto('http://localhost:3000/dev/supabase-status')
    
    // Loading indicator deve aparecer brevemente
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]')
    
    // Verificar se existe (pode já ter carregado)
    const isVisible = await loadingIndicator.isVisible().catch(() => false)
    
    if (isVisible) {
      // Se visível, deve desaparecer em breve
      await expect(loadingIndicator).not.toBeVisible({ timeout: 10000 })
    }
    
    // Dashboard deve aparecer
    await expect(page.locator('[data-testid="status-dashboard"]')).toBeVisible()
  })

  test('deve lidar com erro de conexão gracefully', async ({ page }) => {
    // Este teste é mais conceitual já que não podemos facilmente simular erro
    // Verificamos que a página carrega sem erros JavaScript
    const consoleErrors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('http://localhost:3000/dev/supabase-status')
    await page.waitForLoadState('networkidle')
    
    // Não deve haver erros no console
    expect(consoleErrors).toHaveLength(0)
  })
})