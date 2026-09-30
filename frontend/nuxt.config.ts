import tailwindcss from '@tailwindcss/vite';
import vueDevTools from 'vite-plugin-vue-devtools';
export default defineNuxtConfig({
  compatibilityDate: '2026-06-17',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@tsparticles/nuxt4',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
  ],
  srcDir: 'src',
  googleFonts: {
    families: {
      Montserrat: [400, 500, 600, 700, 800],
      'IBM Plex Mono': [300, 400, 500, 600],
      Geist: [100, 200, 300, 400, 500],
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
    plugins: [tailwindcss(), vueDevTools()],
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: `${process.env.NUXT_BFF_URL}/api/**` },
    },
  },
  routeRules: {
    '/room/**': { ssr: false },
  },
});
