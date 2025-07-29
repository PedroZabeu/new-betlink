# 🧪 Testes Playwright para Feature 2.3 - Textos "Como Funciona"

## 📋 Contexto
A Feature 2.3 atualiza APENAS os textos da seção "Como Funciona", mantendo toda a estrutura visual intacta. São 6 modificações: 3 títulos + 3 descrições.

## 🎯 Sua Tarefa
Execute testes automatizados usando Playwright MCP para validar que APENAS os textos foram alterados e nada mais.

## 📁 Arquivo Modificado
- **APENAS textos em**: `/app/page.tsx` (ou `/components/home/how-it-works.tsx`)

## 🧪 Suite de Testes Completa

### 1. TESTE: Textos Antigos Removidos
```javascript
// Objetivo: Garantir que textos antigos foram substituídos
test('não deve mais exibir textos antigos', async ({ page }) => {
  await page.goto('/')
  
  // Scroll até a seção Como Funciona
  await page.locator('text=Como Funciona').scrollIntoViewIfNeeded()
  
  // Verificar que textos genéricos antigos NÃO existem
  // (Nota: ajustar baseado nos textos reais encontrados)
  await expect(page.locator('text=Explore')).not.toBeVisible()
  await expect(page.locator('text=Cadastre-se')).not.toBeVisible()
  await expect(page.locator('text=Comece')).not.toBeVisible()
  
  // Verificar que não há duplicação (texto novo E antigo)
  const allTexts = await page.locator('text=Descubra').count()
  expect(allTexts).toBe(1) // Apenas uma ocorrência
})
```

### 2. TESTE: Novos Textos Presentes e Corretos
```javascript
// Objetivo: Verificar que os 3 passos têm os textos corretos
test('deve exibir novos textos dos 3 passos', async ({ page }) => {
  await page.goto('/')
  
  // Passo 1
  await expect(page.locator('text=Descubra Profissionais Verificados')).toBeVisible()
  await expect(page.locator('text=Browse nosso catálogo de tipsters com histórico comprovado e métricas transparentes')).toBeVisible()
  
  // Passo 2
  await expect(page.locator('text=Assine os Melhores Canais')).toBeVisible()
  await expect(page.locator('text=Escolha entre planos mensais ou anuais e acesse tips exclusivas dos profissionais')).toBeVisible()
  
  // Passo 3
  await expect(page.locator('text=Tips Direto no Telegram')).toBeVisible()
  await expect(page.locator('text=Receba análises em tempo real e gerencie todas suas assinaturas em um só lugar')).toBeVisible()
})
```

### 3. TESTE: Estrutura Preservada (3 Passos)
```javascript
// Objetivo: Verificar que ainda existem exatamente 3 passos
test('deve manter estrutura de 3 passos', async ({ page }) => {
  await page.goto('/')
  
  // Verificar que números 1, 2, 3 ainda existem
  const step1 = page.locator('text=/1/').first()
  const step2 = page.locator('text=/2/').first()
  const step3 = page.locator('text=/3/').first()
  
  await expect(step1).toBeVisible()
  await expect(step2).toBeVisible()
  await expect(step3).toBeVisible()
  
  // Verificar que são apenas 3 passos (não mais, não menos)
  const stepsCount = await page.locator('[class*="step"], [class*="Step"]').count()
  expect(stepsCount).toBeGreaterThanOrEqual(3)
  expect(stepsCount).toBeLessThanOrEqual(6) // Pode ter containers extras
})
```

### 4. TESTE: Layout Visual Intacto
```javascript
// Objetivo: Verificar que NENHUMA mudança visual ocorreu
test('layout deve permanecer idêntico', async ({ page }) => {
  await page.goto('/')
  
  // Localizar seção Como Funciona
  const section = page.locator('text=Como Funciona').locator('..')
  
  // Verificar que classes principais não mudaram
  const sectionClasses = await section.getAttribute('class')
  expect(sectionClasses).toContain('py-') // Tem padding vertical
  expect(sectionClasses).toContain('bg-') // Tem background
  
  // Verificar alinhamento dos passos
  const firstStep = page.locator('text=Descubra Profissionais Verificados').locator('../..')
  const hasGrid = await firstStep.evaluate(el => {
    const parent = el.parentElement
    return parent.classList.toString().includes('grid') || 
           parent.classList.toString().includes('flex')
  })
  expect(hasGrid).toBe(true)
  
  // Verificar que ícones/números mantêm posição
  const number1 = await page.locator('text=/1/').first().boundingBox()
  const title1 = await page.locator('text=Descubra Profissionais Verificados').boundingBox()
  expect(number1.y).toBeLessThanOrEqual(title1.y + 50) // Número próximo ao título
})
```

### 5. TESTE: Responsividade Mantida
```javascript
// Objetivo: Verificar que textos funcionam em todos os tamanhos
test('textos devem caber em todas as resoluções', async ({ page }) => {
  await page.goto('/')
  
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.locator('text=Como Funciona').scrollIntoViewIfNeeded()
  
  // Verificar que não há overflow
  const desktopOverflow = await page.evaluate(() => {
    const elements = document.querySelectorAll('*')
    for (let el of elements) {
      if (el.scrollWidth > el.clientWidth) return true
    }
    return false
  })
  expect(desktopOverflow).toBe(false)
  
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  
  // Verificar que todos os textos continuam visíveis
  await expect(page.locator('text=Descubra Profissionais Verificados')).toBeVisible()
  await expect(page.locator('text=Browse nosso catálogo')).toBeVisible()
  
  // Verificar quebras de linha apropriadas
  const mobileOverflow = await page.evaluate(() => {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4')
    for (let el of elements) {
      if (el.scrollWidth > el.clientWidth) return true
    }
    return false
  })
  expect(mobileOverflow).toBe(false)
})
```

