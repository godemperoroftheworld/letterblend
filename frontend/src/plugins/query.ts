import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query';
import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 2,
      // @ts-expect-error any here makes sense
      placeholderData: (previousData) => previousData,
    },
  },
});

export default defineNuxtPlugin((nuxt) => {
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
      if (vueQueryState.value) {
        hydrate(queryClient, vueQueryState.value);
      }
    });
  }
});
