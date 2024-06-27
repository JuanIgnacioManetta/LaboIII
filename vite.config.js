import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida
  },
  server: {
    historyApiFallback: true, // Añade esta línea para manejar las rutas del cliente
  },
});
