const palettes = {
  light: {
    background: '#F4F5F7',
    surface: '#FFFFFF',
    surfaceStrong: '#FFFFFF',
    surfaceAlt: '#ECF1FF',
    primary: '#5E56E7',
    primarySoft: '#E8EEFF',
    text: '#1D2433',
    mutedText: '#6B7280',
    subtitle: '#3A3D42',
    border: '#DDE2EA',
    cardBorder: 'rgba(80,119,225,0.12)',
    cardSurface: 'rgba(255,255,255,0.72)',
    input: '#EAECEF',
    success: '#2F9E44',
    error: '#D92D20',
    shadow: 'rgba(211, 209, 238, 0.5)',
  },
  dark: {
    background: '#171B22',
    surface: '#222833',
    surfaceStrong: '#2B3240',
    surfaceAlt: '#313C50',
    primary: '#91A9FF',
    primarySoft: '#303B57',
    text: '#F1F3F8',
    mutedText: '#B1B8C5',
    subtitle: '#D2D7E0',
    border: '#414A59',
    cardBorder: '#414A59',
    cardSurface: '#222833',
    input: '#2B3240',
    success: '#69C586',
    error: '#FF8179',
    shadow: 'rgba(0, 0, 0, 0.24)',
  },
} as const;

export const activePalette: keyof typeof palettes = 'light';

export const theme = {
  colors: palettes[activePalette],
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
  },
  typography: {
    heading: 48,
    heading2: 30,
    title: 18,
    genre: 20,
    body: 16,
    search: 16,
    book: 12,
    caption: 12,
  },
  fonts: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semibold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
  },
} as const;

export type Theme = typeof theme;
