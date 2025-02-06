<script setup lang="ts" generic="T">
  import { computed } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  export interface InputProps<T> {
    type?: 'text' | 'password' | 'number';
    textSize?: 'xs' | 'sm' | 'lg';
    debounceMs?: number;
    value?: T;
    step?: number;
  }
  const props = withDefaults(defineProps<InputProps<T>>(), { type: 'text' });
  const model = defineModel<T>();

  const updateValue = useDebounceFn((val: T | undefined) => {
    model.value = val;
  }, props.debounceMs ?? 0);

  const textClass = computed(() => {
    return props.textSize ? `text-${props.textSize}` : '';
  });
  const innerValue = ref<T>();
  watch(
    () => model.value,
    (val) => {
      innerValue.value = val;
    },
    { immediate: true },
  );
  watch(innerValue, updateValue);
</script>

<template>
  <input
    v-model="innerValue"
    :class="textClass"
    class="focus:outline-info bg-content box-border rounded p-2 outline-offset-2 focus:outline-1 sm:max-w-sm" />
</template>
