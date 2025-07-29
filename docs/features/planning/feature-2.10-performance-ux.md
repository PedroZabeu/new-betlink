# Feature 2.10 - Melhorias de Performance e UX (Planning)

## 📋 Resumo da Feature
Otimizar performance do blog com Static Generation, implementar loading skeletons, scroll to top e outras melhorias de UX.

## 🎯 Objetivo
Garantir que o blog carregue rapidamente, tenha transições suaves e ofereça a melhor experiência possível aos usuários.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Implementar Static Generation (SSG)
- Adicionar loading skeletons
- Criar scroll to top button
- Otimizar imagens com lazy loading
- Manter Lighthouse > 90
- Cache inteligente de posts

### NÃO PODE:
- Adicionar bibliotecas de animação pesadas
- Criar loading screens complexos
- Modificar estrutura visual existente
- Usar client-side fetching
- Comprometer SEO

## 📁 Estrutura de Arquivos

### Arquivos a criar/modificar:
```
/app/blog/
├── page.tsx              // MODIFICAR - Add generateStaticParams
└── [slug]/page.tsx       // MODIFICAR - Add generateStaticParams

/components/blog/
├── post-skeleton.tsx     // NOVO - Loading skeleton
├── scroll-to-top.tsx     // NOVO - Botão scroll
└── lazy-image.tsx        // NOVO - Imagem otimizada

/lib/blog/
└── cache.ts             // NOVO - Sistema de cache
```

## 🔧 Implementação Técnica

### Static Generation
```typescript
// /app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### Post Skeleton
```typescript
// /components/blog/post-skeleton.tsx
export function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-muted rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Scroll to Top
```typescript
// /components/blog/scroll-to-top.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-8 right-8 z-50 shadow-lg"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
```

### Lazy Image Component
```typescript
// /components/blog/lazy-image.tsx
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoadingComplete={() => setIsLoading(false)}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}
```

### Cache System
```typescript
// /lib/blog/cache.ts
const postCache = new Map<string, Post>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheEntry {
  data: Post;
  timestamp: number;
}

export function getCachedPost(slug: string): Post | null {
  const entry = postCache.get(slug);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    postCache.delete(slug);
    return null;
  }
  
  return entry.data;
}

export function setCachedPost(slug: string, post: Post): void {
  postCache.set(slug, {
    data: post,
    timestamp: Date.now(),
  });
}
```

## 📐 Otimizações de Performance

### 1. Bundle Optimization
```typescript
// Dynamic imports para componentes pesados
const HeavyComponent = dynamic(
  () => import('./heavy-component'),
  { 
    loading: () => <Skeleton />,
    ssr: false 
  }
);
```

### 2. Font Optimization
```css
/* Já configurado no layout.tsx */
font-display: swap;
```

### 3. Image Optimization
- Usar next/image sempre
- Definir width/height
- Lazy loading automático
- Blur placeholder quando possível

### 4. Prefetch Strategy
```typescript
// Prefetch posts relacionados
<Link href={`/blog/${post.slug}`} prefetch={true}>
  {post.title}
</Link>
```

## ✅ Checklist de Implementação

### Static Generation
- [ ] generateStaticParams no blog index
- [ ] generateStaticParams nos posts
- [ ] generateMetadata dinâmico
- [ ] Revalidação configurada

### Loading States
- [ ] PostSkeleton component
- [ ] PostListSkeleton component
- [ ] Implementar nos lugares certos
- [ ] Animação suave

### Scroll Enhancement
- [ ] ScrollToTop component
- [ ] Aparece após 300px
- [ ] Animação smooth
- [ ] Posição fixa correta

### Image Optimization
- [ ] LazyImage component
- [ ] Blur placeholders
- [ ] Sizes responsivos
- [ ] Priority nas imagens above-fold

### Performance Metrics
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

## 🎯 Critérios de Sucesso

1. **Performance**:
   - Lighthouse > 90 ✓
   - TTI < 3s ✓
   - Zero layout shifts ✓
   - Bundle size otimizado ✓

2. **UX**:
   - Loading states suaves ✓
   - Scroll to top funcional ✓
   - Imagens carregam progressivamente ✓
   - Navegação instantânea ✓

3. **SEO**:
   - Todas páginas estáticas ✓
   - Meta tags dinâmicas ✓
   - Sitemap gerado ✓
   - Robots.txt correto ✓

## ⏱️ Estimativa
2-3 horas

## 🚫 Erros Comuns a Evitar

1. **Over-engineering**: Manter simples e eficiente
2. **Animações pesadas**: Usar CSS nativo
3. **Cache excessivo**: Balance freshness/performance
4. **Loading everywhere**: Apenas onde necessário
5. **Client fetching**: Sempre preferir SSG

## 💡 Checklist Final de Performance

### Antes do Deploy
- [ ] Todas imagens otimizadas
- [ ] Fonts com display swap
- [ ] JavaScript minimizado
- [ ] CSS purged (unused removed)
- [ ] Gzip/Brotli habilitado
- [ ] CDN configurado

### Monitoramento
- [ ] Web Vitals tracking
- [ ] Error boundaries
- [ ] Analytics básico
- [ ] Performance budgets

## 📊 Métricas Alvo

```
Lighthouse Scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Core Web Vitals:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
```

---

**Conclusão**: Com esta feature, o blog estará totalmente otimizado e pronto para produção, oferecendo uma experiência rápida e fluida aos usuários.