<template>
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
