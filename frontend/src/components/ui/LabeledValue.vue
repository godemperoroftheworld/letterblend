<script setup lang="ts">
  interface Props {
    label?: string;
    name: string;
    uppercase?: boolean;
    errored?: boolean;
    success?: boolean;
    labelSize?: 'xs' | 'sm' | 'lg' | 'base';
  }
  const props = defineProps<Props>();

  const isSmallLabel = computed(() => props.labelSize === 'xs' || props.labelSize === 'sm');
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ 'gap-0.5': isSmallLabel, 'gap-2': !isSmallLabel }">
    <label
      v-show="label"
      class="w-fit max-w-64 text-center font-semibold"
      :class="{
        uppercase,
        'text-sm': labelSize === 'sm',
        'text-xs': labelSize === 'xs',
        'text-lg': labelSize === 'lg',
      }"
      :for="name">
      {{ label }}
    </label>
    <div
      :id="name"
      class="form-control relative flex-grow"
      :class="{
        'outline-primary rounded outline-2': success,
        'rounded outline-2 outline-red-600': errored,
      }">
      <slot v-bind="{ ...$attrs, ...$props }" />
    </div>
  </div>
</template>
