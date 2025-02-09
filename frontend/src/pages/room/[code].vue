<script setup lang="ts">
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';
  import type { BlendSettings as BlendSettingsType } from '@/components/blend/BlendSettings.vue';
  import { breakpointsTailwind } from '@vueuse/core';
  import { useRoom } from '@/composables/query/room';

  // Data
  const route = useRoute();
  const router = useRouter();
  const code = computed(() => route.params.code as string);
  const { data: room, isFetching } = useRoom(code);
  const results = computed(() => room.value?.movies);

  // Visual
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');

  function settingsSubmitted(settings: BlendSettingsType) {
    router.replace({ name: 'result', query: { names: route.query.names, ...settings } });
  }
</script>

<template>
  <div class="gap-2 max-md:flex max-md:flex-col md:grid md:grid-cols-5 md:gap-4 lg:gap-8">
    <card-view
      title="Results"
      class="h-fit shrink-0 md:col-span-3">
      <carousel-view
        :entries="results"
        :loading="isFetching">
        <template #default="data: Movie">
          <movie-poster
            class="w-full"
            v-bind="data" />
        </template>
      </carousel-view>
    </card-view>
    <card-view
      class="h-fit md:col-span-2"
      :collapsable="isSmall"
      title="Settings">
      <blend-settings
        :submitted="settingsSubmitted"
        :show-submit-button="true" />
    </card-view>
  </div>
</template>
