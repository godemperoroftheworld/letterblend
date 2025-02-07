import type { NuxtApp } from 'nuxt/app';
import VueTippy, { directive } from 'vue-tippy';

export default defineNuxtPlugin((nuxt: NuxtApp) => {
  nuxt.vueApp.use(VueTippy, {
    directive: 'tippy',
    defaultProps: {},
  });
  nuxt.vueApp.directive('tippy', directive);
});
