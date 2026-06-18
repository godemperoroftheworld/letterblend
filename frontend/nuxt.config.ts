import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  compatibilityDate: '2026-06-17',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image', '@vueuse/nuxt', '@tsparticles/nuxt4'],
  srcDir: 'src',
  app: {
    pageTransition: {
      name: 'page',
      mode: 'default',
    },
  },
  runtimeConfig: {
    bffUrl: '',
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
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: `${process.env.NUXT_BFF_URL}/api/**` },
    },
  },
  experimental: {
    cookieStore: true,
  },
});
