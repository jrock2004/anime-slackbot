// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/.netlify/**',
        '**/*.d.ts',
        'commitlint.config.js',
        'eslint.config.mjs',
        'vitest.config.ts',
        '**/AnimeModel.ts',
        '**/mocks/**',
        'vitest.setup.ts',
      ],
      provider: 'v8', // or 'v8' or 'instanbul'
      reporter: ['cobertura', 'text', 'json', 'html'],
    },
  },
});
