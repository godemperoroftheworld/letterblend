<script setup lang="ts" generic="T">
  import { useDebounceFn } from '@vueuse/core';

  export interface InputProps {
    type?: 'text' | 'password' | 'number';
    debounceMs?: number;
    step?: number;
  }
  interface Emits {
    (e: 'changed', val: T): void;
  }
  const props = withDefaults(defineProps<InputProps>(), { type: 'text' });
  const emits = defineEmits<Emits>();
  const model = defineModel<T>();

  const updateValue = useDebounceFn((val: T | undefined) => {
    model.value = val;
  }, props.debounceMs ?? 0);

  const innerValue = ref<T>();
  watch(
    () => model.value,
    (val) => {
      innerValue.value = val;
    },
    { immediate: true },
  );
  watch(innerValue, (val) => {
    updateValue(val);
    emits('changed', val);
  });
</script>

<template>
  <input
    v-model="innerValue"
    :type="type"
    :step="step"
    class="focus:outline-info bg-content box-border max-w-full rounded p-2 outline-offset-2 focus:outline-1" />
</template>
