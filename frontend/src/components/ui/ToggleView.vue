<script setup lang="ts" generic="T extends PropertyKey | boolean">
  import { computed } from 'vue';
  import type { Icon } from '@tabler/icons-vue';
  import { IconSlash } from '@tabler/icons-vue';

  // Options mandatory if T is not boolean
  interface Props {
    disabled?: boolean;
    options?: [Exclude<T, boolean>, Exclude<T, boolean>];
    labels?: [string, string];
    icon?: Icon;
  }
  const props = defineProps<Props>();

  // State
  const model = defineModel<T>({
    required: true,
  });
  const isChecked = computed(() => {
    if (props.options) {
      return !!props.options.findIndex((o) => o === model.value);
    }
    return !!model.value;
  });

  // Class (CSS)
  const labelIconClass = computed(() => ({
    'mr-auto ml-2': isChecked.value,
    'mr-2 ml-auto': !isChecked.value,
  }));

  function onToggle() {
    if (props.options) {
      model.value = props.options[isChecked.value ? 0 : 1];
    } else {
      model.value = !model.value as T;
    }
  }
</script>

<template>
  <label
    class="transition-default bg-content outline-paper hover:bg-paper active:bg-paper focus-within:ring-info relative mx-[2px] my-[2px] flex h-7 w-16 cursor-pointer items-center rounded-full outline-2 outline-offset-2 select-none focus-within:ring-2 focus-within:ring-offset-4">
    <input
      type="checkbox"
      class="sr-only"
      :disabled="disabled"
      :checked="isChecked"
      @keyup.enter="onToggle"
      @change="onToggle" />
    <span
      class="transition-default absolute h-7 w-7 flex-shrink-0 rounded-full bg-white"
      :class="{ 'left-[calc(100%-1.75rem)]': isChecked, 'left-0': !isChecked }" />
    <template v-if="icon">
      <div
        class="relative h-6 w-6"
        :class="labelIconClass">
        <icon-slash
          v-if="!isChecked"
          class="absolute w-6 stroke-[2.5] text-lg" />
        <component
          :is="icon"
          class="absolute w-6" />
      </div>
    </template>
    <template v-else-if="labels">
      <span
        class="relative px-2 text-sm"
        :class="labelIconClass">
        {{ labels[isChecked ? 1 : 0] }}
      </span>
    </template>
  </label>
</template>
