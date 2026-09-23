<script setup lang="ts">
  interface CellContent {
    title: string;
    icon: Component;
    content: string;
  }
  interface Props {
    cells: CellContent[];
  }
  const { cells } = defineProps<Props>();
</script>

<template>
  <div class="bg-black overflow-y-hidden">
    <div class="film-sprockets mt-1.5" />
    <div class="grid grid-flow-col auto-cols-fr divide-dashed divide-x-4 divide-muted">
      <div v-for="(cell, idx) in cells" :key="idx" class="p-6 h-fit">
        <div class="flex items-center gap-2">
          <component
            :is="cell.icon"
            class="size-8"
            :class="{
        'text-secondary': idx % 3 === 0,
        'text-primary': idx % 3 === 1,
        'text-info': idx % 3 === 2,
        }" />
          <h2 class="text-xl font-bold text-white">{{ cell.title }}</h2>
        </div>
        <p class="mt-2 text-slate-50 italic">{{ cell.content }}</p>
      </div>
    </div>
    <div class="film-sprockets mb-1.5" />
  </div>
</template>

<style scoped>
  @reference '@/assets/css/main.css';

  .film-sprockets {
    @apply w-full h-5 bg-radial-[circle] from-[4px] to-[5px] from-slate-600 to-transparent bg-size-[24px_100%];
  }
</style>