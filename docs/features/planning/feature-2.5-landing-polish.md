# Feature 2.5 - Polimento Final (Planning)

## 📋 Resumo da Feature
Otimizar performance, acessibilidade e compatibilidade cross-browser da landing page sem alterar funcionalidades ou visual.

## 🎯 Objetivo
Garantir que a landing page atenda aos padrões de qualidade em performance (Lighthouse > 90), acessibilidade e funcione perfeitamente em todos os navegadores.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Otimizar imagens (formato, tamanho, lazy loading)
- Adicionar alt texts faltantes
- Verificar contrastes de cor
- Testar em múltiplos navegadores
- Melhorar meta tags se necessário
- Revisar espaçamentos finais

### NÃO PODE:
- Alterar layout ou design visual
- Modificar funcionalidades
- Mudar estrutura de componentes
- Adicionar novos elementos
- Refatorar código funcionando
- Criar CSS customizado

## 📁 Análise de Otimizações

### Áreas de Foco
```markdown
1. PERFORMANCE
   - Imagens: formato, compressão, lazy loading
   - Fonts: preload, display swap
   - Scripts: defer/async onde apropriado
   - CSS: remover não utilizado

2. ACESSIBILIDADE
   - Alt texts em todas as imagens
   - Aria labels onde necessário
   - Contraste de cores (WCAG AA)
   - Navegação por teclado

3. SEO BÁSICO
   - Meta description
   - Open Graph tags
   - Título otimizado
   - Structured data (se aplicável)

4. COMPATIBILIDADE
   - Chrome, Firefox, Safari, Edge
   - Prefixes CSS se necessário
   - Polyfills apenas se crítico
```

## 🔍 Checklist de Auditoria

### Performance Audit
```bash
# Lighthouse checks:
- Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

# Specific metrics:
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Cumulative Layout Shift < 0.1
```

### Imagens
```markdown
VERIFICAR:
- [ ] Formatos otimizados (WebP com fallback)
- [ ] Tamanhos apropriados (não servir 4K para thumbnail)
- [ ] Lazy loading em imagens below the fold
- [ ] Alt text descritivo em TODAS as imagens

EXEMPLO:
<!-- Antes -->
<img src="/hero.png" />

<!-- Depois -->
<Image 
  src="/hero.webp" 
  alt="Plataforma BetLink mostrando dashboard de tipsters"
  loading="lazy"
  width={800}
  height={400}
/>
```

### Acessibilidade
```markdown
ELEMENTOS A VERIFICAR:
- [ ] Links: texto descritivo (não apenas "clique aqui")
- [ ] Botões: aria-label se texto não for claro
- [ ] Formulários: labels associados corretamente
- [ ] Contraste: texto/fundo mínimo 4.5:1
- [ ] Focus: visible e com estilo adequado
```

### Meta Tags
```html
<!-- Mínimo necessário -->
<meta name="description" content="Descubra os melhores tipsters verificados de apostas esportivas. Estatísticas reais, gestão unificada e tips direto no Telegram.">
<meta property="og:title" content="BetLink - Conecte-se aos Melhores Tipsters">
<meta property="og:description" content="Plataforma de descoberta de tipsters profissionais verificados">
<meta property="og:image" content="/og-image.png">
```

## ✅ Checklist de Implementação

### 1. Análise Inicial
- [ ] Rodar Lighthouse e salvar relatório base
- [ ] Listar todas as imagens da página
- [ ] Identificar elementos sem acessibilidade
- [ ] Verificar meta tags atuais

### 2. Otimização de Imagens
- [ ] Converter PNGs grandes para WebP
- [ ] Implementar lazy loading onde falta
- [ ] Adicionar width/height explícitos
- [ ] Escrever alt texts descritivos

### 3. Acessibilidade
- [ ] Adicionar aria-labels faltantes
- [ ] Verificar contraste de cores
- [ ] Testar navegação por teclado
- [ ] Garantir focus states visíveis

### 4. Performance
- [ ] Otimizar carregamento de fonts
- [ ] Verificar bundle size
- [ ] Implementar preload crítico
- [ ] Remover CSS não utilizado

### 5. Cross-browser
- [ ] Testar em Chrome
- [ ] Testar em Firefox
- [ ] Testar em Safari
- [ ] Testar em Edge

### 6. SEO e Meta
- [ ] Atualizar meta description
- [ ] Adicionar Open Graph tags
- [ ] Verificar título da página
- [ ] Testar preview social

## 🎯 Critérios de Sucesso

### Lighthouse Scores
```markdown
MÍNIMO ACEITÁVEL:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

IDEAL:
- Todos acima de 95
```

### Validações Específicas
1. **Imagens**:
   - Todas com alt text ✓
   - Formato otimizado ✓
   - Lazy loading implementado ✓

2. **Acessibilidade**:
   - Navegável por teclado ✓
   - Contraste adequado ✓
   - Screen reader friendly ✓

3. **Performance**:
   - Carrega < 3s em 3G ✓
   - Sem layout shifts ✓
   - Interativo rapidamente ✓

4. **Compatibilidade**:
   - Funciona em todos os navegadores ✓
   - Sem erros no console ✓
   - Visual consistente ✓

## ⏱️ Estimativa
2-3 horas (dependendo das otimizações necessárias)

## 🚫 O que NÃO é escopo desta feature

1. **Redesign**: Não mudar visual
2. **Novas funcionalidades**: Não adicionar features
3. **Refatoração**: Não reescrever código funcionando
4. **Animações**: Não adicionar efeitos novos
5. **Conteúdo**: Não mudar textos (exceto alt/meta)

## 💡 Ferramentas Úteis

```bash
# Lighthouse
- Chrome DevTools > Lighthouse

# Acessibilidade
- axe DevTools extension
- WAVE (WebAIM)

# Performance
- WebPageTest
- GTmetrix

# Cross-browser
- BrowserStack (ou testar manualmente)
```

## 📊 Relatório de Mudanças

Documentar todas as otimizações:
```markdown
## Otimizações Realizadas

### Imagens
- hero.png → hero.webp (250KB → 45KB)
- Adicionado lazy loading em 4 imagens
- Alt texts adicionados: 6 imagens

### Acessibilidade
- Contraste do texto muted ajustado
- Aria-labels em 3 botões
- Focus ring melhorado

### Performance
- Font preload adicionado
- CSS crítico inline
- Bundle reduzido em 15%

### Lighthouse
- Performance: 78 → 94
- Accessibility: 82 → 96
- Best Practices: 90 → 100
- SEO: 88 → 95
```

## ⚠️ Red Flags - PARAR SE:

1. Visual mudar em qualquer aspecto
2. Funcionalidade quebrar
3. Layout se desalinhar
4. Performance piorar
5. Novos erros aparecerem

## 🔧 Configurações de Otimização

### Next.js Image Component
```tsx
// Configuração padrão para otimização
<Image
  src="/image.webp"
  alt="Descrição clara da imagem"
  width={800}
  height={400}
  loading="lazy" // apenas para imagens below the fold
  placeholder="blur" // se tiver blurDataURL
/>
```

### Meta Tags no layout.tsx
```tsx
export const metadata = {
  title: 'BetLink - Conecte-se aos Melhores Tipsters',
  description: 'Descubra os melhores tipsters verificados...',
  openGraph: {
    title: 'BetLink - Conecte-se aos Melhores Tipsters',
    description: 'Plataforma de descoberta...',
    images: ['/og-image.png'],
  },
}
```

---

**Importante**: Esta feature é sobre POLIR o que existe, não adicionar coisas novas. Foco em métricas objetivas e melhorias mensuráveis.