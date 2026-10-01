import { useCallback, useMemo, useState } from 'react';

import { fetchBooks } from '../api/gutendexClient';
import { Book, BookCategory, BooksState } from '../models/types';
import { normalizeGutendexBook } from '../utils/formatUtils';

export const useBooks = (query = '', topic: BookCategory = 'all') => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadBooks = useCallback(
    async (nextPage = 1, reset = true) => {
      try {
        if (nextPage === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        setError(null);

        const response = await fetchBooks({
          page: nextPage,
          search: query,
          topic,
        });

        const normalizedBooks = response.results
          .map(normalizeGutendexBook)
          .filter((book): book is Book => Boolean(book));

        setBooks((currentBooks) => (reset ? normalizedBooks : [...currentBooks, ...normalizedBooks]));
        setHasMore(Boolean(response.next));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [query, topic],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    void loadBooks(nextPage, false);
  }, [hasMore, isLoading, isLoadingMore, loadBooks, page]);

  const state: BooksState = useMemo(
    () => ({
      books,
      isLoading,
      isLoadingMore,
      error,
      hasMore,
    }),
    [books, error, hasMore, isLoading, isLoadingMore],
  );

  return { ...state, loadMore, refetch: () => void loadBooks(1, true) };
};
