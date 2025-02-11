<script setup lang="ts">
  import Loader from '@/components/ui/Loader.vue';
  import Particles from '@/components/Particles.vue';
</script>

<template>
  <Head>
    <Title>Letterblend</Title>
    <Meta
      name="description"
      content="Blend together your Letterboxd watchlists!" />
    <Meta
      name="theme-color"
      content="#2c3440" />
  </Head>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <loader />
  <particles />
</template>

<style lang="scss">
  .page-enter-active,
  .page-leave-active {
    transition: all 0.5s ease;
    position: absolute;
    width: calc(100% - 2rem);
  }

  .page-enter-from {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
  .page-leave-to {
    transform: translateX(calc(-100% - 1rem));
    opacity: 0;
  }
</style>
