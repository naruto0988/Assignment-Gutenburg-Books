import { BookCategory, BooksResponse } from '../models/types';

const BASE_URL = 'https://gutendex.careers.ignitesol.com/books';
const REQUEST_TIMEOUT_MS = 15_000;

interface FetchBooksParams {
  page?: number;
  search?: string;
  topic?: BookCategory;
  signal?: AbortSignal;
}

export const fetchBooks = async ({
  page = 1,
  search = '',
  topic = 'fiction',
  signal,
}: FetchBooksParams = {}): Promise<BooksResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    mime_type: 'image/',
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (topic && topic !== 'all') {
    params.set('topic', topic);
  }

  const requestController = new AbortController();
  const abortRequest = () => requestController.abort();
  const timeoutId = setTimeout(abortRequest, REQUEST_TIMEOUT_MS);
  if (signal?.aborted) {
    abortRequest();
  } else {
    signal?.addEventListener('abort', abortRequest, { once: true });
  }

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, { signal: requestController.signal });

    if (!response.ok) {
      throw new Error('Book request failed');
    }

    return (await response.json()) as BooksResponse;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
};
