import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image-edge', '@vueuse/nuxt'],
  srcDir: 'src',
  runtimeConfig: {
    public: {
      url: process.env.URL,
    },
  },
  image: {
    providers: {
      raw: {
        name: 'raw',
        provider: '~/providers/raw.ts',
      },
    },
  },
  vite: {
    plugins: [tailwindcss(), svgLoader(), nodePolyfills()],
    server: {
      proxy: {
        '/api': {
          target: process.env.BFF_URL,
          changeOrigin: true,
        },
      },
    },
  },
  nitro: {
    routeRules: {
      'api/**': { proxy: `${process.env.BFF_URL}/**` },
    },
  },
});
