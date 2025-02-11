<script setup lang="ts">
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

  interface Props {
    label: string;
    name: string;
    expandDefault?: boolean;
  }
  const props = defineProps<Props>();

  const open = ref(props.expandDefault);
</script>

<template>
  <div
    class="transition-default accordion bg-content transition-default relative max-h-10 min-w-64 overflow-hidden rounded"
    :class="{ 'max-h-96': open }">
    <input
      v-model="open"
      class="absolute top-0 left-0 h-10 w-full cursor-pointer opacity-0"
      type="checkbox"
      :name="name" />
    <div class="mb-4 h-6 p-2">{{ label }}</div>
    <div class="absolute top-2 right-2">
      <icon-chevron-up v-if="open" />
      <icon-chevron-down v-else />
    </div>
    <div class="bg-background border-content rounded border-4 p-2">
      <slot />
    </div>
  </div>
</template>
