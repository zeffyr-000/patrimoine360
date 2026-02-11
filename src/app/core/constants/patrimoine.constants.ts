export const PATRIMOINE_CONFIG = {
  currency: {
    locale: 'fr-FR',
    currency: 'EUR',
    display: 'symbol' as const,
  },

  date: {
    locale: 'fr-FR',
    format: 'dd MMMM yyyy',
  },

  ui: {
    breakpoints: {
      desktop: 1280,
      large: 1600,
    },

    // Durations in ms
    animations: {
      fast: 200,
      normal: 300,
      slow: 400,
    },
  },
} as const;
