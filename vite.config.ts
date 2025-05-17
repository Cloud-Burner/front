import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // или '0.0.0.0'
    allowedHosts: ['cloudburner-miem.ru'],
  },
})