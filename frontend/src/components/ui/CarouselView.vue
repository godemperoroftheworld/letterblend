<template>
  <div
    class="scroll- max-sm:no-scrollbar relative -mt-4 flex h-fit w-full snap-x snap-proximity gap-4 overflow-x-auto p-4 pb-6">
    <template v-if="loading || !entries">
      <div
        v-for="idx in 10"
        :key="idx"
        class="transition-default bg-paper flex aspect-[2/3] w-40 shrink-0 animate-pulse cursor-pointer snap-center items-center rounded hover:scale-105" />
    </template>
    <template v-else>
      <div
        v-for="(entry, idx) in entries"
        :key="idx"
        class="transition-default flex w-40 shrink-0 cursor-pointer snap-center items-center hover:scale-105">
        <slot v-bind="entry as (typeof entries)[number]" />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts" generic="T">
  interface Props {
    entries: T[] | undefined;
    loading?: boolean;
  }
  defineProps<Props>();
</script>
