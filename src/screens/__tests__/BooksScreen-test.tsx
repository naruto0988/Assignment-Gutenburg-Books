import { fireEvent, render } from '@testing-library/react-native';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { BooksScreen } from '../BooksScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: () => mockGoBack() }),
  useRoute: () => ({ params: { category: 'fiction' } }),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
}));

jest.mock('../../store/booksStore', () => ({
  useBooksStore: () => mockStoreState,
}));

const mockGoBack = jest.fn();
const mockLoadBooks = jest.fn(() => Promise.resolve());
const mockLoadMore = jest.fn(() => Promise.resolve());
const mockCancelPending = jest.fn();
const mockSetSelectedCategory = jest.fn();
const mockSetSearchTerm = jest.fn();

const baseStoreState = {
  books: [{
    id: 1,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    subjects: [],
    previewUrl: 'https://www.gutenberg.org/ebooks/1342',
  }],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  loadBooks: mockLoadBooks,
  loadMore: mockLoadMore,
  cancelPending: mockCancelPending,
  setSelectedCategory: mockSetSelectedCategory,
  setSearchTerm: mockSetSearchTerm,
};

type MockStoreState = Omit<typeof baseStoreState, 'error'> & { error: string | null };

let mockStoreState: MockStoreState;

describe('BooksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = baseStoreState;
  });

  test('renders the category heading, search field, and books', async () => {
    const { getByText, getByPlaceholderText } = await render(<BooksScreen />);

    expect(getByText('Fiction')).toBeTruthy();
    expect(getByPlaceholderText('Search books')).toBeTruthy();
    expect(getByText('Pride and Prejudice')).toBeTruthy();
    expect(getByText('Jane Austen')).toBeTruthy();
  });

  test('returns to the previous screen from the back button', async () => {
    const { getByRole } = await render(<BooksScreen />);

    await fireEvent.press(getByRole('button', { name: 'Go back' }));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  test('shows a retry action after an initial load error', async () => {
    mockStoreState = {
      ...baseStoreState,
      books: [],
      error: 'requestFailed',
    };

    const { getByRole } = await render(<BooksScreen />);
    await fireEvent.press(getByRole('button', { name: 'Retry' }));

    expect(mockLoadBooks).toHaveBeenCalledWith(1, true, 'fiction', '');
  });
});