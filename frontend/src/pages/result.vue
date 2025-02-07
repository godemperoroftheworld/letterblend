<script setup lang="ts">
  import { type BlendParams, useBlend } from '@/composables/query/blend';
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';
  import type { BlendSettings as BlendSettingsType } from '@/components/blend/BlendSettings.vue';
  import { breakpointsTailwind } from '@vueuse/core';

  // Data
  const route = useRoute();
  const top = computed(() => Number(route.query.top));
  const threshold = computed(() => Number(route.query.threshold));
  const names = computed(() => (route.query.names as string).split(','));
  const { data: results, isFetching } = useBlend(names, {
    top,
    threshold,
    details: true,
  });

  // Visual
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');

  function settingsSubmitted(settings: BlendSettingsType) {
    route.query = { ...route.query, ...settings };
  }
</script>

<template>
  <div class="grid gap-2 max-md:grid-rows-2 md:grid-cols-5 md:gap-4 lg:gap-8">
    <card-view
      title="Results"
      class="h-fit shrink-0 md:col-span-3">
      <carousel-view
        :entries="results"
        :loading="isFetching">
        <template #default="data: Movie">
          <movie-poster v-bind="data" />
        </template>
      </carousel-view>
    </card-view>
    <card-view
      class="h-fit md:col-span-2"
      :collapsable="isSmall"
      title="Settings">
      <blend-settings :submitted="settingsSubmitted" />
    </card-view>
  </div>
</template>
