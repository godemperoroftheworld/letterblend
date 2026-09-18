<script setup lang="ts">
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import type { InputMenuProps } from '@nuxt/ui'

  defineProps<InputMenuProps>();
  const model = defineModel<string>();
</script>

<template>
  <div class="relative">
    <div
      class="absolute top-1/2 left-2 z-1 size-6 -translate-y-1/2 md:-left-3 md:size-10 md:-translate-x-full">
      <letterboxd-avatar :name="model" />
    </div>
    <UInputMenu
      v-model="model"
      :items="items"
      autocomplete="on"
      class="box-border pl-10 md:pl-2" />
  </div>
</template>
