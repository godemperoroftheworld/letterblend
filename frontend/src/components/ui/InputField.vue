<script setup lang="ts" generic="T">
  import { computed } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  export interface InputProps<T> {
    type?: 'text' | 'password' | 'number';
    textSize?: 'xs' | 'sm' | 'lg';
    debounceMs?: number;
    value?: T;
  }

  const model = defineModel<T>();
  const props = withDefaults(defineProps<InputProps<T>>(), { type: 'text' });

  const updateValue = useDebounceFn((val: T) => {
    model.value = val;
  }, props.debounceMs ?? 0);

  const textClass = computed(() => {
    return props.textSize ? `text-${props.textSize}` : '';
  });
  const innerValue = ref<T>();
  onMounted(() => {
    innerValue.value = props.value;
  });
  watch(innerValue, (val) => {
    updateValue(val);
  });
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="innerValue"
    :value="innerValue"
    :type="type"
    :class="textClass"
    size="20"
    class="focus:outline-info bg-content box-border rounded p-2 outline-offset-2 focus:outline-1 sm:max-w-sm" />
</template>
