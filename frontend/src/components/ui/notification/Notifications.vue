<script setup lang="ts">
  import { useNotifications } from '@/utils/notification';
  import Notification from '@/components/ui/notification/Notification.vue';

  const { notifications } = useNotifications();
</script>

<template>
  <client-only>
    <div class="transition-default fixed top-0 right-0 mt-2 mr-4 flex w-64 flex-col">
      <transition-group>
        <notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification" />
      </transition-group>
    </div>
  </client-only>
</template>

<style scoped>
  .v-enter-from,
  .v-leave-to {
    transform: translateX(150%);
  }

  .v-enter-to,
  .v-leave-from {
    transform: translateX(0%);
  }
</style>
