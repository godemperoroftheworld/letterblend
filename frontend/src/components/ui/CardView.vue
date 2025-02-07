<script setup lang="ts">
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

  export interface CardExpose {
    setCollapsed: (collapsed: boolean) => void;
  }
  const props = defineProps<{
    title: string;
    collapsable?: boolean;
    collapsedDefault?: boolean;
    justify?: 'between' | 'center';
  }>();

  const open = ref(!props.collapsedDefault);
  const shouldCollapse = computed(() => {
    // Small fix for SSR
    if (import.meta.server && props.collapsedDefault) return true;
    return props.collapsable && !open.value;
  });
  onMounted(() => {
    if (props.collapsedDefault) {
      open.value = false;
    }
  });

  function setCollapsed(value: boolean) {
    open.value = !value;
  }
  defineExpose({
    setCollapsed,
  });
</script>

<template>
  <div
    class="bg-background transition-default relative flex max-h-full flex-col overflow-hidden rounded-xl pt-4"
    :class="{ '!max-h-14': shouldCollapse }">
    <h3
      class="text-info text-shadow-white text-shadow pointer-events-none h-8 text-center text-xl font-bold uppercase">
      {{ title }}
    </h3>
    <template v-if="collapsable">
      <input
        v-model="open"
        class="absolute top-0 left-0 h-16 w-full cursor-pointer opacity-0"
        type="checkbox" />
      <div class="absolute top-4 right-4 lg:top-4 lg:right-8">
        <icon-chevron-down
          v-if="shouldCollapse"
          class="h-7 w-7" />
        <icon-chevron-up
          v-else
          class="h-7 w-7" />
      </div>
    </template>
    <div
      class="transition-default relative flex h-[calc(100%-2rem)] flex-grow flex-col items-center gap-4 overflow-hidden p-4 lg:p-8"
      :class="{
        'justify-between': props.justify === 'between',
        'justify-center': props.justify === 'center',
      }">
      <slot />
    </div>
  </div>
</template>
