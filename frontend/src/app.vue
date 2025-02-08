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
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>
