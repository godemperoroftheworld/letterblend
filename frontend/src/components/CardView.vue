<script setup lang="ts">
  defineProps<{
    title: string;
  }>();
</script>

<template>
  <div class="bg-background flex flex-col rounded-xl p-4">
    <h3 class="text-info text-shadow-white text-shadow text-center text-xl font-bold uppercase">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
