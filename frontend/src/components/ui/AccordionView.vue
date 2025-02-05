<script setup lang="ts">
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

  interface Props {
    label: string;
    name: string;
  }
  defineProps<Props>();

  const open = ref(false);
</script>

<template>
  <div
    class="accordion bg-content transition-default relative max-h-10 min-w-64 overflow-hidden rounded px-4 py-2"
    :class="{ 'max-h-full': open }">
    <input
      v-model="open"
      class="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
      type="checkbox"
      :name="name" />
    <div class="h-6">{{ label }}</div>
    <div class="absolute top-2 right-2">
      <icon-chevron-up v-if="open" />
      <icon-chevron-down v-else />
    </div>
    <div class="my-4">
      <slot />
    </div>
  </div>
</template>
