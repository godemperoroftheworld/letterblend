<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  defineProps<{ data?: Movie | null }>();

  const loaded = ref(false);
</script>

<template>
  <div class="relative pb-8">
    <UTooltip
      v-if="data"
      :text="data.name">
      <a
        class="bg-paper block overflow-hidden rounded-sm"
        :class="{ 'aspect-2/3 animate-pulse': !loaded }"
        :href="`https://letterboxd.com/tmdb/${data.id}`"
        target="_blank">
        <NuxtImg
          class="aspect-2/3"
          :src="`api/poster/${data.id}`"
          provider="raw"
          loading="lazy"
          :alt="loaded ? data.name : null"
          @load="loaded = true" />
      </a>
    </UTooltip>
    <div
      v-else
      class="bg-paper aspect-2/3 w-full animate-pulse rounded-sm" />
    <UAvatarGroup class="absolute bottom-1 flex w-full justify-center">
      <LetterboxdAvatar
        v-for="idx in data?.users?.length ?? 2"
        :key="idx"
        :name="data?.users?.[idx - 1]"
        class="transition-default size-6 hover:scale-125" />
    </UAvatarGroup>
  </div>
</template>
