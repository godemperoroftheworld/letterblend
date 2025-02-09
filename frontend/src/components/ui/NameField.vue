<script setup lang="ts">
  import type { InputProps } from '@/components/ui/InputField.vue';
  import AvatarView from '@/components/ui/AvatarView.vue';
  import AutocompleteField from '@/components/ui/AutocompleteField.vue';

  interface Props extends InputProps<string> {
    options: string[];
  }
  defineProps<Props>();

  const model = defineModel<string>();
</script>

<template>
  <div class="relative">
    <div
      class="absolute top-1/2 left-2 z-10 h-6 w-6 -translate-y-1/2 md:-left-3 md:h-10 md:w-10 md:-translate-x-full">
      <avatar-view :name="model" />
    </div>
    <autocomplete-field
      v-model="model"
      v-bind="{ ...$props, ...$attrs }"
      :options="options"
      class="box-border pl-10 md:pl-2" />
  </div>
</template>
