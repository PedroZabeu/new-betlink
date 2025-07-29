# Feature 2.8 - Sistema de Busca no Blog (Planning)

## 📋 Resumo da Feature
Implementar busca em tempo real no conteúdo do blog, permitindo pesquisar em títulos, excerpts, conteúdo, tags e categorias.

## 🎯 Objetivo
Facilitar a descoberta de conteúdo específico através de busca instantânea e eficiente, melhorando significativamente a experiência do usuário.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Busca em múltiplos campos (título, excerpt, conteúdo, tags)
- Resultados em tempo real com debounce
- Highlight dos termos encontrados
- Mensagem clara quando sem resultados
- Botão para limpar busca
- Integração com filtros existentes

### NÃO PODE:
- Criar design visual novo
- Usar biblioteca de busca externa
- Fazer requisições ao servidor
- Modificar estrutura da página
- Adicionar loading spinners complexos

## 📁 Estrutura de Arquivos

### Arquivos a criar:
```typescript
/components/blog/
├── search-bar.tsx      // NOVO - Componente de busca
└── search-highlight.tsx // NOVO - Destacar termos

/lib/blog/
└── search.ts          // NOVO - Lógica de busca

/hooks/
└── use-debounce.ts    // NOVO - Hook para debounce
```

## 🔧 Implementação Técnica

### Componente SearchBar
```typescript
// /components/blog/search-bar.tsx
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar posts...",
  resultCount 
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

### Hook useDebounce
```typescript
// /hooks/use-debounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Algoritmo de Busca
```typescript
// /lib/blog/search.ts
export function searchPosts(posts: Post[], query: string): Post[] {
  if (!query.trim()) return posts;
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return posts.filter(post => {
    const searchableText = [
      post.title,
      post.excerpt,
      post.content,
      post.category,
      ...post.tags
    ].join(' ').toLowerCase();
    
    // Todos os termos devem estar presentes
    return searchTerms.every(term => 
      searchableText.includes(term)
    );
  }).sort((a, b) => {
    // Ordenar por relevância (título > excerpt > conteúdo)
    const scoreA = calculateRelevance(a, searchTerms);
    const scoreB = calculateRelevance(b, searchTerms);
    return scoreB - scoreA;
  });
}

function calculateRelevance(post: Post, terms: string[]): number {
  let score = 0;
  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  
  terms.forEach(term => {
    if (title.includes(term)) score += 10;
    if (excerpt.includes(term)) score += 5;
    if (post.tags.some(tag => tag.toLowerCase().includes(term))) score += 3;
  });
  
  return score;
}
```

### Highlight de Resultados
```typescript
// /components/blog/search-highlight.tsx
export function highlightText(text: string, query: string): JSX.Element {
  if (!query.trim()) return <>{text}</>;
  
  const terms = query.split(' ').filter(Boolean);
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
```

## 📐 Design e UX

### Posicionamento
```
[Search Bar - largura total]
🔍 Buscar posts...                    [X]

Mostrando 5 resultados para "roi"
```

### Estados
1. **Vazio**: Placeholder "Buscar posts..."
2. **Digitando**: Ícone de busca + texto
3. **Com resultados**: Mostrar contador
4. **Sem resultados**: "Nenhum post encontrado para 'termo'"
5. **Limpando**: Botão X visível quando tem texto

### Integração com Filtros
- Busca funciona em conjunto com filtros
- Ordem de aplicação: Filtros → Busca
- Manter ambos estados na URL

## ✅ Checklist de Implementação

### Componentes
- [ ] Criar SearchBar component
- [ ] Implementar useDebounce hook
- [ ] Criar função highlightText
- [ ] Integrar com página do blog

### Lógica de Busca
- [ ] Implementar searchPosts function
- [ ] Adicionar scoring de relevância
- [ ] Busca case-insensitive
- [ ] Suportar múltiplos termos

### UX e Performance
- [ ] Debounce de 300ms
- [ ] Mostrar contador de resultados
- [ ] Clear button funcional
- [ ] Estado "sem resultados"

### Integração
- [ ] Combinar com filtros existentes
- [ ] Preservar busca na URL
- [ ] Highlight nos resultados
- [ ] Manter performance < 200ms

## 🎯 Critérios de Sucesso

1. **Funcionalidade**:
   - Busca em todos os campos ✓
   - Resultados instantâneos ✓
   - Ordenação por relevância ✓
   - Clear funcional ✓

2. **Performance**:
   - Resposta < 200ms ✓
   - Debounce funcionando ✓
   - Sem lag na digitação ✓

3. **UX**:
   - Feedback claro ✓
   - Estados bem definidos ✓
   - Mobile friendly ✓
   - Integrado com filtros ✓

## ⏱️ Estimativa
3-4 horas

## 🚫 Erros Comuns a Evitar

1. **Busca muito restrita**: Incluir todos os campos
2. **Sem debounce**: Causar lag na digitação
3. **Case sensitive**: Sempre lowercase
4. **Ordenação ruim**: Priorizar título/excerpt
5. **Highlight quebrado**: Testar com regex especiais

## 💡 Melhorias Futuras

(Não implementar agora, apenas ideias)
- Busca fuzzy (typo tolerance)
- Sugestões enquanto digita
- Histórico de buscas
- Busca por sinônimos
- Analytics de termos mais buscados

## 🔍 Exemplos de Uso

```
Busca: "roi"
→ Retorna posts com "roi", "ROI", "Return on Investment"

Busca: "ev positivo"
→ Retorna posts que contenham AMBOS os termos

Busca: "gestão banca"
→ Retorna posts sobre gestão de banca

Busca: "askjdhaksjdh"
→ "Nenhum post encontrado"
```

---

**Próximo passo**: Implementar Feature 2.9 (Página Individual Aprimorada) para melhorar a experiência de leitura.