<script setup lang="ts" generic="T extends PropertyKey">
  import { onMounted, ref, watch } from 'vue';
  import type { Option as OptionType } from '../utils/option';

  export interface SelectProps<T extends PropertyKey> {
    options: OptionType<T>[];
    modelValue?: T;
    selectFirst?: boolean;
  }
  interface Emits {
    (e: 'update:modelValue', option: T | undefined): void;
    (e: 'selected', option: T | undefined): void;
  }
  const emits = defineEmits<Emits>();
  const props = defineProps<SelectProps<T>>();

  const selected = ref<T>();

  onMounted(() => {
    if (props.selectFirst && props.options.length) {
      selected.value = props.options[0].id;
    } else if (props.modelValue) {
      selected.value = props.modelValue;
    }
  });

  watch(
    selected,
    (val) => {
      emits('selected', val);
      emits('update:modelValue', val);
    },
    { immediate: true },
  );
</script>

<template>
  <div class="relative">
    <select
      v-model="selected"
      class="w-full max-w-sm rounded border bg-white bg-none p-2 text-sm font-normal">
      <option
        :selected="!selectFirst"
        value>
        select an option
      </option>
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id">
        {{ option.label }}
      </option>
    </select>
    <span
      v-if="selected === undefined"
      class="pointer-events-none absolute top-0 bottom-0 left-2 my-auto h-fit font-light select-none">
      select an option
    </span>
  </div>
</template>
