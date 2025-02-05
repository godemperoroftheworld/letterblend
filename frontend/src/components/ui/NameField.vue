<script setup lang="ts">
  import InputField, { type InputProps } from '@/components/ui/InputField.vue';
  import AvatarView from '@/components/ui/AvatarView.vue';
  defineProps<InputProps<string>>();

  const model = defineModel<string>();
</script>

<template>
  <div class="relative">
    <div class="absolute top-1/2 left-2 -translate-y-1/2 md:-left-3 md:-translate-x-full">
      <avatar-view
        :name="model"
        class="h-6 w-6 md:h-10 md:w-10" />
    </div>
    <input-field
      v-model="model"
      class="box-border pl-10 md:pl-2"
      v-bind="{ ...$props, ...$attrs }" />
  </div>
</template>
