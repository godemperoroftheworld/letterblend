<script setup lang="ts">
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';
  import { breakpointsTailwind } from '@vueuse/core';
  import { useRoom } from '@/composables/query/room';
  import { useUpdateSettings } from '@/composables/mutation/room';
  import type { RoomSettings } from '@/types/room';

  // Data
  const route = useRoute();
  const code = computed(() => route.params.code as string);
  const { data: room, isFetching } = useRoom(code);
  const results = computed(() => room.value?.movies);

  // Visual
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');

  const { mutateAsync: updateSettings } = useUpdateSettings();
  async function settingsSubmitted(settings: RoomSettings) {
    await updateSettings({ id: room.value!.code, settings });
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
        <template #placeholder>
          <movie-poster class="w-full" />
        </template>
        <template #default="data: Movie">
          <movie-poster
            class="w-full"
            :data="data" />
        </template>
      </carousel-view>
    </card-view>
    <card-view
      class="h-fit md:col-span-2"
      :collapsable="isSmall"
      title="Settings">
      <blend-settings
        :submitted="settingsSubmitted"
        :loading="isFetching"
        submit-button-text="Update"
        :show-submit-button="true" />
    </card-view>
  </div>
</template>
