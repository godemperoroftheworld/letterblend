<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import AvatarView from '@/components/ui/AvatarView.vue';

  defineProps<Movie>();
</script>

<template>
  <a
    class="relative overflow-hidden rounded"
    href="https://letterboxd.com/film/eternal-sunshine-of-the-spotless-mind"
    target="_blank">
    <div class="absolute bottom-0.5 left-0.5 flex gap-0.5">
      <avatar-view
        v-for="user in users"
        :key="user"
        class="h-6 w-6"
        :name="user" />
    </div>
    <nuxt-img :src="`https://image.tmdb.org/t/p/original/${poster}`" />
  </a>
</template>
