<script setup lang="ts">
  interface Props {
    label: string;
    name: string;
    uppercase?: boolean;
    errored?: boolean;
    success?: boolean;
  }
  defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      class="w-64 max-w-fit text-center text-sm font-semibold text-balance"
      :class="{ uppercase: uppercase }"
      :for="name">
      {{ label }}
    </label>
    <div
      :id="name"
      class="form-control relative flex-grow"
      :class="{
        'border-primary rounded border-2': success,
        'rounded border-2 border-red-600': errored,
      }">
      <slot v-bind="{ ...$attrs, ...$props }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .form-control > *:first-child {
    width: 100%;
  }
</style>
