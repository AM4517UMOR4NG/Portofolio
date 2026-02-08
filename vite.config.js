import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        repos: resolve(__dirname, 'repos.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact.html'),
        settings: resolve(__dirname, 'settings.html'),
        notes: resolve(__dirname, 'notes.html'),
        games: resolve(__dirname, 'games.html'),
      },
    },
  },
});
