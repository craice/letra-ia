import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: process.env.BASE_PATH ?? '/',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
