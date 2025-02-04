<script setup lang="ts">
  import { computed } from 'vue';
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';

  interface Props {
    text: string;
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
    v-bind="$attrs"
    class="button shadow-paper/50 w-fit min-w-24 rounded p-2 px-4 font-medium text-white uppercase shadow-2xs drop-shadow-none active:shadow-none disabled:cursor-not-allowed"
    :disabled="disabled || loading"
    :class="bgClass">
    <template v-if="loading">
      <loading-icon class="icon mx-auto animate-spin" />
    </template>
    <template v-else>
      {{ text }}
    </template>
  </button>
</template>

<style scoped lang="scss">
  @use '@/assets/css/variables';

  .button {
    cursor: pointer;

    &.button-submit {
      background-color: variables.$color-primary;
    }
    &.button-danger {
      background-color: red;
    }
    &.button-info {
      background-color: variables.$color-info;
    }
    &.button-disabled {
      background-color: gray;
    }

    &:hover {
      background-color: darken(variables.$color-secondary, 5%);

      &.button-submit {
        background-color: darken(variables.$color-primary, 5%);
      }
      &.button-danger {
        background-color: darken(red, 5%);
      }
      &.button-info {
        background-color: darken(variables.$color-info, 5%);
      }
      &.button-disabled {
        background-color: darken(gray, 5%);
      }
    }

    &:not(:disabled):active {
      filter: brightness(0.9);
    }
  }
</style>
