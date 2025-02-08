<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import AvatarView from '@/components/ui/AvatarView.vue';
  defineProps<Movie>();

  const loaded = ref(false);
</script>

<template>
  <div class="relative">
    <a
      v-tippy="name"
      :href="`https://letterboxd.com/film/${slug}`"
      target="_blank"
      :class="{ 'bg-paper animate-pulse': !loaded }"
      class="aspect-[2/3] w-full overflow-hidden rounded">
      <nuxt-img
        class="aspect-[2/3] w-full"
        :src="`api/poster/id/${data.id}`"
        provider="raw"
        @load="loaded = true" />
    </a>
    <div class="mx-auto mt-1 flex h-6 w-fit gap-1">
      <avatar-view
        v-for="user in users"
        :key="user"
        v-tippy="user"
        class="transition-default h-6 w-6 hover:scale-125"
        :name="user" />
    </div>
  </div>
</template>
