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

<script setup lang="ts">
  import Loader from '@/components/ui/Loader.vue';
  import Particles from '@/components/Particles.vue';
</script>
