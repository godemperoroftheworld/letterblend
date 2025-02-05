import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image', '@vueuse/nuxt'],
  srcDir: 'src',
  vite: {
    plugins: [tailwindcss()],
  },
});
