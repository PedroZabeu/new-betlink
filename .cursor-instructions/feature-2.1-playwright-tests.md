# 🧪 Testes Playwright para Feature 2.1 - Navegação com Underline

## 📋 Contexto
A Feature 2.1 adiciona comportamento de underline na navegação para indicar página ativa e hover. Você precisa validar que a implementação está funcionando corretamente.

## 🎯 Sua Tarefa
Execute testes automatizados usando Playwright MCP para validar todos os aspectos da Feature 2.1.

## 📁 Arquivo Modificado
- `/components/header-client.tsx` - Componente de navegação com underline

## 🧪 Suite de Testes Completa

### 1. TESTE: Active Page Underline
```javascript
// Objetivo: Verificar que apenas a página ativa tem underline
test('deve mostrar underline apenas na página ativa', async ({ page }) => {
  // Navegar para home
  await page.goto('/')
  
  // Verificar que link Home tem border-bottom visível
  const homeLink = page.locator('nav a[href="/"]')
  await expect(homeLink).toHaveClass(/border-current/)
  
  // Verificar que outros links NÃO têm border visível
  const blogLink = page.locator('nav a[href="/blog"]')
  await expect(blogLink).not.toHaveClass(/border-current/)
  
  // Navegar para /blog
  await page.goto('/blog')
  
  // Verificar que agora Blog tem underline e Home não
  await expect(blogLink).toHaveClass(/border-current/)
  await expect(homeLink).not.toHaveClass(/border-current/)
})
```

### 2. TESTE: Hover Behavior
```javascript
// Objetivo: Verificar comportamento de hover em links não ativos
test('deve mostrar underline com opacity no hover', async ({ page }) => {
  await page.goto('/')
  
  const blogLink = page.locator('nav a[href="/blog"]')
  
  // Verificar estado inicial (sem hover)
  await expect(blogLink).toHaveClass(/border-transparent/)
  
  // Fazer hover
  await blogLink.hover()
  
  // Verificar que classes de hover foram aplicadas
  await expect(blogLink).toHaveClass(/hover:border-current/)
  await expect(blogLink).toHaveClass(/hover:opacity-50/)
  
  // Verificar que link ativo não muda no hover
  const homeLink = page.locator('nav a[href="/"]')
  await homeLink.hover()
  await expect(homeLink).toHaveClass(/border-current/)
  await expect(homeLink).not.toHaveClass(/opacity-50/)
})
```

### 3. TESTE: Todas as Páginas
```javascript
// Objetivo: Verificar underline em todas as rotas
test('deve funcionar em todas as páginas da navegação', async ({ page }) => {
  const routes = [
    { path: '/', selector: 'nav a[href="/"]' },
    { path: '/canais', selector: 'nav a[href="/canais"]' },
    { path: '/sobre', selector: 'nav a[href="/sobre"]' },
    { path: '/blog', selector: 'nav a[href="/blog"]' }
  ]
  
  for (const route of routes) {
    await page.goto(route.path)
    const link = page.locator(route.selector)
    await expect(link).toHaveClass(/border-current/)
    
    // Verificar que apenas um link está ativo
    const activeLinks = await page.locator('nav a.border-current').count()
    expect(activeLinks).toBe(1)
  }
})
```

### 4. TESTE: Responsividade
```javascript
// Objetivo: Verificar que funciona em diferentes tamanhos
test('deve funcionar em mobile, tablet e desktop', async ({ page }) => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' }
  ]
  
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    
    // Em mobile, verificar se menu hamburger existe
    if (viewport.name === 'mobile') {
      const hamburger = page.locator('button[aria-label*="menu"]')
      await expect(hamburger).toBeVisible()
    } else {
      // Em tablet/desktop, verificar links visíveis
      const homeLink = page.locator('nav a[href="/"]')
      await expect(homeLink).toBeVisible()
      await expect(homeLink).toHaveClass(/border-current/)
    }
  }
})
```

