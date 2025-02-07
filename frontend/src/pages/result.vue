<script setup lang="ts">
  import { useBlend } from '@/composables/query/blend';
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';

  const route = useRoute();
  const top = computed(() => Number(route.query.top));
  const threshold = computed(() => Number(route.query.threshold));
  const names = computed(() => (route.query.names as string).split(','));
  const { data: results, isFetching } = useBlend(names, {
    top,
    threshold,
    details: true,
  });
</script>

<template>
  <card-view
    title="Results"
    class="h-fit">
    <carousel-view
      :entries="results"
      :loading="isFetching">
      <template #default="data: Movie">
        <movie-poster v-bind="data" />
      </template>
    </carousel-view>
  </card-view>
</template>
