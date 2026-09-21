<script setup lang="ts">
  interface Props {
    shadow?: boolean;
  }
  const { shadow = false } = defineProps<Props>();
</script>

<template>
  <div class="relative aspect-[2]">
    <span class="absolute left-0 h-6/7 aspect-square rounded-full bg-secondary" :class="{ 'drop-shadow-round-lg drop-shadow-secondary/50': shadow }" />
    <span class="absolute z-1 left-1/2 -translate-x-1/2 h-6/7 aspect-square rounded-full bg-primary" :class="{ 'drop-shadow-round-lg drop-shadow-primary/50': shadow }" />
    <span class="absolute right-0 h-6/7 aspect-square rounded-full bg-info" :class="{ 'drop-shadow-round-lg drop-shadow-info/50': shadow }" />
  </div>
</template>