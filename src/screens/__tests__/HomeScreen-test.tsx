import { fireEvent, render } from '@testing-library/react-native';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { HomeScreen } from '../HomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: (...args: unknown[]) => mockNavigate(...args) }),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
}));

const mockNavigate = jest.fn();

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders the heading, subtitle, and category choices', async () => {
    const { getByText, getByRole } = await render(<HomeScreen />);

    expect(getByText('Gutenberg\nProject')).toBeTruthy();
    expect(getByText(/social cataloging website/i)).toBeTruthy();
    expect(getByRole('button', { name: 'Fiction' })).toBeTruthy();
    expect(getByRole('button', { name: 'Adventure' })).toBeTruthy();
  });

  test('opens the selected category', async () => {
    const { getByRole } = await render(<HomeScreen />);

    await fireEvent.press(getByRole('button', { name: 'Drama' }));

    expect(mockNavigate).toHaveBeenCalledWith('Books', { category: 'drama' });
  });
});