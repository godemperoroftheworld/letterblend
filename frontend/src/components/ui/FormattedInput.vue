<script setup lang="ts">
  import type { InputProps } from '@/components/ui/InputField.vue';
  import numbro from 'numbro';
  import { useDebounceFn } from '@vueuse/core';

  export type FormattedInputProps = Omit<InputProps, 'type'> & {
    format: string;
    percent?: boolean;
  };
  interface Emits {
    (e: 'changed', val: number): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
  }
  const props = defineProps<FormattedInputProps<T>>();
  const emits = defineEmits<Emits>();
  const model = defineModel<number>();

  // Inner value
  const value = ref<number>();
  const updateValue = useDebounceFn((val: T | undefined) => {
    model.value = val;
  }, props.debounceMs ?? 0);
  watch(
    () => model.value,
    (val) => {
      value.value = val;
    },
    { immediate: true },
  );
  watch(value, (val) => {
    updateValue(val);
    emits('changed', val);
  });

  // Computed
  const modelFormatted = computed(() => {
    return numbro(model.value).format(props.format);
  });
  const propsToPass = computed(() => {
    const { format, percent, ...rest } = props;
    return rest;
  });

  // Focus switching
  const inputRef = ref();
  const inputFieldRef = ref();
  const focused = ref(false);
  onClickOutside(inputRef, () => (focused.value = false));
  watch(inputFieldRef, (val) => {
    if (val) val.focus();
  });
  watch(focused, (val) => {
    if (val) emits('focus');
    else emits('blur');
  });
</script>

<template>
  <div
    class="focus-within:outline-info bg-content box-border max-w-full rounded outline-offset-2 focus-within:outline-1">
    <input
      v-if="focused"
      ref="inputFieldRef"
      v-model="value"
      type="number"
      class="h-full w-full p-2 outline-none"
      v-bind="{ ...propsToPass }"
      @focus="focused = true"
      @blur="focused = false" />
    <input
      v-else
      class="h-full w-full p-2 outline-none"
      :value="modelFormatted"
      @focus="focused = true" />
  </div>
</template>
