import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image-edge', '@vueuse/nuxt', 'nuxt-particles'],
  srcDir: 'src',
  runtimeConfig: {
    public: {
      url: process.env.URL,
    },
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'default',
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
  particles: {
    mode: 'slim',
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
