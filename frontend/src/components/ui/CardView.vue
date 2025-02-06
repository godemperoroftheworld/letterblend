<script setup lang="ts">
  import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

  const props = defineProps<{
    title: string;
    collapsable?: boolean;
    justify?: 'between' | 'center';
  }>();

  const open = ref(false);
  watch(
    () => props.collapsable,
    (val) => {
      open.value = !val;
    },
  );
  onMounted(() => {
    open.value = !props.collapsable;
  });
  watch(open, (val) => console.log(val));
</script>

<template>
  <div
    class="bg-background transition-default relative flex flex-col overflow-hidden rounded-xl pt-4"
    :class="{ 'max-h-14': collapsable && !open, 'max-h-full': collapsable && open }">
    <h3
      class="text-info text-shadow-white text-shadow pointer-events-none h-8 text-center text-xl font-bold uppercase">
      {{ title }}
    </h3>
    <template v-if="collapsable">
      <input
        v-model="open"
        class="absolute top-0 left-0 h-16 w-full cursor-pointer opacity-0"
        type="checkbox" />
      <div class="absolute top-4 right-4 lg:top-4 lg:right-8">
        <icon-chevron-down
          v-if="open"
          class="h-7 w-7" />
        <icon-chevron-up
          v-else
          class="h-7 w-7" />
      </div>
    </template>
    <div
      class="transition-default flex h-[calc(100%-2rem)] flex-grow flex-col items-center gap-4 overflow-hidden p-4 lg:p-8"
      :class="{
        'justify-between': props.justify === 'between',
        'justify-center': props.justify === 'center',
      }">
      <slot />
    </div>
  </div>
</template>
