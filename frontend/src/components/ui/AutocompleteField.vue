<script setup lang="ts" generic="T">
  import InputField, { type InputProps } from '@/components/ui/InputField.vue';
  import { useFuse } from '@vueuse/integrations/useFuse';

  // Setup
  export interface DropdownProps extends InputProps {
    options?: string[];
  }
  defineOptions({ inheritAttrs: false });
  const props = withDefaults(defineProps<DropdownProps<T>>(), { options: [] });
  const model = defineModel<T>();
  const fieldRef = ref();

  // Internal value, no debounce
  const innerValue = ref<T>();
  watch(model, (val) => (innerValue.value = val), { immediate: true });

  // Search
  const valueStr = computed(() => (innerValue.value ? String(innerValue.value) : ''));
  const matchingOptions = useFuse(valueStr, () => props.options, {
    resultLimit: 5,
  });
  const dropdownOptions = computed(() => {
    return matchingOptions.results.value.toSorted((a, b) => a.score - b.score).map((v) => v.item);
  });
  const { width } = useElementSize(fieldRef);
  const dropdownWidthStyle = computed(() => {
    return { width: `${width.value}px` };
  });

  // Selection
  const opened = ref(false);
  onClickOutside(fieldRef, () => {
    opened.value = false;
  });
  function selectEntry(entry: T) {
    model.value = entry;
    opened.value = false;
  }
</script>

<template>
  <div
    ref="fieldRef"
    class="relative"
    @keydown.tab="opened = false">
    <input-field
      v-model="model"
      autocomplete="off"
      class="h-full w-full"
      v-bind="{ ...$props, ...$attrs }"
      @focusin="opened = true"
      @changed="(val) => (innerValue = val)"
      @keyup.prevent="opened = true"
      @keyup.enter="dropdownOptions.length ? selectEntry(dropdownOptions[0]) : undefined" />
    <div
      v-show="opened"
      ref="dropdownRef"
      :style="dropdownWidthStyle"
      class="bg-content fixed z-10 mt-1 w-full rounded-b text-sm">
      <div class="flex flex-col">
        <a
          v-for="(entry, idx) in dropdownOptions"
          :key="idx"
          class="w-full cursor-pointer p-2 hover:bg-slate-500/50"
          @click.prevent="selectEntry(entry)"
          @keyup.enter="selectEntry(entry)">
          {{ entry }}
        </a>
      </div>
    </div>
  </div>
</template>
