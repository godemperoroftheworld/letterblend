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
  <div class="bg-black drop-shadow-lg drop-shadow-black/50">
    <div class="film-sprockets mt-1.5" />
    <div
      class="divide-muted grid auto-cols-fr auto-rows-fr divide-dashed max-xl:max-w-72 max-xl:divide-y-4 xl:grid-flow-col xl:divide-x-4">
      <div
        v-for="(cell, idx) in cells"
        :key="idx"
        class="h-fit p-6">
        <div class="flex items-center gap-2">
          <component
            :is="cell.icon"
            class="size-8"
            :class="{
              'text-secondary': idx % 3 === 0,
              'text-primary': idx % 3 === 1,
              'text-info': idx % 3 === 2,
            }" />
          <h2 class="text-lg font-bold text-white">{{ cell.title }}</h2>
        </div>
        <p class="mt-2 text-sm text-slate-50 italic">{{ cell.content }}</p>
      </div>
    </div>
    <div class="film-sprockets mb-1.5" />
  </div>
</template>

<style scoped>
  @reference '@/assets/css/main.css';

  .film-sprockets {
    @apply h-5 w-full bg-radial-[circle] from-slate-600 from-[4px] to-transparent to-[5px] bg-size-[24px_100%];
  }
</style>
