<script setup lang="ts">
  import type { Notification } from '@/utils/notification';

  interface Props {
    notification: Notification;
  }
  defineProps<Props>();
</script>

<template>
  <div
    role="alert"
    class="popup-notification transition-default z-50 my-1 min-h-4 w-full min-w-32 rounded-md p-4 shadow"
    :class="[notification.type]">
    <div class="mb-1 text-lg font-medium">{{ notification.title }}</div>
    <div class="text-sm">{{ notification.message }}</div>
  </div>
</template>

<style scoped lang="scss">
  @use '@/assets/css/variables.scss';

  .popup-notification.error {
    background-color: red;
  }
  .popup-notification.success {
    background-color: variables.$color-primary;
  }
  .popup-notification.warn {
    background-color: variables.$color-secondary;
  }
  .popup-notification.normal {
    background-color: variables.$color-paper;
  }
  .popup-notification.visible {
    opacity: 1;
    transition: all 1000ms;
  }
</style>
