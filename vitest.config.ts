import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    // Exclude component tests with external templates (POC - focus on logic)
    exclude: [
      'src/app/app.spec.ts',
      'src/app/home/**/*.spec.ts',
      'src/app/features/**/*.spec.ts',
      'src/app/shared/**/*.spec.ts',
    ],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/testing/**',
        'src/app/**/*.model.ts', // Models have no logic
        'src/app/**/index.ts', // Barrel exports
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
});
