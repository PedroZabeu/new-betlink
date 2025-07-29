# Feature 2.7: Sistema de Tags e Categorias - PLANEJAMENTO REVISADO

## 📋 Informações Básicas
- **EPIC**: 2 - Landing, Blog & Discovery
- **Feature**: 2.7 - Sistema de Tags e Categorias
- **Status**: 🔄 REVISADO - Nova arquitetura
- **Complexidade**: Média-Alta
- **Estimativa**: 90 minutos (reduzido de 150min)
- **Dependencies**: Feature 2.6 (Posts criados) ✅

---

## 🎯 Objetivo

Implementar sistema completo de filtros para o blog que permita:
- 🔍 **Busca textual** nos 4 posts criados
- 🏷️ **Filtros por categoria** (4 categorias)
- #️⃣ **Filtros por tags** (dinâmicas)
- 🔗 **Sincronização com URL** (compartilhável)
- 📊 **Contadores dinâmicos**

**CRÍTICO**: Fazer os 4 posts markdown criados na Feature 2.6 ficarem **visíveis** no site.

---

## 📚 Lições da Primeira Tentativa

### ❌ **Erro Fundamental**
```typescript
// ❌ ERRADO - Client component com fs
'use client';
export default function BlogPage() {
  const posts = getAllPosts(); // fs não funciona no browser!
}
```

### ✅ **Solução Identificada**
**Baseado no Next.js Blog Starter (referência oficial)**
```typescript
// ✅ CORRETO - Server component
export default function BlogPage() {
  const posts = getAllPosts(); // fs funciona no servidor
  return <BlogClient posts={posts} />;
}

// ✅ Client component para interatividade
'use client';
function BlogClient({ posts }) {
  const [filters, setFilters] = useState({});
  // filtros funcionam com dados recebidos
}
```

---

## 🏗️ Arquitetura Híbrida

### **Separação de Responsabilidades**
```
📁 Server Component (/app/blog/page.tsx)
├── ✅ File system access (fs, path, gray-matter)
├── ✅ Static generation (generateStaticParams)
├── ✅ SEO/metadata
└── ✅ Data processing server-side

📁 Client Component (/components/blog/blog-client.tsx)  
├── ✅ Filter state management
├── ✅ URL synchronization
├── ✅ Interactive UI
└── ✅ Real-time filtering
```

### **Data Flow**
```
Markdown Files (/_posts/*.md)
        ↓
Server Component (fs access)
        ↓
Processed Data (posts + categories + tags)
        ↓  
Client Component (interactivity)
        ↓
Filtered Results (real-time)
```

---

## 📂 Estrutura de Arquivos

### **Arquivos Novos**
```
/lib/blog/
├── api.ts              # Baseado no Next.js starter
├── types.ts            # Interfaces e enums  
└── filters.ts          # Client-side utilities

/components/blog/
├── blog-client.tsx     # Client component principal
├── tag-filter.tsx      # Sistema de filtros
├── category-badge.tsx  # Component de categoria
└── tag-chip.tsx        # Component de tag

/app/blog/
└── page.tsx            # Server component (MODIFICADO)
```

### **Arquivos Modificados**
```
/app/blog/page.tsx      # Remove 'use client', adiciona data loading
```

---

## 🎨 Design System

### **Categorias (4 fixas)**
```typescript
enum Category {
  EDUCACIONAL = 'educacional',    // Azul
  ESTRATEGIAS = 'estrategias',     // Verde  
  GESTAO_BANCA = 'gestao-banca',  // Amarelo
  FERRAMENTAS = 'ferramentas'     // Roxo
}
```

### **Tags (dinâmicas)**
Extraídas dos posts existentes:
- `iniciantes`, `métricas`, `roi` (do post 1)
- `avançado`, `ev+`, `value-betting` (do post 2)
- `limitação`, `casas-apostas`, `sharp-betting` (do post 3)
- `tipsters`, `diversificação`, `carteira` (do post 4)

---

## ⚡ Implementação por Fases

### **FASE 1: Server Component Data Loading (30min)**

#### 1.1 Criar API utilitários (`/lib/blog/api.ts`)
```typescript
// Baseado no Next.js Blog Starter
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getAllPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map(filename => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        author: data.author,
        category: data.category,
        tags: data.tags || [],
        content
      };
    });
    
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

#### 1.2 Criar types (`/lib/blog/types.ts`)
```typescript
export enum Category {
  EDUCACIONAL = 'educacional',
  ESTRATEGIAS = 'estrategias', 
  GESTAO_BANCA = 'gestao-banca',
  FERRAMENTAS = 'ferramentas'
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: { name: string };
  category: Category;
  tags: string[];
  content: string;
}

export interface FilterState {
  categories: Category[];
  tags: string[];
  searchQuery?: string;
}
```

#### 1.3 Modificar página do blog (`/app/blog/page.tsx`)
```typescript
// Remove 'use client'
import { getAllPosts } from '@/lib/blog/api';
import { BlogClient } from '@/components/blog/blog-client';

export default function BlogPage() {
  const posts = getAllPosts(); // fs access OK no servidor
  
  return (
    <PageWrapper>
      <Header />
      <main className="flex-1">
        <BlogClient posts={posts} />
      </main>
    </PageWrapper>
  );
}
```

### **FASE 2: Client Component Interatividade (45min)**

#### 2.1 Criar BlogClient (`/components/blog/blog-client.tsx`)
```typescript
'use client';
import { useState, useMemo } from 'react';
import { BlogPost, FilterState } from '@/lib/blog/types';
import { TagFilter } from './tag-filter';
import { PostGrid } from './post-grid';

