<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import AvatarView from '@/components/ui/AvatarView.vue';
  defineProps<{ data?: Movie }>();

  const loaded = ref(false);
</script>

<template>
  <div class="relative">
    <template v-if="data">
      <a
        v-tippy="{ content: data.name, touch: 'hold' }"
        :href="`https://letterboxd.com/tmdb/${data.id}`"
        target="_blank"
        class="aspect-[2/3] w-full">
        <nuxt-img
          class="bg-paper aspect-[2/3] w-full overflow-hidden rounded"
          :class="{ 'animate-pulse': !loaded }"
          :src="`api/poster/id/${data.id}`"
          provider="raw"
          loading="lazy"
          @load="loaded = true" />
      </a>
      <div class="mx-auto mt-1 flex h-6 w-fit gap-1">
        <avatar-view
          v-for="user in data.users"
          :key="user"
          v-tippy="user"
          class="transition-default h-6 w-6 hover:scale-125"
          :name="user" />
      </div>
    </template>
    <template v-else>
      <div class="bg-paper aspect-[2/3] w-full animate-pulse rounded" />
      <div class="mx-auto mt-1 flex h-6 w-fit gap-1">
        <avatar-view
          v-for="idx in 2"
          :key="idx"
          class="transition-default h-6 w-6 hover:scale-125" />
      </div>
    </template>
  </div>
</template>
