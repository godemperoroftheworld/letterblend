<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import AvatarView from '@/components/ui/AvatarView.vue';
  defineProps<Movie>();
</script>

<template>
  <a
    v-tippy="name"
    class="relative overflow-hidden rounded"
    :href="`https://letterboxd.com/film/${slug}`"
    target="_blank">
    <div class="absolute bottom-0.5 left-0.5 flex gap-0.5">
      <avatar-view
        v-for="user in users"
        :key="user"
        v-tippy="user"
        class="h-6 w-6"
        :name="user" />
    </div>
    <nuxt-img :src="`https://image.tmdb.org/t/p/original/${data.poster_path}`" />
  </a>
</template>