interface BlogClientProps {
  posts: BlogPost[];
}

export function BlogClient({ posts }: BlogClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    searchQuery: undefined
  });

  const filteredPosts = useMemo(() => {
    return filterPosts(posts, filters);
  }, [posts, filters]);

  const availableTags = useMemo(() => {
    return extractUniqueTagsFromPosts(posts);
  }, [posts]);

  return (
    <div className="container mx-auto px-4 py-12">
      <TagFilter
        posts={posts}
        availableTags={availableTags}
        currentFilters={filters}
        onFilterChange={setFilters}
      />
      
      <PostGrid posts={filteredPosts} />
    </div>
  );
}
```

#### 2.2 Recriar TagFilter (`/components/blog/tag-filter.tsx`)
- Reutilizar 80% da lógica da primeira tentativa
- Receber dados via props ao invés de carregar
- Manter toda funcionalidade de filtros

#### 2.3 Criar components auxiliares
- `CategoryBadge` - visual para categorias
- `TagChip` - visual para tags  
- `PostGrid` - layout dos posts

### **FASE 3: Integração e Polish (15min)**

#### 3.1 URL Sync (simplificado)
```typescript
// Hook simplificado para URL
function useFiltersFromUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Implementação básica sem over-engineering
}
```

#### 3.2 Testes finais
- ✅ 4 posts aparecem no site
- ✅ Filtros funcionam
- ✅ Busca funciona
- ✅ URL sync funciona
- ✅ Mobile responsive

---

## 🧪 Plano de Testes

### **Teste 1: Data Loading**
```bash
# Deve mostrar 4 posts reais (não mockados)
Acessar localhost:3000/blog
Verificar que posts são os criados na Feature 2.6:
- "Métricas Essenciais para Apostadores"
- "Entendendo o EV+ (Valor Esperado Positivo)"  
- "Estratégias para Manter Contas Ativas"
- "Montando uma Carteira de Tipsters"
```

### **Teste 2: Filtros por Categoria**
```bash
Clicar em "Educacional" → deve mostrar 1 post (Métricas)
Clicar em "Estratégias" → deve mostrar 1 post (EV+)
Clicar em "Gestão de Banca" → deve mostrar 1 post (Contas Ativas)
Clicar em "Ferramentas" → deve mostrar 1 post (Carteira Tipsters)
```

### **Teste 3: Filtros por Tags**
```bash
Clicar em tag "iniciantes" → deve mostrar post Métricas
Clicar em tag "avançado" → deve mostrar post EV+
Clicar em tag "gestão" → deve mostrar posts relevantes
```

### **Teste 4: Busca Textual**
```bash
Buscar "ROI" → deve mostrar posts que mencionam ROI
Buscar "tipsters" → deve mostrar post sobre carteira
Buscar "EV" → deve mostrar post sobre valor esperado
```

### **Teste 5: Combinação de Filtros**
```bash
Categoria "Educacional" + tag "iniciantes" → 1 resultado
Busca "apostas" + categoria "Estratégias" → resultados filtrados
```

---

## 🚨 Guardrails

### **NUNCA Modificar**
- Sistema de autenticação existente
- Header/Navigation structure
- Middleware de acesso
- Outras páginas do site

### **SEMPRE Preservar**
- Funcionalidade do blog atual (se existir)
- Design system (shadcn/ui)
- Padrões de código existentes
- Performance da aplicação

### **CRITICAL Success Factors**
- ✅ Os 4 posts markdown DEVEM aparecer no site
- ✅ Filtros DEVEM funcionar sem erros
- ✅ ZERO erros de fs/client boundaries
- ✅ Performance < 100ms para filtros

---

## 📊 Definition of Done

### **Funcional**
- [ ] 4 posts markdown visíveis em localhost:3000/blog
- [ ] Filtros por categoria funcionando
- [ ] Filtros por tags funcionando  
- [ ] Busca textual funcionando
- [ ] Combinação de filtros funcionando
- [ ] Contadores precisos (X posts por categoria/tag)
- [ ] Clear filters funcionando

### **Técnico**
- [ ] Zero erros de TypeScript
- [ ] Build passa sem warnings
- [ ] Dev server inicia sem erros
- [ ] Componentes seguem padrões shadcn/ui
- [ ] Logging apropriado implementado

### **UX/Performance**
- [ ] Filtros respondem < 100ms
- [ ] Mobile responsive
- [ ] Estados de loading apropriados
- [ ] Feedback visual para filtros ativos
- [ ] URL sincronizada (shareable)

---

## 🎯 Critérios de Sucesso

**Primary Goal**: Os 4 posts criados ficam visíveis e filtráveis no site
**Secondary Goal**: Sistema de filtros robusto e performático
**Tertiary Goal**: Base sólida para Features 2.8-2.10

**Success Rate Esperado**: 95% (vs 70% primeira tentativa)
**Time to Complete**: 90 minutos (vs 150min primeira tentativa)
**Risk Level**: Baixo (arquitetura validada pelo Next.js team)

---

## 🔗 Referências

- **Next.js Blog Starter**: https://github.com/vercel/next.js/tree/canary/examples/blog-starter
- **Gray Matter Docs**: https://github.com/jonschlinkert/gray-matter
- **shadcn/ui Components**: https://ui.shadcn.com/docs/components
- **Next.js App Router**: https://nextjs.org/docs/app/building-your-application/routing

---

**Status**: 🔄 Ready for implementation
**Next Action**: Iniciar Fase 1 - Server Component Data Loading
**Expected Completion**: Hoje, ~90 minutos