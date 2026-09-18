import { defineAppConfig } from 'nuxt/app';

export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: 'bg-content shadow-paper/50 inset-shadow-paper/50 border-dark/50 overflow-x-hidden rounded-3xl border-2 inset-shadow-xs shadow-xs'
      }
    }
  }
})