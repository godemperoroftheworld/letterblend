<script setup lang="ts">
  import Logo from '@/components/LogoView.vue';

  const route = useRoute();
  const isHome = computed(() => route.path === '/');
</script>

<template>
  <div
    class="bg-logo shadow-paper/50 inset-shadow-paper/50 border-dark/50 fixed top-0 right-0 bottom-0 left-0 m-8 flex flex-col gap-4 rounded-3xl border-2 p-4 inset-shadow-xs shadow-xs md:mx-auto md:my-auto md:h-3/4 md:w-3/4">
    <logo
      class="mx-auto"
      :class="{ 'h-40 w-40': isHome, 'h-32 w-32': !isHome }" />
    <main class="relative flex-grow text-white lg:p-4">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
  main > * {
    height: 100%;
  }
</style>
