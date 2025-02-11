<template>
  <dialog-view
    :show="show"
    title="Confirm"
    width="md"
    @close="emits('close')">
    <template #default="{ close }">
      <div class="mb-8">
        <slot v-bind="{ close }" />
      </div>
      <div class="flex w-full justify-between gap-4">
        <text-button
          text="Cancel"
          class="w-64"
          button-style="hollow"
          @click="close" />
        <text-button
          text="Confirm"
          class="w-64"
          button-style="submit"
          @click="submit" />
      </div>
    </template>
  </dialog-view>
</template>
<script setup lang="ts">
  import DialogView from '@/components/ui/DialogView.vue';
  import TextButton from '@/components/ui/button/TextButton.vue';

  interface Props {
    show: boolean;
  }
  interface Emits {
    close: () => void;
    confirm: () => void;
  }
  defineProps<Props>();
  const emits = defineEmits<Emits>();

  function submit() {
    emits('confirm');
    emits('close');
  }
</script>
