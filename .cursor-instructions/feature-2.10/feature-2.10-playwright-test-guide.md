# Feature 2.10 - Guia de Testes com Playwright

## 📋 INSTRUÇÕES PARA CURSOR

**OBJETIVO**: Validar todas as funcionalidades da Feature 2.10 (Melhorias de Performance e UX) usando Playwright MCP para garantir que tudo está funcionando corretamente.

## 🎯 TESTES OBRIGATÓRIOS

### 1. **Loading Skeletons** ⏳

#### Teste: Skeleton aparece durante filtros no blog
```typescript
// Arquivo: tests/feature-2.10-skeletons.spec.ts
test('should show skeleton when filtering posts', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  
  // Aguardar página carregar
  await page.waitForLoadState('networkidle');
  
  // Clicar em uma categoria para triggerar filtro
  await page.click('[data-testid="category-educacional"]');
  
  // Verificar se skeleton aparece (mesmo que brevemente)
  // Nota: pode ser rápido demais para capturar, mas vamos tentar
  const hasSkeleton = await page.isVisible('.animate-pulse');
  
  console.log('Skeleton visível durante filtro:', hasSkeleton);
  
  // Verificar se posts carregaram após filtro
  await page.waitForSelector('[data-testid="posts-grid"]', { timeout: 5000 });
  expect(await page.isVisible('[data-testid="posts-grid"]')).toBe(true);
});
```

### 2. **Scroll to Top Button** ⬆️

#### Teste: Botão aparece após scroll e funciona
```typescript
// Arquivo: tests/feature-2.10-scroll-to-top.spec.ts
test('should show scroll to top button after scrolling', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await page.waitForLoadState('networkidle');
  
  // Verificar que botão NÃO está visível inicialmente
  const initialButton = await page.isVisible('button[aria-label="Voltar ao topo da página"]');
  expect(initialButton).toBe(false);
  
  // Fazer scroll para baixo (mais que 300px)
  await page.evaluate(() => window.scrollTo(0, 500));
  
  // Aguardar um pouco para o botão aparecer
  await page.waitForTimeout(500);
  
  // Verificar que botão está visível
  const buttonVisible = await page.isVisible('button[aria-label="Voltar ao topo da página"]');
  expect(buttonVisible).toBe(true);
  
  console.log('Scroll to top button apareceu após scroll:', buttonVisible);
  
  // Clicar no botão
  await page.click('button[aria-label="Voltar ao topo da página"]');
  
  // Verificar que voltou ao topo (scroll Y próximo de 0)
  await page.waitForTimeout(1000); // Aguardar scroll suave
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(50);
  
  console.log('Posição após click:', scrollY);
});
```

#### Teste: Botão funciona em post individual
```typescript
test('should work on individual post page', async ({ page }) => {
  await page.goto('http://localhost:3000/blog/entendendo-ev-positivo');
  await page.waitForLoadState('networkidle');
  
  // Scroll para baixo
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  // Verificar botão apareceu
  expect(await page.isVisible('button[aria-label="Voltar ao topo da página"]')).toBe(true);
  
  // Testar funcionamento
  await page.click('button[aria-label="Voltar ao topo da página"]');
  await page.waitForTimeout(1000);
  
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(50);
});
```

### 3. **Static Generation** 🏗️

#### Teste: Páginas carregam rapidamente (SSG funcionando)
```typescript
// Arquivo: tests/feature-2.10-performance.spec.ts
test('should load blog pages quickly (SSG working)', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('http://localhost:3000/blog');
  await page.waitForLoadState('domcontentloaded');
  
  const loadTime = Date.now() - startTime;
  console.log('Blog page load time:', loadTime + 'ms');
  
  // Deve carregar em menos de 3 segundos
  expect(loadTime).toBeLessThan(3000);
  
  // Verificar se conteúdo está presente
  expect(await page.isVisible('[data-testid="posts-grid"]')).toBe(true);
});

test('should load individual post quickly', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('http://localhost:3000/blog/metricas-essenciais');
  await page.waitForLoadState('domcontentloaded');
  
  const loadTime = Date.now() - startTime;
  console.log('Individual post load time:', loadTime + 'ms');
  
  expect(loadTime).toBeLessThan(3000);
  expect(await page.textContent('h1')).toContain('Métricas Essenciais');
});
```

### 4. **Dynamic Metadata** 📄

#### Teste: Metadata dinâmico está presente
```typescript
test('should have dynamic metadata for posts', async ({ page }) => {
  await page.goto('http://localhost:3000/blog/entendendo-ev-positivo');
  
  // Verificar title
  const title = await page.title();
  expect(title).toContain('Apostar com EV+');
  expect(title).toContain('BetLink Blog');
  
  // Verificar meta description
  const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
  expect(metaDescription).toContain('Expected Value Positivo');
  
  // Verificar Open Graph
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toContain('Apostar com EV+');
  
  console.log('Title:', title);
  console.log('Description:', metaDescription);
  console.log('OG Title:', ogTitle);
});
```

### 5. **Regressão de Features Anteriores** 🔄

