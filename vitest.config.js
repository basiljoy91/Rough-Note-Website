import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'https://roughnote.test/'
      }
    },
    include: [
      'tests/unit/**/*.test.{js,ts,tsx}',
      'tests/component/**/*.test.{js,ts,tsx}'
    ],
    setupFiles: ['./tests/setup.ts'],
    restoreMocks: true
  }
});
