# Feature 2.4 - Seção CTA Blog (Planning)

## 📋 Resumo da Feature
Adicionar uma nova seção de Call-to-Action entre "Como Funciona" e o Footer, convidando usuários a explorar o blog.

## 🎯 Objetivo
Aumentar o tráfego para o blog através de um CTA visualmente harmonioso e bem posicionado na landing page.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Criar nova seção ENTRE "Como Funciona" e Footer
- Usar background igual ao resto da página (bg-background)
- Manter consistência visual com resto da página
- Centralizar todo o conteúdo
- Usar Button component do shadcn/ui

### NÃO PODE:
- Modificar seção "Como Funciona" acima
- Alterar o Footer abaixo
- Mudar ordem das seções existentes
- Criar estilos CSS customizados
- Adicionar imagens ou ícones complexos
- Fazer a seção muito alta ou chamativa

## 📁 Análise de Arquivos

### Passo 1: Localizar ponto de inserção
```bash
# Em /app/page.tsx procurar:
- Final da seção "Como Funciona"
- Início do Footer
- Identificar onde inserir nova seção
```

### Passo 2: Arquivos a criar/modificar
```markdown
CRIAR:
- /components/home/blog-cta-section.tsx

MODIFICAR:
- /app/page.tsx (adicionar import e componente)

NÃO TOCAR:
- /components/home/how-it-works.tsx
- /components/footer.tsx
- Qualquer outra seção
- Estilos globais
```

## 🎨 Especificação Visual Detalhada

### Aparência Visual Completa
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    (padding top 64px)                   │
│                                                         │
│      Aprenda com os Especialistas                      │  ← Título (text-3xl font-bold)
│                                                         │
│   Dicas, estratégias e análises no nosso blog         │  ← Subtítulo (text-xl text-muted)
│                                                         │
│                    (spacing 16px)                       │
│                                                         │
│              ┌──────────────────┐                      │
│              │  Explorar Blog   │                      │  ← Botão (size="lg")
│              └──────────────────┘                      │
│                                                         │
│                   (padding bottom 64px)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
   ↑                                                     ↑
   └── Background: MESMO da página (bg-background) ──────┘
```

### Descrição Visual Detalhada

**Background**:
- Cor: `bg-background` (MESMO background do resto da página)
- **IMPORTANTE**: Não usar `bg-muted/30` ou qualquer cor diferente
- Sem contraste ou destaque visual através de cor de fundo
- Largura: 100% da tela
- Sem bordas ou divisórias

**Container**:
- Centralizado horizontalmente
- Máximo 640px de largura (max-w-2xl) para o conteúdo
- Padding lateral para mobile

**Título**:
- Texto: "Aprenda com os Especialistas"
- Tamanho: Grande (text-3xl)
- Peso: Bold (font-bold)
- Cor: Padrão do tema
- Alinhamento: Centro

**Subtítulo**:
- Texto: "Dicas, estratégias e análises no nosso blog"
- Tamanho: Extra large (text-xl)
- Cor: Cinza suave (text-muted-foreground)
- Alinhamento: Centro
- Espaçamento: 16px abaixo do título

**Botão CTA**:
- Texto: "Explorar Blog"
- Tamanho: Large (padding generoso)
- Cor: Primary do tema
- Hover: Escurece levemente
- Formato: Retangular com bordas levemente arredondadas
- Comportamento: Clicável, leva para /blog

**Espaçamento Geral**:
- Padding vertical: 64px em cima e embaixo (py-16)
- Espaço entre título e subtítulo: linha natural do texto
- Espaço entre subtítulo e botão: 16px extra (pt-4)

### Responsividade

**Desktop (1024px+)**:
- Exatamente como descrito acima
- Texto confortável de ler no centro

**Tablet (768px-1024px)**:
- Mesma estrutura
- Padding lateral aumenta um pouco

**Mobile (< 768px)**:
- Título pode quebrar em 2 linhas se necessário
- Subtítulo pode quebrar em 3 linhas
- Botão mantém largura automática (não full width)
- Padding lateral de 16px (px-4)

### Exemplo Visual em Contexto
```
[Seção "Como Funciona" termina aqui]
         ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                          
     Aprenda com os Especialistas         ← Mesmo bg da página
                                          
  Dicas, estratégias e análises no        ← Sem contraste de fundo
          nosso blog                      
                                          
         [Explorar Blog]                  
                                          
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ↓
[Footer começa aqui]
```

## 📐 Especificações Técnicas

### Layout
- **Alinhamento**: Tudo centralizado
- **Container**: max-w-2xl para limitar largura do texto
- **Espaçamento**: py-16 (consistente com outras seções)
- **Background**: bg-background (mesmo da página)

### Tipografia
- **Título**: text-3xl font-bold
- **Subtítulo**: text-xl text-muted-foreground
- **Hierarquia**: Clara distinção entre título e descrição

### Botão
- **Tamanho**: size="lg"
- **Estilo**: Padrão do tema (primary)
- **Link**: Usar asChild com Link do Next.js
- **Hover**: Comportamento padrão do Button

### Componentes shadcn/ui
```bash
# Verificar se Button está instalado:
- /components/ui/button.tsx deve existir
- Se não: npx shadcn-ui@latest add button
```

## ✅ Checklist de Implementação

### Preparação
- [ ] Localizar posição exata em page.tsx
- [ ] Verificar Button component disponível
- [ ] Confirmar estrutura das seções vizinhas
- [ ] Planejar espaçamento

### Implementação
- [ ] Criar BlogCTASection component
- [ ] Implementar estrutura HTML
- [ ] Adicionar textos especificados
- [ ] Configurar Button com Link
- [ ] Aplicar classes Tailwind

### Integração
- [ ] Importar em page.tsx
- [ ] Adicionar entre Como Funciona e Footer
- [ ] Verificar ordem correta
- [ ] Testar navegação para /blog

### Validação
- [ ] Background igual ao resto da página
- [ ] Textos centralizados
- [ ] Botão funcional
- [ ] Link navegando corretamente
- [ ] Responsividade ok
- [ ] Espaçamento consistente

## 🎯 Critérios de Sucesso

1. **Posicionamento**:
   - Entre Como Funciona e Footer ✓
   - Ordem das seções preservada ✓
   - Espaçamento natural ✓

2. **Visual**:
   - Background igual ao resto da página ✓
   - Tudo centralizado ✓
   - Hierarquia clara ✓
   - Harmonioso com página ✓

3. **Funcionalidade**:
   - Botão clicável ✓
   - Navega para /blog ✓
   - Hover states funcionando ✓

4. **Técnico**:
   - Componente reutilizável ✓
   - Sem CSS customizado ✓
   - Usa shadcn/ui Button ✓
   - Performance mantida ✓

## ⏱️ Estimativa
2-3 horas incluindo testes

## 🚫 Erros Comuns a Evitar

1. **Fazer muito grande**: Manter altura moderada
2. **Background diferente**: Usar bg-background, não bg-muted
3. **Adicionar imagens**: Manter apenas texto e botão
4. **Esquecer asChild**: Button deve envolver Link corretamente
5. **CSS customizado**: Usar apenas Tailwind
6. **Modificar vizinhos**: Não tocar em outras seções

## 💡 Possíveis Variações Futuras

(Para referência, não implementar agora)
- Preview de posts recentes
- Contador de artigos
- Categorias do blog
- Newsletter signup

Por ora, manter SIMPLES: título, descrição, botão.

---

**Próximo passo**: Localizar posição exata no page.tsx e confirmar estrutura antes de implementar.