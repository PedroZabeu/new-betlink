// Feature 2.7: Sistema de Tags e Categorias - Blog Client Component
// @feature: Blog Tags and Categories
// @created: Feature 2.7
// @enhanced: Feature 2.10 - Loading Skeletons

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { logger } from '@/lib/utils/logger';
import { 
  BlogPost, 
  FilterState, 
  getCategoryInfo
} from '@/lib/blog/types';
import { 
  combineFiltersLogic,
  clearAllFilters
} from '@/lib/blog/filters';
import { SearchBar } from './search-bar';
import { HighlightTitle, HighlightExcerpt } from './search-highlight';
import { PostListSkeleton } from './post-list-skeleton';
import { useSearchDebounce } from '@/hooks/use-debounce';

const FEATURE_NAME = '[Feature: BlogClient]';

interface BlogClientProps {
  posts: BlogPost[];
}

// Format date to Brazilian format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Calculate read time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

export function BlogClient({ posts }: BlogClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    searchQuery: undefined
  });

  const [searchInput, setSearchInput] = useState('');
  
  // Feature 2.10: Loading state for smooth UX during filtering
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Debounce da busca para otimizar performance
  const debouncedSearchQuery = useSearchDebounce(searchInput, 300);

  // Atualizar filtros quando a busca debounced mudar
  const currentFilters = useMemo(() => ({
    ...filters,
    searchQuery: debouncedSearchQuery.trim() || undefined
  }), [filters, debouncedSearchQuery]);

  // Feature 2.10: Show skeleton briefly when filters change for smooth UX
  useEffect(() => {
    if (debouncedSearchQuery || filters.categories.length > 0 || filters.tags.length > 0) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 150); // Very brief skeleton
      return () => clearTimeout(timer);
    }
    setIsFiltering(false);
  }, [debouncedSearchQuery, filters.categories.length, filters.tags.length]);

  // Process posts with filters
  const { posts: filteredPosts } = useMemo(() => {
    const result = combineFiltersLogic(posts, currentFilters);
    
    logger.debug(`${FEATURE_NAME} Posts filtered with search`, { 
      originalCount: posts.length,
      filteredCount: result.posts.length,
      searchQuery: currentFilters.searchQuery,
      hasCategories: currentFilters.categories.length > 0,
      hasTags: currentFilters.tags.length > 0
    });

    return result;
  }, [posts, currentFilters]);


  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleClearFilters = () => {
    setFilters(clearAllFilters());
    setSearchInput('');
  };

  const isSearching = searchInput !== debouncedSearchQuery;

  // Featured post (first filtered post or first overall)
  const featuredPost = filteredPosts[0] || posts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <>
      {/* New Blog Header Section */}
      <section className="bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
            <div className="max-w-md">
              <SearchBar
                value={searchInput}
                onChange={handleSearchChange}
                resultCount={filteredPosts.length}
                isSearching={isSearching}
                placeholder="Buscar posts..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">

        {/* No results message */}
        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não encontramos posts que correspondam à sua busca.
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Limpar busca e ver todos os posts
              </Button>
            </div>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300" data-testid="featured-post">
                <div className="p-6 md:p-8">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">Destaque</Badge>
                    <Badge 
                      className={`bg-${getCategoryInfo(featuredPost.category).color}-100 text-${getCategoryInfo(featuredPost.category).color}-800 border-0 ml-2`}
                      data-testid={`category-${featuredPost.category}`}
                    >
                      {getCategoryInfo(featuredPost.category).label}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    <HighlightTitle 
                      text={featuredPost.title} 
                      query={currentFilters.searchQuery || ''} 
                    />
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    <HighlightExcerpt 
                      text={featuredPost.excerpt} 
                      query={currentFilters.searchQuery || ''} 
                    />
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredPost.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{calculateReadTime(featuredPost.content)} de leitura</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        {/* Feature 2.10: Show skeleton during filtering for smooth UX */}
        {isFiltering ? (
          <PostListSkeleton count={6} />
        ) : remainingPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="posts-grid">
            {remainingPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category);
              
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <Card 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
                    data-testid={`post-${post.slug}`}
                  >
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border-0`}
                          data-testid={`category-${post.category}`}
                        >
                          {categoryInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <HighlightTitle 
                          text={post.title} 
                          query={currentFilters.searchQuery || ''} 
                        />
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-3">
                        <HighlightExcerpt 
                          text={post.excerpt} 
                          query={currentFilters.searchQuery || ''} 
                        />
                      </p>
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge 
                              key={tag}
                              variant="secondary" 
                              className="text-xs"
                              data-testid={`post-tag-${tag}`}
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{calculateReadTime(post.content)}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Results summary */}
        {filteredPosts.length > 0 && currentFilters.searchQuery && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Mostrando {filteredPosts.length} de {posts.length} posts para &quot;{currentFilters.searchQuery}&quot;
            <Button
              variant="link"
              onClick={handleClearFilters}
              className="ml-2 p-0 h-auto text-sm"
            >
              Ver todos
            </Button>
          </div>
        )}
        </div>
      </section>
    </>
  );
}