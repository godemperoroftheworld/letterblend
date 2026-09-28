<script setup lang="ts">
  interface Props {
    orientation?: 'horizontal' | 'vertical';
  }
  const { orientation = 'horizontal' } = defineProps<Props>();
</script>

<template>
  <div
    :class="{
      'aspect-70/26': orientation === 'horizontal',
      'aspect-26/40': orientation === 'vertical',
    }"
    class="drop-shadow-ticket/25 relative drop-shadow-lg">
    <div
      :class="{
        'grid-flow-col grid-cols-4 mask-[url(/img/ticket.svg)]': orientation === 'horizontal',
        'grid-flow-row grid-rows-4 mask-[url(/img/ticket-vertical.svg)]':
          orientation === 'vertical',
      }"
      class="light bg-ticket grid size-full mask-contain mask-no-repeat">
      <div
        :class="{
          'row-span-1': orientation === 'vertical',
          'col-span-1': orientation === 'horizontal',
        }"
        class="relative p-4 px-5">
        <slot name="left" />
      </div>
      <div
        :class="{
          'row-span-3': orientation === 'vertical',
          'col-span-3': orientation === 'horizontal',
        }"
        class="relative p-4 px-5">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