### 5. TESTE: Transições CSS
```javascript
// Objetivo: Verificar que transições estão suaves
test('deve ter transições suaves de 200ms', async ({ page }) => {
  await page.goto('/')
  
  const link = page.locator('nav a[href="/blog"]')
  
  // Verificar se tem classes de transição
  await expect(link).toHaveClass(/transition-all/)
  await expect(link).toHaveClass(/duration-200/)
  
  // Verificar computed style
  const transitionDuration = await link.evaluate(el => 
    window.getComputedStyle(el).transitionDuration
  )
  expect(transitionDuration).toBe('0.2s')
})
```

### 6. TESTE: Regressão - Funcionalidades Preservadas
```javascript
// Objetivo: Garantir que nada foi quebrado
test('deve preservar todas as funcionalidades existentes', async ({ page }) => {
  await page.goto('/')
  
  // Logo deve estar presente
  const logo = page.locator('a[href="/"]').filter({ hasText: 'BetLink' })
  await expect(logo).toBeVisible()
  
  // Botões de auth devem estar presentes
  const loginBtn = page.locator('text=Entrar')
  const signupBtn = page.locator('text=Cadastrar')
  await expect(loginBtn).toBeVisible()
  await expect(signupBtn).toBeVisible()
  
  // Navegação deve funcionar
  await page.click('nav a[href="/blog"]')
  await expect(page).toHaveURL('/blog')
  
  // Verificar redirecionamento de auth
  await page.goto('/cliente/dashboard')
  await expect(page).toHaveURL('/auth/login')
})
```

### 7. TESTE: Performance
```javascript
// Objetivo: Garantir que performance não foi afetada
test('deve carregar em menos de 3 segundos', async ({ page }) => {
  const startTime = Date.now()
  
  await page.goto('/', { waitUntil: 'networkidle' })
  
  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(3000)
  
  // Verificar que não há erros no console
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  
  await page.goto('/blog')
  expect(errors).toHaveLength(0)
})
```

## 📋 Comando para Executar

Use este comando exato no Playwright MCP:

```
Execute todos os 7 testes acima para validar a Feature 2.1 de navegação com underline. Para cada teste:
1. Execute o teste
2. Capture screenshot se falhar
3. Reporte o resultado (passou/falhou)
4. Se falhou, explique o motivo

Ao final, apresente um resumo:
- Total de testes: 7
- Passaram: X
- Falharam: Y
- Lista de falhas com motivos

IMPORTANTE: 
- Os testes devem rodar em http://localhost:3000
- Certifique-se de que o servidor de desenvolvimento está rodando
- Use seletores específicos do componente header-client.tsx
```

## ✅ Critérios de Sucesso

Todos os 7 testes devem passar:
1. ✅ Active page tem underline exclusivo
2. ✅ Hover funciona em links não ativos
3. ✅ Todas as páginas mostram underline quando ativas
4. ✅ Responsivo em mobile/tablet/desktop
5. ✅ Transições suaves de 200ms
6. ✅ Nenhuma funcionalidade quebrada
7. ✅ Performance mantida (< 3s)

## 🚨 Se Algum Teste Falhar

1. Capture screenshot do estado atual
2. Identifique o seletor CSS que falhou
3. Verifique se as classes foram aplicadas corretamente
4. Reporte o erro exato para correção

## 📊 Relatório Esperado

```markdown
RELATÓRIO DE TESTES - Feature 2.1

✅ Teste 1: Active Page Underline - PASSOU
✅ Teste 2: Hover Behavior - PASSOU
✅ Teste 3: Todas as Páginas - PASSOU
✅ Teste 4: Responsividade - PASSOU
✅ Teste 5: Transições CSS - PASSOU
✅ Teste 6: Regressão - PASSOU
✅ Teste 7: Performance - PASSOU

RESUMO:
- Total: 7 testes
- Sucesso: 7 (100%)
- Falhas: 0
- Tempo total: XX segundos

Status: Feature 2.1 aprovada ✅
```

---

**EXECUTE AGORA** usando Playwright MCP e reporte os resultados!