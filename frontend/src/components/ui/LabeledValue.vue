<script setup lang="ts">
  import { IconInfoCircle } from '@tabler/icons-vue';

  interface Props {
    label?: string;
    name: string;
    uppercase?: boolean;
    errored?: boolean;
    success?: boolean;
    labelSize?: 'xs' | 'sm' | 'lg' | 'base';
    tooltip?: string;
  }
  const props = defineProps<Props>();

  const isSmallLabel = computed(() => props.labelSize === 'xs' || props.labelSize === 'sm');
</script>

<template>
  <div
    class="flex max-w-full min-w-0 shrink flex-col"
    :class="{ 'gap-0.5': isSmallLabel, 'gap-2': !isSmallLabel }">
    <label
      v-show="label"
      class="relative w-fit max-w-64 text-center font-semibold"
      :class="{
        uppercase,
        'text-sm': labelSize === 'sm',
        'text-xs': labelSize === 'xs',
        'text-lg': labelSize === 'lg',
      }"
      :for="name">
      {{ label }}
      <icon-info-circle
        v-if="tooltip"
        v-tippy="tooltip"
        class="text-info absolute top-0 left-full h-5 w-5 translate-x-1 cursor-pointer" />
    </label>
    <div
      :id="name"
      class="form-control relative flex-grow"
      :class="{
        'outline-primary rounded outline-2': success,
        'rounded outline-2 outline-red-600': errored,
      }">
      <slot />
    </div>
  </div>
</template>
