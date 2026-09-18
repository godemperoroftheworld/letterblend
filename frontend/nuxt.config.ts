import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  compatibilityDate: '2026-06-17',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image', '@vueuse/nuxt', '@tsparticles/nuxt4', '@nuxt/ui'],
  srcDir: 'src',
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
  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: `${process.env.NUXT_BFF_URL}/api/**` },
    },
  },
});
