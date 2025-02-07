import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query';
import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query';
// Nuxt 3 app aliases
import type { NuxtApp } from 'nuxt/app';

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

export default defineNuxtPlugin((nuxt: NuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query');

  const options: VueQueryPluginOptions = { queryClient };
  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
});
