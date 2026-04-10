import { CategorySlug, PostForm } from '@/types/blog';
import { BookOpen, Code, Coffee } from 'lucide-react';

export const PAGE_LIMIT = 10;

export const CATEGORY_MAP = {
  dev: {
    icon: <Code size={20} />,
    textColor: 'text-accent-primary',
  },
  reading: {
    icon: <BookOpen size={20} />,
    textColor: 'text-[var(--palette-4)]',
  },
  life: {
    icon: <Coffee size={20} />,
    textColor: 'text-orange-500',
  },
} as const;

export const CATEGORY_KEYS: CategorySlug[] = ['dev', 'reading', 'life'];

export const CATEGORY_FILTER = {
  all: 'all',
  public: 'public',
} as const;

export const POST_FILTER = {
  public: 'public',
  all: 'all',
} as const;

export const INITIAL_POST: Omit<PostForm, 'id'> = {
  title: '',
  content: '',
  summary: '',
  categorySlug: 'dev',
  tags: [],
  thumbnailUrl: null,
  isPrivate: false,
  isPublished: false,
};

export const NEXT_CACHE_KEY = {
  posts: 'public-posts',
  post: (id: string) => `post-${id}`,
  categories: 'categories',
} as const;

export const NEXT_CACHE_TAG = {
  posts: 'posts',
  categories: 'categories',
  post: (id: string) => `post-${id}`,
  categoryPosts: (slug: string) => `posts-${slug}`,
} as const;