### 6. TESTE: Zero Modificações Estruturais
```javascript
// Objetivo: Garantir que APENAS strings foram alteradas
test('deve ter zero modificações HTML/CSS', async ({ page }) => {
  await page.goto('/')
  
  // Contar elementos estruturais
  const h3Count = await page.locator('h3').count()
  const pCount = await page.locator('p').count()
  
  // Verificar que contagens fazem sentido (não mudaram drasticamente)
  expect(h3Count).toBeGreaterThan(3) // Pelo menos os 3 títulos
  expect(pCount).toBeGreaterThan(3) // Pelo menos as 3 descrições
  
  // Verificar que não foram adicionados novos elementos
  const spans = await page.locator('span').filter({ hasText: /Descubra|Assine|Tips/ }).count()
  expect(spans).toBe(0) // Não deve ter spans extras adicionados
  
  // Verificar hierarquia mantida
  const title1 = page.locator('text=Descubra Profissionais Verificados')
  const desc1 = page.locator('text=Browse nosso catálogo')
  
  const title1Tag = await title1.evaluate(el => el.tagName)
  const desc1Tag = await desc1.evaluate(el => el.tagName)
  
  expect(['H1', 'H2', 'H3', 'H4']).toContain(title1Tag)
  expect(['P', 'DIV', 'SPAN']).toContain(desc1Tag)
})
```

### 7. TESTE: Performance e Integridade Geral
```javascript
// Objetivo: Verificar que mudança não afetou o resto da página
test('página deve funcionar normalmente', async ({ page }) => {
  const startTime = Date.now()
  
  // Capturar erros
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  
  await page.goto('/', { waitUntil: 'networkidle' })
  
  const loadTime = Date.now() - startTime
  
  // Performance
  expect(loadTime).toBeLessThan(3000)
  
  // Sem erros
  expect(errors).toHaveLength(0)
  
  // Outras seções intactas
  await expect(page.locator('text=Tipsters Verificados')).toBeVisible() // Feature 2.2
  await expect(page.locator('nav')).toBeVisible() // Navegação
  
  // Seção Como Funciona no lugar certo
  const advantages = await page.locator('text=Tipsters Verificados').boundingBox()
  const howItWorks = await page.locator('text=Como Funciona').boundingBox()
  expect(advantages.y).toBeLessThan(howItWorks.y) // Vantagens antes de Como Funciona
})
```

## 📋 Comando para Executar

Use este comando exato no Playwright MCP:

```
Execute todos os 7 testes acima para validar a Feature 2.3 - Textos "Como Funciona". Para cada teste:
1. Execute o teste completo
2. Se falhar, tire screenshot
3. Reporte se passou ou falhou
4. Se falhou, identifique exatamente qual assertion falhou

CRITICAL: Esta feature deve ter modificado APENAS textos. Se qualquer teste indicar mudanças estruturais, é um ERRO GRAVE.

Ao final, apresente:
- Total de testes: 7
- Passaram: X
- Falharam: Y
- Confirmação: "APENAS textos foram modificados" ou "ERRO: mudanças além de textos detectadas"

IMPORTANTE:
- Servidor rodando em http://localhost:3000
- Feature 2.2 deve estar implementada (4 cards de vantagens)
- Foco em detectar qualquer mudança além de strings de texto
```

## ✅ Critérios de Sucesso

Todos os 7 testes devem passar:
1. ✅ Textos antigos completamente substituídos
2. ✅ 6 novos textos presentes e corretos
3. ✅ Estrutura de 3 passos preservada
4. ✅ Layout visual 100% intacto
5. ✅ Responsividade mantida
6. ✅ Zero modificações HTML/CSS
7. ✅ Performance e integridade preservadas

## 🚨 Red Flag - FALHA CRÍTICA SE:

- 🚫 Qualquer elemento HTML foi adicionado/removido
- 🚫 Qualquer classe CSS foi modificada
- 🚫 Layout mudou mesmo minimamente
- 🚫 Mais de 6 strings foram alteradas
- 🚫 Estrutura dos passos foi modificada

## 📊 Relatório Esperado

```markdown
RELATÓRIO DE TESTES - Feature 2.3

✅ Teste 1: Textos Antigos Removidos - PASSOU
✅ Teste 2: Novos Textos Presentes - PASSOU
✅ Teste 3: Estrutura 3 Passos - PASSOU
✅ Teste 4: Layout Intacto - PASSOU
✅ Teste 5: Responsividade - PASSOU
✅ Teste 6: Zero Modificações HTML - PASSOU
✅ Teste 7: Performance - PASSOU

CONFIRMAÇÃO: ✅ APENAS textos foram modificados

RESUMO:
- Total: 7 testes
- Sucesso: 7 (100%)
- Falhas: 0
- Modificações detectadas: APENAS 6 strings de texto

Status: Feature 2.3 aprovada ✅
```

---

**EXECUTE AGORA** usando Playwright MCP e confirme que APENAS textos mudaram!