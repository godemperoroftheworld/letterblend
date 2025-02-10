<template>
  <div
    class="relative flex h-fit w-fit max-w-full snap-x snap-proximity gap-4 overflow-x-auto p-4 pb-6">
    <template v-if="loading || !entries">
      <template
        v-for="idx in 10"
        :key="idx">
        <div
          class="transition-default flex w-40 shrink-0 cursor-pointer snap-center items-center hover:scale-105">
          <slot name="placeholder" />
        </div>
      </template>
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
