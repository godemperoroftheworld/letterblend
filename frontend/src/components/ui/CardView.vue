<script setup lang="ts">
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

  export interface CardExpose {
    setCollapsed: (collapsed: boolean) => void;
  }
  const props = defineProps<{
    title: string;
    collapsable?: boolean;
    collapsedDefault?: boolean;
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
    class="bg-background transition-default relative flex max-h-screen flex-col gap-4 overflow-hidden rounded-xl p-4 !pt-4"
    :class="{ '!max-h-14': shouldCollapse }">
    <h3 class="text-center text-lg font-bold uppercase italic">
      {{ title }}
    </h3>
    <client-only v-if="collapsable">
      <input
        v-model="open"
        class="absolute top-0 left-0 h-16 w-full cursor-pointer opacity-0"
        type="checkbox" />
      <div class="absolute top-4 right-4 lg:top-8 lg:right-8">
        <icon-chevron-down
          v-if="shouldCollapse"
          class="h-7 w-7" />
        <icon-chevron-up
          v-else
          class="h-7 w-7" />
      </div>
    </client-only>
    <div class="relative grow">
      <slot />
    </div>
  </div>
</template>
