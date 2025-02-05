<script setup lang="ts">
  import type { Icon } from '@tabler/icons-vue';
  import { computed } from 'vue';
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';

  interface Props {
    icon: Icon;
    type?: 'submit' | 'info' | 'danger';
    disabled?: boolean;
    loading?: boolean;
  }
  const props = defineProps<Props>();

  const bgClass = computed(() => {
    if (props.disabled || props.loading) return 'button-disabled';
    if (props.type) {
      return `button-${props.type}`;
    }
    return '';
  });
</script>

<template>
  <button
    class="button aspect-square cursor-pointer rounded text-xl disabled:cursor-not-allowed"
    :disabled="disabled || loading"
    :class="bgClass">
    <template v-if="loading">
      <loading-icon class="mx-auto animate-spin" />
    </template>
    <template v-else>
      <component
        :is="icon"
        class="mx-auto" />
    </template>
  </button>
</template>

<style scoped lang="scss">
  @use '@/assets/css/button';
</style>
