import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    secondary: '#818cf8',
    tertiary: '#f43f5e',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#ef4444',
  },
  roundness: 12,
};
