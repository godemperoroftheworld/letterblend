<script setup lang="ts">
  export interface LabeledImageProps {
    title: string;
    description: string;
    image: string;
  }
  defineProps<LabeledImageProps>();
</script>

<template>
  <div class="flex flex-col">
    <nuxt-img
      class="mb-2 h-full min-h-0 w-full min-w-0"
      loading="lazy"
      :src="image" />
    <h3 class="text-center text-lg font-bold text-white capitalize">{{ title }}</h3>
    <p class="text-secondary text-center text-sm font-medium italic">{{ description }}</p>
  </div>
</template>
