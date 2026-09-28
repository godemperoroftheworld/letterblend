import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  },
});

export default defineNuxtPlugin((nuxt) => {
  const options: VueQueryPluginOptions = { queryClient };
  nuxt.vueApp.use(VueQueryPlugin, options);
});
