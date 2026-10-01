export type BookCategory = 'all' | 'fiction' | 'drama' | 'humor' | 'politics' | 'philosophy' | 'history' | 'adventure';

export interface GutendexAuthor {
  name: string;
}

export interface GutendexBook {
  id: number;
  title: string;
  authors: GutendexAuthor[];
  subjects: string[];
  formats: Record<string, string>;
  download_count: number;
}

export interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GutendexBook[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  subjects: string[];
  coverUrl?: string;
  downloadUrl?: string;
  previewUrl?: string;
}

export interface BooksState {
  books: Book[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

export const categoryLabels: Record<BookCategory, string> = {
  all: 'All',
  fiction: 'Fiction',
  drama: 'Drama',
  humor: 'Humor',
  politics: 'Politics',
  philosophy: 'Philosophy',
  history: 'History',
  adventure: 'Adventure',
};
