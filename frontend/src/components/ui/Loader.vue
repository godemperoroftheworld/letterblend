<script setup lang="ts">
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';
  import useLoader from '@/composables/load';

  const { loading } = useLoader();
  const isClient = computed(() => import.meta.client);
</script>

<template>
  <teleport to="#teleports">
    <div>
      <transition name="fade">
        <div
          v-show="isClient && loading"
          class="fixed top-0 left-0 z-20 h-dvh w-dvw bg-slate-500/50" />
      </transition>
      <transition name="scale">
        <loading-icon
          v-show="isClient && loading"
          class="absolute-center text-background z-20 h-24 w-24" />
      </transition>
    </div>
  </teleport>
</template>
