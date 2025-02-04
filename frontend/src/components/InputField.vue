<script setup lang="ts" generic="T">
  import { computed } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  export interface InputProps {
    type?: 'text' | 'password' | 'number';
    textSize?: 'xs' | 'sm' | 'lg';
    debounceMs?: number;
  }

  const model = defineModel<T>();
  const props = withDefaults(defineProps<InputProps>(), { type: 'text' });

  const updateValue = useDebounceFn((val: T) => {
    model.value = val;
  }, props.debounceMs ?? 0);

  const textClass = computed(() => {
    return props.textSize ? `text-${props.textSize}` : '';
  });
  const value = computed({
    get: () => model.value,
    set: updateValue,
  });
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="value"
    :type="type"
    :class="textClass"
    class="border-paper/50 focus:ring-info bg-logo max-w-sm rounded border p-2 outline-none focus:ring" />
</template>
