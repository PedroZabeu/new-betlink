# Feature 2.7 - Sistema de Tags e Categorias (Planning)

## 📋 Resumo da Feature
Implementar sistema de organização por categorias fixas e tags flexíveis, permitindo filtros combinados na página do blog.

## 🎯 Objetivo
Facilitar a descoberta de conteúdo relacionado através de um sistema robusto de categorização e tags, melhorando a experiência de navegação no blog.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Criar types e interfaces TypeScript
- Adicionar metadata aos 12 posts (8 existentes + 4 novos)
- Criar componente TagFilter reutilizando design existente
- Implementar filtros via URL params
- Mostrar contador de posts por filtro
- Permitir combinação de filtros

### NÃO PODE:
- Criar novo design visual
- Modificar cards existentes do blog
- Alterar estrutura da página
- Adicionar animações complexas
- Criar sistema de banco de dados

## 📁 Estrutura de Arquivos

### Arquivos a criar:
```typescript
/lib/blog/
├── types.ts      // NOVO - Interfaces e types
├── api.ts        // NOVO - Funções para processar posts
└── utils.ts      // NOVO - Helpers e utilitários

/components/blog/
├── tag-filter.tsx    // NOVO - Componente de filtros
└── category-badge.tsx // NOVO - Badge de categoria
```

## 🔧 Implementação Técnica

### Types e Interfaces
```typescript
// /lib/blog/types.ts
export interface Author {
  name: string;
  picture: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: Author;
  category: Category;
  tags: string[];
  readingTime: number;
  content: string;
  featured?: boolean;
}

export type Category = 'educacional' | 'estrategias' | 'gestao-banca' | 'ferramentas';

export interface CategoryInfo {
  value: Category;
  label: string;
  description: string;
  color: string; // Para o badge
}
```

### Sistema de Categorias
```typescript
// 4 categorias fixas
export const CATEGORIES: CategoryInfo[] = [
  {
    value: 'educacional',
    label: 'Educacional',
    description: 'Conceitos e fundamentos',
    color: 'blue'
  },
  {
    value: 'estrategias',
    label: 'Estratégias',
    description: 'Dicas e métodos práticos',
    color: 'green'
  },
  {
    value: 'gestao-banca',
    label: 'Gestão de Banca',
    description: 'Controle financeiro',
    color: 'yellow'
  },
  {
    value: 'ferramentas',
    label: 'Ferramentas',
    description: 'Uso da plataforma',
    color: 'purple'
  }
];
```

### Componente TagFilter
```typescript
// /components/blog/tag-filter.tsx
interface TagFilterProps {
  categories: CategoryInfo[];
  tags: string[];
  selectedCategory?: string;
  selectedTags: string[];
  onFilterChange: (category?: string, tags?: string[]) => void;
  postCounts: {
    byCategory: Record<string, number>;
    byTag: Record<string, number>;
  };
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

### Types e Estrutura
- [ ] Criar arquivo types.ts com interfaces
- [ ] Definir enum/type para categorias
- [ ] Criar type para tags (string[])
- [ ] Adicionar types de filtros

### Processamento
- [ ] Função para extrair tags únicas
- [ ] Função para contar posts por categoria/tag
- [ ] Função para filtrar posts
- [ ] Função para combinar filtros

### Componentes
- [ ] TagFilter component
- [ ] CategoryBadge component
- [ ] Integrar com página do blog
- [ ] Adicionar estado de filtros

### URL e Estado
- [ ] Ler filtros da URL
- [ ] Atualizar URL ao filtrar
- [ ] Manter filtros ao navegar
- [ ] Botão clear filters

### Metadata nos Posts
- [ ] Adicionar categoria aos 8 posts existentes
- [ ] Adicionar tags relevantes (3-6 por post)
- [ ] Validar categorias válidas
- [ ] Garantir tags consistentes

## 🎯 Critérios de Sucesso

1. **Funcionalidade**:
   - Filtros por categoria funcionando ✓
   - Filtros por tags funcionando ✓
   - Combinação de filtros ✓
   - Contadores precisos ✓

2. **UX**:
   - Filtros responsivos ✓
   - Estado claro (ativo/inativo) ✓
   - Fácil limpar filtros ✓
   - URL compartilhável ✓

3. **Performance**:
   - Filtragem instantânea ✓
   - Sem re-render desnecessário ✓
   - Estado preservado ✓

## ⏱️ Estimativa
3-4 horas

## 🚫 Erros Comuns a Evitar

1. **Categorias demais**: Manter apenas 4 categorias
2. **Tags inconsistentes**: Padronizar nomenclatura
3. **Filtros complexos**: Manter simples e intuitivo
4. **Performance**: Evitar re-processar em cada render
5. **Estado perdido**: Preservar filtros na navegação

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