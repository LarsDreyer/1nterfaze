import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // If you publish to a sub-path, set base accordingly.
  base: '/',
});
