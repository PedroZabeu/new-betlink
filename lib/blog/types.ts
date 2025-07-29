// Feature 2.7: Sistema de Tags e Categorias - Types e Interfaces
// @feature: Blog Tags and Categories
// @created: Feature 2.7

/**
 * Categorias disponíveis para posts do blog
 */
export enum Category {
  EDUCACIONAL = 'educacional',
  ESTRATEGIAS = 'estrategias', 
  GESTAO_BANCA = 'gestao-banca',
  FERRAMENTAS = 'ferramentas'
}

/**
 * Informações de metadata para cada categoria
 */
export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  icon: string; // Lucide icon name
}

/**
 * Constante com configuração de todas as categorias
 */
export const CATEGORIES: Record<Category, CategoryInfo> = {
  [Category.EDUCACIONAL]: {
    id: Category.EDUCACIONAL,
    label: 'Educacional',
    description: 'Conteúdo para iniciantes e fundamentos',
    color: 'blue',
    icon: 'BookOpen'
  },
  [Category.ESTRATEGIAS]: {
    id: Category.ESTRATEGIAS,
    label: 'Estratégias',
    description: 'Táticas avançadas e metodologias',
    color: 'green', 
    icon: 'Target'
  },
  [Category.GESTAO_BANCA]: {
    id: Category.GESTAO_BANCA,
    label: 'Gestão de Banca',
    description: 'Gerenciamento de riscos e capital',
    color: 'yellow',
    icon: 'Wallet'
  },
  [Category.FERRAMENTAS]: {
    id: Category.FERRAMENTAS,
    label: 'Ferramentas',
    description: 'Plataformas, apps e recursos',
    color: 'purple',
    icon: 'Settings'
  }
};

/**
 * Estado dos filtros aplicados
 */
export interface FilterState {
  categories: Category[];
  tags: string[];
  searchQuery?: string;
}

/**
 * Contadores de posts por filtro
 */
export interface PostCounts {
  total: number;
  byCategory: Record<Category, number>;
  byTag: Record<string, number>;
}

/**
 * Post com campos de categoria e tags tipados
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    picture?: string;
  };
  coverImage?: string;
  ogImage?: {
    url: string;
  };
  category: Category;
  tags: string[];
  content: string;
}

/**
 * Resultado de uma operação de filtragem
 */
export interface FilterResult {
  posts: BlogPost[];
  counts: PostCounts;
  appliedFilters: FilterState;
}

/**
 * Props para componentes de filtro
 */
export interface FilterComponentProps {
  posts: BlogPost[];
  currentFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
  disabled?: boolean;
}

/**
 * Utilitário para validar se uma string é uma categoria válida
 */
export function isValidCategory(value: string): value is Category {
  return Object.values(Category).includes(value as Category);
}

/**
 * Utilitário para obter informações de uma categoria
 */
export function getCategoryInfo(category: Category): CategoryInfo {
  return CATEGORIES[category];
}

/**
 * Utilitário para obter todas as categorias como array
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES);
}

/**
 * Utilitário para validar filtros
 */
export function validateFilters(filters: Partial<FilterState>): FilterState {
  return {
    categories: (filters.categories || []).filter(isValidCategory),
    tags: (filters.tags || []).filter(tag => typeof tag === 'string' && tag.length > 0),
    searchQuery: filters.searchQuery?.trim() || undefined
  };
}