// Configuration constants for patrimoine application
// Business rules and formatting configuration

export const PATRIMOINE_CONFIG = {
  // Currency formatting
  currency: {
    locale: 'fr-FR',
    currency: 'EUR',
    display: 'symbol' as const,
  },

  // Date formatting
  date: {
    locale: 'fr-FR',
    format: 'dd MMMM yyyy',
  },

  // UI Configuration
  ui: {
    // Grid breakpoints
    breakpoints: {
      desktop: 1280,
      large: 1600,
    },

    // Animation durations (ms)
    animations: {
      fast: 200,
      normal: 300,
      slow: 400,
    },
  },
} as const;
