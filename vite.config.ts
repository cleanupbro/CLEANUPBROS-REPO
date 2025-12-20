import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProd = mode === 'production';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Production optimizations
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: isProd, // Remove console.logs in production
            drop_debugger: isProd,
          },
        },
        // Chunk splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks
              'vendor-react': ['react', 'react-dom'],
              'vendor-supabase': ['@supabase/supabase-js'],
              'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
              'vendor-ai': ['@google/genai'],
              'vendor-monitoring': ['@sentry/react'],
              // App chunks by feature
              'views': [
                './views/LandingView',
                './views/ResidentialQuoteView',
                './views/CommercialQuoteView',
                './views/AirbnbQuoteView',
              ],
              'admin': [
                './views/AdminLoginView',
                './views/AdminDashboardView',
              ],
              'info': [
                './views/AboutView',
                './views/ReviewsView',
                './views/ContactView',
                './views/ServicesView',
              ],
            },
            // Asset naming for better caching
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Source maps for production debugging (disable if not needed)
        sourcemap: !isProd,
      },
      // Preview server config (for testing production build)
      preview: {
        port: 3001,
        host: '0.0.0.0',
      },
    };
});
