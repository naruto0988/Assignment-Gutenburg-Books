# Gutenberg Explorer

A React Native Expo app that lets users browse Project Gutenberg books by category, search by title or author, and open a readable version of a selected title in the device browser.

## Project overview

This app includes two screens:

1. Home screen with category buttons
2. Book list screen with search, infinite scrolling, and direct-open book links

The implementation follows the Gutendex API contract and includes loading, empty, and error states, while keeping the selected category and search query in sync.

## Setup and run instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo app:
   ```bash
   npx expo start
   ```
3. Run on an emulator or device using the Expo Go app or a native simulator.
4. Run the automated checks:
   ```bash
   npm test
   npx tsc --noEmit
   npx expo lint
   ```

## Architecture overview

- `src/api/gutendexClient.ts` handles API requests and query building
- `src/store/booksStore.ts` holds app state with Zustand
- `src/screens/HomeScreen.tsx` contains the category selection flow
- `src/screens/BooksScreen.tsx` handles the list view, search, and infinite scroll
- `src/components` contains reusable UI elements for cards, states, and search
- `src/utils/formatUtils.ts` resolves the preferred viewable book link and filters out unsupported zip artifacts
- `src/theme/index.ts` centralizes app palettes, spacing, and typography; change `activePalette` to select light or dark colors
- `src/i18n/index.ts` contains English and Spanish UI strings; change `defaultLocale` to select the app language
- `src/utils/layoutUtils.ts` sizes the book grid to the available screen width in portrait and landscape

## Third-party libraries used

### App and runtime

- `expo` (~57.0.26): Expo SDK and app tooling
- `react` (19.2.3): UI component runtime
- `react-native` (0.86.3): native mobile UI framework
- `@expo/vector-icons` (^15.0.2): Material vector icons used for category, back, and forward actions
- `@expo-google-fonts/montserrat` (^0.4.2): Montserrat font assets
- `expo-font` (~57.0.4): load custom fonts
- `@react-navigation/native` (^7.5.0): navigation container and navigation primitives
- `@react-navigation/native-stack` (^7.20.0): native stack navigation
- `zustand` (^5.0.15): shared book and request state

### Development and testing

- `typescript` (~6.0.3) and `@types/react` (~19.2.2): TypeScript and React type definitions
- `eslint` (^9.0.0) and `eslint-config-expo` (~57.0.2): linting
- `jest` (~29.7.0), `jest-expo` (~57.0.5), and `@types/jest` (^29.5.14): test runner, Expo test preset, and test types
- `@testing-library/react-native` (^14.0.1): HomeScreen and BooksScreen component tests

## AI tools used

- GitHub Copilot for implementation support and code scaffolding
- Expo SDK reference docs for API compatibility checks

## Assumptions and known limitations

- The app is built for the provided Gutendex assignment requirements and uses the hosted endpoint at `https://gutendex.careers.ignitesol.com/books`.
- Only books with image MIME types are requested, matching the requirement to surface books with covers.
- The supplied design references do not include reusable icon asset files, so category, back, and forward icons use Material vector icons from `@expo/vector-icons`, chosen to approximate the reference icons.
- The app prefers HTML, then PDF, then TXT links when opening a book. If none are available, it shows the required alert: “No viewable version available”.
- The project includes the app architecture and functionality required by the assignment; a full video asset for the final submission should be recorded separately and added to the repo before final delivery.

## Demo video

Add a short demo video showing:

- category selection on the home screen
- book list loading and infinite scroll
- search term filtering
- book opening behavior
- portrait and landscape orientations

Suggested file location: `docs/demo.mp4`

## Notes

The app supports portrait and landscape orientations and recalculates the book grid to fit the available width.
