<script setup lang="ts">
  import Loader from '@/components/ui/Loader.vue';

  useHead({
    htmlAttrs: {
      lang: 'en',
    },
  });
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
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
  <ParticlesBackground />
  <Loader />
</template>
