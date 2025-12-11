// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://evelyncosmetics.com', // Cambiar por tu dominio real
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});