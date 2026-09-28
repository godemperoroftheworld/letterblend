<script setup lang="ts">
  interface Props {
    shadow?: boolean;
  }
  const { shadow = false } = defineProps<Props>();
</script>

<template>
  <div class="relative aspect-[2]">
    <span
      class="bg-secondary absolute top-1/2 left-0 aspect-square h-6/7 -translate-y-1/2 rounded-full"
      :class="{ 'drop-shadow-round-lg drop-shadow-secondary/50': shadow }" />
    <span
      class="bg-primary absolute top-1/2 left-1/2 z-1 aspect-square h-6/7 -translate-x-1/2 -translate-y-1/2 rounded-full"
      :class="{ 'drop-shadow-round-lg drop-shadow-primary/50': shadow }" />
    <span
      class="bg-info absolute top-1/2 right-0 aspect-square h-6/7 -translate-y-1/2 rounded-full"
      :class="{ 'drop-shadow-round-lg drop-shadow-info/50': shadow }" />
  </div>
</template>
