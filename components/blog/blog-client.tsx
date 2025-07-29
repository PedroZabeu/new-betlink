// Feature 2.7: Sistema de Tags e Categorias - Blog Client Component
// @feature: Blog Tags and Categories
// @created: Feature 2.7

'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, X, Search } from 'lucide-react';
import Image from 'next/image';
import { logger } from '@/lib/utils/logger';
import { 
  BlogPost, 
  FilterState, 
  getCategoryInfo,
  getAllCategories
} from '@/lib/blog/types';
import { 
  extractUniqueTagsFromPosts,
  combineFiltersLogic,
  clearAllFilters,
  hasActiveFilters
} from '@/lib/blog/filters';
import { CategoryBadge } from './category-badge';
import { TagChip } from './tag-chip';

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

  // Process posts with filters
  const { posts: filteredPosts, counts } = useMemo(() => {
    const result = combineFiltersLogic(posts, filters);
    
    logger.debug(`${FEATURE_NAME} Posts filtered`, { 
      originalCount: posts.length,
      filteredCount: result.posts.length
    });

    return result;
  }, [posts, filters]);

  // Extract available tags
  const availableTags = useMemo(() => {
    return extractUniqueTagsFromPosts(posts);
  }, [posts]);

  // Get categories with counts
  const categoriesWithCounts = useMemo(() => {
    return getAllCategories().map(categoryInfo => ({
      ...categoryInfo,
      count: counts.byCategory[categoryInfo.id] || 0,
      isActive: filters.categories.includes(categoryInfo.id)
    }));
  }, [counts.byCategory, filters.categories]);

  // Get tags with counts
  const tagsWithCounts = useMemo(() => {
    return availableTags
      .map(tag => ({
        tag,
        count: counts.byTag[tag] || 0,
        isActive: filters.tags.includes(tag)
      }))
      .sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return b.count - a.count;
      });
  }, [availableTags, counts.byTag, filters.tags]);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId as any)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId as any];

    setFilters({
      ...filters,
      categories: newCategories
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];

    setFilters({
      ...filters,
      tags: newTags
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setFilters({
      ...filters,
      searchQuery: value.trim() || undefined
    });
  };

  const handleClearFilters = () => {
    setFilters(clearAllFilters());
    setSearchInput('');
  };

  const activeFiltersCount = filters.categories.length + filters.tags.length + 
                            (filters.searchQuery ? 1 : 0);
  const hasFilters = hasActiveFilters(filters);

  // Featured post (first filtered post or first overall)
  const featuredPost = filteredPosts[0] || posts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog BetLink
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Dicas, estratégias e análises para melhorar suas apostas esportivas. 
              Conteúdo criado por especialistas para apostadores de todos os níveis.
            </p>
            
            {/* Posts count and filter summary */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</span>
              </div>
              {hasFilters && (
                <div className="text-primary">
                  {activeFiltersCount} filtro(s) ativo(s)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              data-testid="search-input"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearchChange('')}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Categorias</h4>
            <div className="flex flex-wrap gap-2" data-testid="category-filters">
              {categoriesWithCounts.map((category) => (
                <CategoryBadge
                  key={category.id}
                  label={category.label}
                  color={category.color}
                  count={category.count}
                  isActive={category.isActive}
                  onClick={() => handleCategoryToggle(category.id)}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          {tagsWithCounts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Tags ({availableTags.length})
              </h4>
              <div className="flex flex-wrap gap-1" data-testid="tag-filters">
                {tagsWithCounts.slice(0, 20).map(({ tag, count, isActive }) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    count={count}
                    isActive={isActive}
                    onClick={() => handleTagToggle(tag)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasFilters && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                data-testid="clear-all-filters"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* No results message */}
        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não encontramos posts que correspondam aos filtros selecionados.
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Limpar filtros e ver todos os posts
              </Button>
            </div>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Card className="overflow-hidden" data-testid="featured-post">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={featuredPost.coverImage || '/api/placeholder/800/400'}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className={`bg-${getCategoryInfo(featuredPost.category).color}-100 text-${getCategoryInfo(featuredPost.category).color}-800 border-0`}
                      data-testid={`category-${featuredPost.category}`}
                    >
                      {getCategoryInfo(featuredPost.category).label}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">Destaque</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
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
              </div>
            </Card>
          </div>
        )}

        {/* Blog Grid */}
        {remainingPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="posts-grid">
            {remainingPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category);
              return (
                <Card 
                  key={post.slug} 
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                  data-testid={`post-${post.slug}`}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={post.coverImage || '/api/placeholder/400/200'}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border-0`}
                          data-testid={`category-${post.category}`}
                        >
                          {categoryInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-3">
                      {post.excerpt}
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
              );
            })}
          </div>
        )}

        {/* Results summary */}
        {filteredPosts.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Mostrando {filteredPosts.length} de {posts.length} posts
            {hasFilters && (
              <Button
                variant="link"
                onClick={handleClearFilters}
                className="ml-2 p-0 h-auto text-sm"
              >
                Ver todos
              </Button>
            )}
          </div>
        )}
      </section>
    </>
  );
}