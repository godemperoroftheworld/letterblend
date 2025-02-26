<script setup lang="ts">
  import { computed } from 'vue';
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';

  interface Props {
    name: string;
    buttonStyle?: 'submit' | 'info' | 'danger' | 'hollow';
    disabled?: boolean;
    loading?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {});

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
    :name="name"
    type="button"
    tabindex="0"
    class="button shadow-paper/50 flex max-w-full min-w-24 justify-center gap-2 rounded p-2 px-4 font-medium text-white uppercase shadow-2xs drop-shadow-none active:shadow-none disabled:cursor-not-allowed"
    :disabled="disabled || loading"
    :class="bgClass">
    <template v-if="loading">
      <loading-icon class="mx-auto h-6 w-6 animate-spin" />
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style scoped lang="scss">
  @use '@/assets/css/button';
</style>
