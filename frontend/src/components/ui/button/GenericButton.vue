<script setup lang="ts">
  import { computed } from 'vue';
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';

  interface Props {
    buttonStyle?: 'submit' | 'info' | 'danger' | 'hollow';
    disabled?: boolean;
    loading?: boolean;
  }
  const props = defineProps<Props>();

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
    v-bind="$attrs"
    type="button"
    class="button shadow-paper/50 flex min-w-24 justify-center gap-2 rounded p-2 px-4 font-medium text-white uppercase shadow-2xs drop-shadow-none active:shadow-none disabled:cursor-not-allowed"
    :disabled="disabled || loading"
    :class="bgClass">
    <template v-if="loading">
      <loading-icon class="mx-auto animate-spin" />
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style scoped lang="scss">
  @use '@/assets/css/button';
</style>
