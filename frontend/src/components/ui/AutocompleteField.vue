<script setup lang="ts" generic="T">
  import InputField, { type InputProps } from '@/components/ui/InputField.vue';
  import { useFuse } from '@vueuse/integrations/useFuse';
  import type { SelectProps } from '@/components/ui/SelectField.vue';

  export interface DropdownProps<T> extends InputProps<T> {
    options: string[];
  }
  defineOptions({ inheritAttrs: false });
  const props = defineProps<DropdownProps<T>>();
  const model = defineModel<T>();

  // Internal value, no debounce
  const innerValue = ref<T>();
  watch(model, (val) => (innerValue.value = val), { immediate: true });

  // Search
  const valueStr = computed(() => (innerValue.value ? String(innerValue.value) : ''));
  const matchingOptions = useFuse(valueStr, props.options, {
    resultLimit: 5,
  });
  const dropdownOptions = computed(() => {
    if (matchingOptions.results.value.find((o) => o.item === valueStr.value)) {
      return [];
    }
    return matchingOptions.results.value.sort((a, b) => a.score - b.score).map((v) => v.item);
  });

  // Selection
  const fieldRef = ref();
  const opened = ref(false);
  onClickOutside(fieldRef, () => {
    opened.value = false;
  });
</script>

<template>
  <div
    ref="fieldRef"
    class="relative">
    <input-field
      v-model="model"
      class="h-full w-full"
      v-bind="{ ...$props, ...$attrs }"
      @focusin="opened = true"
      @changed="(val) => (innerValue = val)" />
    <div
      v-show="opened"
      ref="dropdownRef"
      class="bg-content absolute mt-1 flex w-full flex-col rounded-b text-sm">
      <ul>
        <li
          v-for="(entry, idx) in dropdownOptions"
          :key="idx"
          class="cursor-pointer p-2 hover:bg-slate-500/50"
          @click.prevent="model = entry">
          <a @keyup.enter="model = entry">
            {{ entry }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
