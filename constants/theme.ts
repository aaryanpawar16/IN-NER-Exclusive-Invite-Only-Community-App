import { Platform } from 'react-native';

export const theme = {
  colors: {
    cream:       '#F5F0E8',
    warmWhite:   '#FAF8F4',
    dark:        '#1A1714',
    charcoal:    '#2D2926',
    brown:       '#4A3F35',
    taupe:       '#8B7D72',
    gold:        '#C9A96E',
    goldLight:   '#E8D5A8',
    goldDark:    '#9A7A45',
    rust:        '#B85C38',
    sage:        '#7A8C6E',
    border:       'rgba(74,63,53,0.15)',
    borderStrong: 'rgba(74,63,53,0.30)',
    adminBg:          '#1A1714',
    adminSurface:     'rgba(255,255,255,0.04)',
    adminBorder:      'rgba(255,255,255,0.08)',
    adminBorderHover: 'rgba(255,255,255,0.14)',
    adminText:        '#FAF8F4',
    adminTextMuted:   'rgba(255,255,255,0.35)',
    adminTextFaint:   'rgba(255,255,255,0.18)',
  },

  fonts: {
    serif: Platform.select({
      ios:     'Georgia',
      android: 'serif',
      default: 'Georgia',
    }),
    mono: Platform.select({
      ios:     'Courier New',
      android: 'monospace',
      default: 'Courier New',
    }),
  },

  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  radius: {
    none: 0,
    sm:   2,
    md:   4,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor:   '#1A1714',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius:  6,
      elevation:     2,
    },
    md: {
      shadowColor:   '#1A1714',
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius:  12,
      elevation:     4,
    },
    lg: {
      shadowColor:   '#1A1714',
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius:  24,
      elevation:     8,
    },
  },
} as const;

export type Theme  = typeof theme;
export type Colors = typeof theme.colors;