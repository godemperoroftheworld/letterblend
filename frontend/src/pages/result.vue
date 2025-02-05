<script setup lang="ts">
  import { useBlend } from '@/composables/query/blend';
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';

  const route = useRoute();
  const top = computed(() => Number(route.query.top));
  const threshold = computed(() => Number(route.query.threshold));
  const names = computed(() => (route.query.names as string).split(','));
  const { data: results } = useBlend(names, {
    top,
    threshold,
    data: false,
  });
</script>

<template>
  <card-view
    title="Results"
    class="h-fit">
    <div
      class="relative -mt-4 flex h-fit w-full snap-x snap-proximity gap-4 overflow-x-auto p-4 pb-6">
      <div
        v-for="result in results"
        :key="result.id"
        class="transition-default flex w-40 shrink-0 cursor-pointer snap-center items-center hover:scale-105">
        <movie-poster v-bind="result" />
      </div>
    </div>
  </card-view>
</template>
