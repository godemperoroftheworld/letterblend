<script setup lang="ts">
  import type { Icon } from '@tabler/icons-vue';
  import { computed } from 'vue';
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';

  interface Props {
    icon: Icon;
    buttonStyle?: 'submit' | 'info' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    size?: number;
  }
  const props = withDefaults(defineProps<Props>(), { size: 24 });

  const bgClass = computed(() => {
    if (props.disabled || props.loading) return 'button-disabled';
    if (props.buttonStyle) {
      return `button-${props.buttonStyle}`;
    }
    return '';
  });
</script>

<template>
  <button
    class="button flex cursor-pointer items-center rounded p-2"
    :disabled="disabled || loading"
    type="button"
    :class="bgClass">
    <template v-if="loading">
      <loading-icon class="mx-auto aspect-square animate-spin" />
    </template>
    <template v-else>
      <component
        :is="icon"
        class="mx-auto aspect-square" />
    </template>
  </button>
</template>

<style scoped lang="scss">
  @use '@/assets/css/button';
</style>
