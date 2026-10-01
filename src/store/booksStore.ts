import { create } from 'zustand';

import { fetchBooks as fetchGutendexBooks } from '../api/gutendexClient';
import { Book, BookCategory } from '../models/types';
import { normalizeGutendexBook } from '../utils/formatUtils';

let activeRequestController: AbortController | null = null;
let activeRequestId = 0;

interface BooksStoreState {
  books: Book[];
  selectedCategory: BookCategory;
  searchTerm: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  setSelectedCategory: (category: BookCategory) => void;
  setSearchTerm: (value: string) => void;
  loadBooks: (page?: number, replace?: boolean, categoryOverride?: BookCategory, searchOverride?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  cancelPending: () => void;
  reset: () => void;
}

export const useBooksStore = create<BooksStoreState>((set, get) => ({
  books: [],
  selectedCategory: 'fiction',
  searchTerm: '',
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  page: 1,

  setSelectedCategory: (category) => {
    set({
      selectedCategory: category,
      books: [],
      page: 1,
      error: null,
      hasMore: true,
      searchTerm: '',
    });
  },

  setSearchTerm: (value) => {
    set({ searchTerm: value.trim() });
  },

  loadBooks: async (page = 1, replace = true, categoryOverride, searchOverride) => {
    const currentCategory = categoryOverride ?? get().selectedCategory;
    const currentSearch = (searchOverride ?? get().searchTerm).trim();
    activeRequestController?.abort();
    const requestController = new AbortController();
    activeRequestController = requestController;
    const requestId = ++activeRequestId;

    set({
      isLoading: page === 1,
      isLoadingMore: page > 1,
      error: null,
      selectedCategory: currentCategory,
      searchTerm: currentSearch,
    });

    try {
      const response = await fetchGutendexBooks({
        page,
        search: currentSearch,
        topic: currentCategory,
        signal: requestController.signal,
      });

      if (requestId !== activeRequestId) {
        return;
      }

      const normalizedBooks = response.results
        .map(normalizeGutendexBook)
        .filter((book): book is Book => Boolean(book));

      set((state) => ({
        books: replace ? normalizedBooks : [...state.books, ...normalizedBooks],
        hasMore: Boolean(response.next),
        page,
      }));
    } catch {
      if (requestController.signal.aborted || requestId !== activeRequestId) {
        return;
      }

      set({ error: 'requestFailed' });
    } finally {
      if (requestId === activeRequestId) {
        activeRequestController = null;
        set({
          isLoading: false,
          isLoadingMore: false,
        });
      }
    }
  },

  loadMore: async () => {
    const { isLoading, isLoadingMore, hasMore, page, selectedCategory, searchTerm } = get();

    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }

    await get().loadBooks(page + 1, false, selectedCategory, searchTerm);
  },

  cancelPending: () => {
    activeRequestController?.abort();
    activeRequestController = null;
    activeRequestId += 1;
    set({ isLoading: false, isLoadingMore: false });
  },

  reset: () => {
    get().cancelPending();
    set({
      books: [],
      selectedCategory: 'fiction',
      searchTerm: '',
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: true,
      page: 1,
    });
  },
}));
