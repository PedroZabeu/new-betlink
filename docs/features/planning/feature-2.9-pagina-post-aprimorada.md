# Feature 2.9 - Página Individual de Post Aprimorada (Planning)

## 📋 Resumo da Feature
Melhorar a experiência de leitura individual dos posts, adicionando breadcrumbs, navegação entre posts, posts relacionados e compartilhamento social.

## 🎯 Objetivo
Transformar a página individual de post em uma experiência completa de leitura, facilitando navegação e descoberta de conteúdo relacionado.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Adicionar breadcrumbs navegáveis
- Implementar navegação anterior/próximo
- Mostrar posts relacionados (mesma categoria)
- Adicionar botões de compartilhamento
- Melhorar exibição de metadata
- Manter design consistente

### NÃO PODE:
- Criar novo layout visual
- Modificar estrutura base da página
- Adicionar bibliotecas de compartilhamento
- Implementar comentários
- Criar sistema de likes/reações

## 📁 Estrutura de Arquivos

### Arquivos a modificar:
```
/app/blog/[slug]/page.tsx    // MODIFICAR - Adicionar novos componentes

/components/blog/
├── breadcrumbs.tsx          // NOVO - Navegação breadcrumb
├── post-navigation.tsx      // NOVO - Anterior/Próximo
├── related-posts.tsx        // NOVO - Posts relacionados
├── share-buttons.tsx        // NOVO - Compartilhamento
└── reading-progress.tsx     // NOVO - Barra de progresso
```

## 🔧 Implementação Técnica

### Breadcrumbs Component
```typescript
// /components/blog/breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  category: string;
  categoryLabel: string;
  postTitle: string;
}

export function Breadcrumbs({ category, categoryLabel, postTitle }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/blog" className="hover:text-foreground">
        Blog
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link 
        href={`/blog?category=${category}`} 
        className="hover:text-foreground"
      >
        {categoryLabel}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground truncate max-w-[200px]">
        {postTitle}
      </span>
    </nav>
  );
}
```

### Post Navigation
```typescript
// /components/blog/post-navigation.tsx
interface PostNavigationProps {
  previousPost?: {
    slug: string;
    title: string;
  };
  nextPost?: {
    slug: string;
    title: string;
  };
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  return (
    <div className="flex justify-between items-center py-8 border-t">
      {previousPost ? (
        <Link href={`/blog/${previousPost.slug}`} className="group">
          <span className="text-sm text-muted-foreground">Anterior</span>
          <h4 className="font-medium group-hover:text-primary">
            {previousPost.title}
          </h4>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPost ? (
        <Link href={`/blog/${nextPost.slug}`} className="group text-right">
          <span className="text-sm text-muted-foreground">Próximo</span>
          <h4 className="font-medium group-hover:text-primary">
            {nextPost.title}
          </h4>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
```

### Share Buttons
```typescript
// /components/blog/share-buttons.tsx
import { Link2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt: string;
}

export function ShareButtons({ url, title, excerpt }: ShareButtonsProps) {
  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
      '_blank'
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank'
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    // Mostrar toast de sucesso
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={shareWhatsApp}>
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={shareTelegram}>
        <Send className="h-4 w-4 mr-2" />
        Telegram
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Link2 className="h-4 w-4 mr-2" />
        Copiar Link
      </Button>
    </div>
  );
}
```

### Related Posts
```typescript
// /components/blog/related-posts.tsx
interface RelatedPostsProps {
  posts: Post[];
  currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  // Filtrar post atual e limitar a 3
  const related = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold mb-6">Posts Relacionados</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
```

### Reading Progress Bar
```typescript
// /components/blog/reading-progress.tsx
"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
      <div 
        className="h-full bg-primary transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

## 📐 Layout Aprimorado

### Estrutura da Página
```
[Reading Progress Bar]

[Breadcrumbs]
Home > Blog > Educacional > Título do Post

[Metadata]
Por João Silva | 30 de Janeiro, 2025 | 8 min de leitura

[Título]
[Tags]

[Share Buttons]

[Conteúdo do Post]

[Post Navigation]
← Anterior          Próximo →

[Related Posts]
[Card 1] [Card 2] [Card 3]
```

## ✅ Checklist de Implementação

### Componentes Novos
- [ ] Criar Breadcrumbs component
- [ ] Criar PostNavigation component
- [ ] Criar ShareButtons component
- [ ] Criar RelatedPosts component
- [ ] Criar ReadingProgress component

### Funções de API
- [ ] getAdjacentPosts(currentSlug)
- [ ] getRelatedPosts(category, currentSlug)
- [ ] Adicionar generateStaticParams

### Integração
- [ ] Adicionar componentes à página
- [ ] Passar props corretas
- [ ] Testar navegação
- [ ] Validar compartilhamento

### SEO e Meta Tags
- [ ] Open Graph tags específicas
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] Structured data (Article)

## 🎯 Critérios de Sucesso

1. **Navegação**:
   - Breadcrumbs funcionais ✓
   - Posts anterior/próximo ✓
   - Links corretos ✓

2. **Descoberta**:
   - Posts relacionados relevantes ✓
   - Máximo 3 posts ✓
   - Mesma categoria ✓

3. **Engajamento**:
   - Compartilhamento funcional ✓
   - Copy link com feedback ✓
   - Progress bar suave ✓

4. **Performance**:
   - Static generation ✓
   - Lazy loading mantido ✓
   - Sem layout shift ✓

## ⏱️ Estimativa
3-4 horas

## 🚫 Erros Comuns a Evitar

1. **Layout shift**: Progress bar deve ser fixed
2. **Links quebrados**: Validar todas as rotas
3. **Compartilhamento**: Testar em mobile
4. **SEO**: Não esquecer meta tags
5. **Performance**: Evitar re-renders

## 💡 Detalhes Importantes

### Ordem dos Posts
- Anterior/Próximo: Por data de publicação
- Relacionados: Mesma categoria, mais recentes primeiro

### Compartilhamento
- WhatsApp: Incluir título + URL
- Telegram: Título e URL separados
- Copy: Apenas URL, mostrar toast

### Mobile
- Breadcrumbs: Truncar título longo
- Navigation: Empilhar vertical
- Share: Ícones menores

---

**Próximo passo**: Implementar Feature 2.10 (Performance e UX) para otimizar toda a experiência do blog.