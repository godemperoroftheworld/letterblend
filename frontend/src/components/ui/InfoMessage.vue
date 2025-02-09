<script setup lang="ts">
  import { IconInfoCircle } from '@tabler/icons-vue';

  interface Props {
    color: 'info' | 'primary' | 'secondary';
  }
  const props = withDefaults(defineProps<Props>(), {
    color: 'info',
  });

  const classNames = computed(() => {
    switch (props.color) {
      case 'info':
        return 'border-info text-info';
      case 'primary':
        return 'border-primary text-primary';
      case 'secondary':
        return 'border-secondary text-secondary';
    }
  });
</script>

<template>
  <div
    :class="classNames"
    class="flex items-center justify-center gap-2 rounded border-2 p-2 text-center">
    <icon-info-circle class="h-6" />
    <span class="w-fit cursor-default"><slot /></span>
  </div>
</template>
