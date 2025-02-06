<script setup lang="ts">
  export interface LabeledImageProps {
    title: string;
    description: string;
    image: string;
  }
  defineProps<LabeledImageProps>();
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <nuxt-img
      class="min-h-0"
      :src="image" />
    <h3 class="text-secondary text-center text-lg font-bold capitalize">{{ title }}</h3>
    <p class="text-center text-sm font-medium text-white italic">{{ description }}</p>
  </div>
</template>
