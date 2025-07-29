# Feature 2.7 - Sistema Básico de Markdown + Tags Visuais (Planning)

## 📋 Resumo da Feature
**PARTE A**: Criar sistema básico para ler posts .md e renderizá-los no blog (VISÍVEL ✅)
**PARTE B**: Adicionar filtros de tags e categorias funcionais (VISÍVEL ✅)

## 🎯 Objetivo
Tornar os 4 posts criados na Feature 2.6 **VISÍVEIS** no blog localhost:3000, substituindo os posts mockados pelos posts reais em Markdown.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- **PARTE A**: Substituir posts mockados por posts reais .md
- **PARTE A**: Instalar dependências (gray-matter, remark)  
- **PARTE A**: Criar funções básicas para ler Markdown
- **PARTE B**: Adicionar filtros visuais funcionais
- **SEMPRE**: Manter design visual existente

### NÃO PODE:
- Modificar cards existentes do blog
- Alterar estrutura visual da página
- Criar novo design
- Quebrar funcionalidades existentes

## ✅ TESTE VISUAL OBRIGATÓRIO:
**Após PARTE A**: Ver 4 novos posts renderizados em localhost:3000/blog
**Após PARTE B**: Ver filtros funcionando na mesma página

## 📁 Estrutura de Arquivos

### PARTE A - Sistema Básico Markdown:
```typescript
/lib/blog/
├── types.ts      // NOVO - Interfaces Post
├── api.ts        // NOVO - Funções getAllPosts(), getPostBySlug()
└── markdown.ts   // NOVO - Processar Markdown

/app/blog/
└── page.tsx      // MODIFICAR - Usar posts reais
```

### PARTE B - Filtros Visuais:
```typescript
/components/blog/
├── tag-filter.tsx    // NOVO - Filtros funcionais
└── category-badge.tsx // NOVO - Badge de categoria
```

## 🔧 Implementação Técnica

### PARTE A - Instalar Dependências:
```bash
npm install gray-matter remark remark-html
```

### PARTE A - Funções Básicas:
```typescript
// /lib/blog/api.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    return {
      slug,
      ...matterResult.data,
      content: matterResult.content
    };
  });
  
  return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1);
}
```

### PARTE A - Modificar Página Blog:
```typescript
// /app/blog/page.tsx
import { getAllPosts } from '@/lib/blog/api';

export default function BlogPage() {
  const posts = getAllPosts(); // Substituir posts mockados
  
  return (
    <PageWrapper>
      <Header />
      <main className="flex-1">
        {/* Manter layout atual, trocar apenas dados */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} /> // Usar posts reais
          ))}
        </div>
      </main>
    </PageWrapper>
  );
}
```

### PARTE B - Filtros Visuais:
```typescript
// /components/blog/tag-filter.tsx
import { Badge } from '@/components/ui/badge';

export function TagFilter({ categories, selectedCategory, onFilterChange }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={!selectedCategory ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange(undefined)}
        >
          Todos
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

### URL Params
```typescript
// Exemplos de URLs:
// /blog - Todos os posts
// /blog?category=educacional - Posts educacionais
// /blog?tag=roi - Posts sobre ROI
// /blog?category=estrategias&tag=ev+ - Combinação
```

## 📐 Design Visual

### Componentes Visuais
1. **Category Pills**: Usar Badge component existente
2. **Tag Chips**: Estilo consistente com o design
3. **Contadores**: Número pequeno ao lado de cada filtro
4. **Estado ativo**: Destaque visual para filtros selecionados
5. **Clear filters**: Botão para limpar todos os filtros

### Layout
```
[Categorias - Pills horizontais]
educacional (4) | estratégias (3) | gestão (2) | ferramentas (3)

[Tags - Chips em grid]
iniciantes (5) | roi (3) | ev+ (2) | tipsters (4) | ...

[Clear Filters] - quando algum filtro ativo
```

## ✅ Checklist de Implementação

### PARTE A - Sistema Básico (TESTE: Posts visíveis em /blog)
- [ ] Instalar dependências: gray-matter, remark, remark-html
- [ ] Criar /lib/blog/types.ts com interfaces
- [ ] Criar /lib/blog/api.ts com getAllPosts()
- [ ] Modificar /app/blog/page.tsx para usar posts reais
- [ ] **TESTE VISUAL**: Ver 4 posts reais renderizados

### PARTE B - Filtros Funcionais (TESTE: Filtros funcionando)
- [ ] Criar TagFilter component
- [ ] Adicionar estado de filtros na página
- [ ] Implementar lógica de filtragem
- [ ] **TESTE VISUAL**: Clicar nos filtros e ver posts filtrados

### Validação
- [ ] Todos os 4 posts aparecem corretamente
- [ ] Cards mantêm design existente
- [ ] Filtros por categoria funcionam
- [ ] Performance mantida

## 🎯 Critérios de Sucesso

### PARTE A - Sistema Básico:
1. **Visibilidade**: 
   - 4 posts reais aparecem em localhost:3000/blog ✓
   - Substituem os posts mockados ✓
   - Cards mantêm design existente ✓

2. **Funcionalidade**:
   - getAllPosts() funciona ✓
   - Front matter é processado corretamente ✓
   - Links para posts individuais funcionam ✓

### PARTE B - Filtros:
1. **Filtros funcionais**:
   - Clicar em categoria filtra posts ✓
   - "Todos" mostra todos os posts ✓
   - Visual dos filtros integrado ✓

2. **Performance**:
   - Filtragem instantânea ✓
   - Sem quebras visuais ✓

## ⏱️ Estimativa
- **PARTE A**: 2 horas (sistema básico)
- **PARTE B**: 1-2 horas (filtros)
- **Total**: 3-4 horas

## 🚫 Erros Comuns a Evitar

1. **Não testar visualmente**: Após PARTE A, DEVE ver posts em /blog
2. **Quebrar design**: Manter cards exatamente iguais
3. **Não instalar dependências**: gray-matter é obrigatório
4. **Não processar Markdown**: Posts devem renderizar conteúdo
5. **Filtros complexos**: Começar apenas com categorias simples

## 🧪 TESTE OBRIGATÓRIO:

### Após PARTE A:
```bash
# Iniciar servidor
npm run dev

# Abrir http://localhost:3000/blog
# DEVE VER: 4 posts reais (não os mockados antigos)
# DEVE VER: Títulos dos posts criados na Feature 2.6
```

### Após PARTE B:
```bash
# Na mesma página /blog
# DEVE VER: Filtros de categoria acima dos posts
# DEVE FUNCIONAR: Clicar em "educacional" → filtrar posts
```

## 💡 Tags Sugeridas

### Tags Populares (para reutilizar):
- `iniciantes` - Conteúdo para quem está começando
- `avançado` - Conceitos complexos
- `roi` - Return on Investment
- `yield` - Rendimento percentual
- `ev+` - Expected Value positivo
- `tipsters` - Sobre profissionais
- `limitação` - Evitar restrições
- `gestão` - Gestão de banca
- `tutorial` - Passo a passo
- `análise` - Análise estatística
- `estratégia` - Métodos e táticas
- `ferramentas` - Uso de tools

---

**Próximo passo**: Implementar Feature 2.8 (Sistema de Busca) para complementar a navegação por filtros.