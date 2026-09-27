<script setup lang="ts">
  type Emits = {
    confirm: [];
  };

  const emits = defineEmits<Emits>();
  const open = defineModel<boolean>('open', { default: false });

  function close() {
    open.value = false;
  }
  function confirm() {
    open.value = false;
    emits('confirm');
  }
</script>

<template>
  <UModal
    v-model:open="open"
    :dismissible="false"
    title="Confirm Changes"
    :ui="{ footer: 'justify-end' }">
    <template #body>
      <slot />
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        size="lg"
        @click="close" />
      <UButton
        label="Confirm"
        color="neutral"
        size="lg"
        @click="confirm" />
    </template>
  </UModal>
</template>
