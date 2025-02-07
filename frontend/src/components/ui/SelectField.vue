<script setup lang="ts" generic="T extends PropertyKey">
  import { onMounted, watch } from 'vue';
  import type { Option as OptionType } from '@/utils/option';

  export interface SelectProps<T extends PropertyKey> {
    options: T[] | OptionType<T>[];
    selectFirst?: boolean;
  }
  interface Emits {
    (e: 'selected', option: T | undefined): void;
  }
  const model = defineModel<T>();
  const emits = defineEmits<Emits>();
  const props = defineProps<SelectProps<T>>();

  onMounted(() => {
    if (props.selectFirst && props.options.length) {
      model.value = 'id' in props.options[0] ? props.options[0].id : props.options[0];
    } else if (props.modelValue) {
      model.value = props.modelValue;
    }
  });

  watch(
    model,
    (val) => {
      emits('selected', val);
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
        v-for="(option, idx) in options"
        :key="idx"
        :value="'id' in option ? option.id : option">
        {{ 'label' in option ? option.label : option }}
      </option>
    </select>
    <span
      v-if="selected === undefined"
      class="pointer-events-none absolute top-0 bottom-0 left-2 my-auto h-fit font-light select-none">
      select an option
    </span>
  </div>
</template>
