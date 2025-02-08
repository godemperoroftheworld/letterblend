<script setup lang="ts">
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';
  import useLoader from '@/composables/load';

  const { loading } = useLoader();
  const isClient = computed(() => import.meta.client);
</script>

<template>
  <div
    v-show="isClient && loading"
    class="fixed top-0 left-0 z-10 flex h-dvh w-dvw items-center justify-center bg-slate-500/50">
    <loading-icon class="text-background h-24 w-24" />
  </div>
</template>
