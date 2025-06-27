import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: false }), tailwindcss()],
  server: {
    allowedHosts: ["https://revenger.dev"]
  },
  build: {
    rollupOptions: {
      output: {
        // --- ВОТ ГЛАВНОЕ ИЗМЕНЕНИЕ ---
        // Мы вручную указываем, как делить код на файлы (чанки)
        manualChunks(id) {
          // Все зависимости из node_modules группируем по названию
          if (id.includes('node_modules')) {
            // Создаем отдельный чанк для больших библиотек
            if (id.includes('@react-google-maps/api')) {
              return 'vendor_google-maps';
            }
            if (id.includes('framer-motion')) {
              return 'vendor_framer-motion';
            }
            // Все остальное из node_modules кладем в общий 'vendor'
            return 'vendor';
          }
        },
      },
    },
  },
})