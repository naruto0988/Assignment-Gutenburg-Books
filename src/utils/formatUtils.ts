import { Book, GutendexBook } from '../models/types';

export const getViewableBookUrl = (formats: Record<string, string> = {}): string | undefined => {
  const preferredFormats = ['text/html', 'application/pdf', 'text/plain', 'text/plain; charset=utf-8'];

  for (const formatKey of preferredFormats) {
    if (formats[formatKey] && !formats[formatKey].includes('.zip')) {
      return formats[formatKey];
    }
  }

  const fallback = ['application/xhtml+xml', 'application/x-mobipocket-ebook', 'text/html; charset=utf-8'];
  for (const key of fallback) {
    if (formats[key] && !formats[key].includes('.zip')) {
      return formats[key];
    }
  }

  return undefined;
};

export const getCoverUrl = (formats: Record<string, string> = {}): string | undefined => {
  const candidates = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  for (const key of candidates) {
    if (formats[key]) {
      return formats[key];
    }
  }

  return undefined;
};

export const formatAuthorList = (authors: { name: string }[] = []): string => {
  if (!authors || authors.length === 0) {
    return '';
  }

  return authors.map((author) => author.name).filter(Boolean).join(', ');
};

export const normalizeGutendexBook = (book: GutendexBook): Book | null => {
  if (!book || !book.title) {
    return null;
  }

  return {
    id: book.id,
    title: book.title,
    author: formatAuthorList(book.authors),
    subjects: book.subjects ?? [],
    coverUrl: getCoverUrl(book.formats),
    previewUrl: getViewableBookUrl(book.formats),
  };
};