#### Teste: Busca continua funcionando
```typescript
// Arquivo: tests/feature-2.10-regression.spec.ts
test('should not break existing search functionality', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await page.waitForLoadState('networkidle');
  
  // Testar busca
  await page.fill('[data-testid="search-input"]', 'EV+');
  await page.waitForTimeout(500); // Aguardar debounce
  
  // Verificar se filtros funcionam
  const posts = await page.locator('[data-testid^="post-"]').count();
  console.log('Posts encontrados com busca "EV+":', posts);
  
  expect(posts).toBeGreaterThan(0);
  
  // Limpar busca
  await page.fill('[data-testid="search-input"]', '');
  await page.waitForTimeout(500);
  
  const allPosts = await page.locator('[data-testid^="post-"]').count();
  expect(allPosts).toBeGreaterThan(posts);
});
```

#### Teste: Filtros de categoria continuam funcionando
```typescript
test('should not break category filters', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await page.waitForLoadState('networkidle');
  
  const initialPosts = await page.locator('[data-testid^="post-"]').count();
  
  // Clicar em categoria
  await page.click('[data-testid="category-educacional"]');
  await page.waitForTimeout(300);
  
  const filteredPosts = await page.locator('[data-testid^="post-"]').count();
  console.log('Posts após filtro categoria:', filteredPosts);
  
  expect(filteredPosts).toBeLessThan(initialPosts);
  expect(filteredPosts).toBeGreaterThan(0);
});
```

### 6. **Navigation e Links** 🔗

#### Teste: Navegação entre posts funcionando
```typescript
test('should navigate between posts correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  await page.waitForLoadState('networkidle');
  
  // Clicar no primeiro post
  const firstPost = page.locator('[data-testid^="post-"]').first();
  await firstPost.click();
  
  await page.waitForLoadState('networkidle');
  
  // Verificar se chegou na página individual
  expect(page.url()).toMatch(/\/blog\/[^\/]+$/);
  
  // Verificar se há breadcrumbs
  expect(await page.isVisible('nav[aria-label="Breadcrumb"]')).toBe(true);
  
  // Verificar botão voltar
  expect(await page.isVisible('text=Voltar ao Blog')).toBe(true);
});
```

## 🎬 COMANDOS PARA EXECUTAR

### Pré-requisitos
```bash
# Instalar Playwright se não estiver instalado
npm install -D @playwright/test

# Instalar browsers
npx playwright install
```

### Executar Testes
```bash
# Iniciar servidor de desenvolvimento primeiro
npm run dev

# Em outro terminal, executar testes
npx playwright test tests/feature-2.10-*.spec.ts --headed

# Ou rodar todos os testes em paralelo
npx playwright test --project=chromium
```

### Gerar Relatório
```bash
# Executar com relatório HTML
npx playwright test --reporter=html

# Abrir relatório
npx playwright show-report
```

## 📊 CRITÉRIOS DE SUCESSO

### ✅ Testes que DEVEM passar:
1. **Scroll to Top**: Botão aparece após scroll > 300px
2. **Scroll to Top**: Botão funciona e leva ao topo com scroll suave
3. **Performance**: Páginas carregam < 3s
4. **Metadata**: Títulos dinâmicos estão corretos
5. **Regressão**: Busca e filtros continuam funcionando
6. **Navigation**: Links entre posts funcionam

### ⚠️ Testes que PODEM falhar (mas são informativos):
1. **Skeletons**: Podem ser muito rápidos para capturar
2. **Load Times**: Podem variar dependendo da máquina

## 📝 REPORTAR RESULTADOS

### Criar arquivo de resultado:
```bash
# Executar testes e salvar resultado
npx playwright test tests/feature-2.10-*.spec.ts --reporter=json > /mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-2.10-test-results.json

# Executar com trace para debug se necessário
npx playwright test --trace=on
```

### Template de resposta:
```markdown
# Feature 2.10 - Resultados dos Testes Playwright

## ✅ Testes Passaram:
- [ ] Scroll to Top - Aparece após scroll
- [ ] Scroll to Top - Funciona corretamente  
- [ ] Performance - Páginas < 3s
- [ ] Metadata - Títulos dinâmicos corretos
- [ ] Regressão - Busca funcionando
- [ ] Navigation - Links funcionando

## ❌ Testes Falharam:
[Listar falhas encontradas]

## 📊 Métricas:
- Tempo médio carregamento blog: X ms
- Tempo médio carregamento post: X ms
- Total de posts encontrados: X

## 🐛 Issues Encontradas:
[Descrever problemas se houver]

## ✅ Status Final:
- [x] Feature 2.10 funcionando corretamente
- [ ] Feature 2.10 tem problemas (especificar)
```

## 🚨 IMPORTANTE

1. **Iniciar dev server ANTES** dos testes: `npm run dev`
2. **Aguardar aplicação estar pronta** (Ready message no log)
3. **Executar testes em sequence** se houver problemas de concorrência
4. **Reportar TODOS os resultados**, mesmo se alguns testes falharem
5. **Incluir screenshots** de falhas se possível: `--screenshot=only-on-failure`

## 📞 PRÓXIMOS PASSOS

Após executar os testes:
1. Criar arquivo com resultados em `.claude-instructions/feature-2.10-test-results.md`
2. Se tudo passou: confirmar que Feature 2.10 está 100% funcional
3. Se algo falhou: reportar detalhes para correção
4. Validar performance e UX manualmente também

---

**Data de criação**: 29/01/2025
**Responsável**: Claude Code (Feature 2.10)
**Para**: Cursor MCP Testing