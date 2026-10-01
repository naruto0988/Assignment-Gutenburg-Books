import { BookCategory } from '../models/types';

export const translations = {
  en: {
    homeTitle: 'Gutenberg\nProject',
    homeSubtitle: 'A social cataloging website that allows you to freely search its database of books, annotations, and reviews.',
    searchPlaceholder: 'Search books',
    errorTitle: 'Something went wrong',
    requestFailed: 'Unable to load books right now. Please try again.',
    emptyTitle: 'No books found',
    emptyMessage: 'Try another keyword for this category.',
    retry: 'Retry',
    loading: 'Loading books...',
    loadingMore: 'Loading...',
    noMore: 'No more books',
    scrollMore: 'Scroll for more',
    noViewableVersion: 'No viewable version available',
    unknownAuthor: 'Unknown author',
    categories: {
      all: 'All',
      fiction: 'Fiction',
      drama: 'Drama',
      humor: 'Humor',
      politics: 'Politics',
      philosophy: 'Philosophy',
      history: 'History',
      adventure: 'Adventure',
    },
  },
  es: {
    homeTitle: 'Proyecto\nGutenberg',
    homeSubtitle: 'Un catálogo social que permite buscar libremente libros, anotaciones y reseñas.',
    searchPlaceholder: 'Buscar libros',
    errorTitle: 'Algo salió mal',
    requestFailed: 'No se pudieron cargar los libros. Inténtalo de nuevo.',
    emptyTitle: 'No se encontraron libros',
    emptyMessage: 'Prueba otra palabra clave para esta categoría.',
    retry: 'Reintentar',
    loading: 'Cargando libros...',
    loadingMore: 'Cargando...',
    noMore: 'No hay más libros',
    scrollMore: 'Desplázate para ver más',
    noViewableVersion: 'No hay una versión disponible para leer',
    unknownAuthor: 'Autor desconocido',
    categories: {
      all: 'Todos',
      fiction: 'Ficción',
      drama: 'Drama',
      humor: 'Humor',
      politics: 'Política',
      philosophy: 'Filosofía',
      history: 'Historia',
      adventure: 'Aventura',
    },
  },
} as const;

export type Locale = keyof typeof translations;

export const defaultLocale: Locale = 'en';

export type TranslationKey = Exclude<keyof typeof translations.en, 'categories'>;

export const getText = (key: TranslationKey, locale: Locale = defaultLocale): string => translations[locale][key];

export const getCategoryLabel = (category: BookCategory, locale: Locale = defaultLocale): string => {
  return translations[locale].categories[category];
};
