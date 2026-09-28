<script setup lang="ts">
  import type { ParticlesOptions } from '@tsparticles/engine';
  import useParticles from '~/composables/particles.ts';

  const { enabled: particles } = useParticles();
  const options: Partial<ParticlesOptions> = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#fff',
      },
      move: {
        enable: true,
        direction: 'bottom',
        speed: 4,
        straight: true,
        outMode: 'out',
      },
      angle: {
        value: { min: -60, max: 60 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 12 },
      },
      number: {
        value: 25,
      },
      shape: {
        type: 'images',
        options: {
          images: {
            src: 'https://www.svgrepo.com/show/402505/popcorn.svg',
          },
        },
      },
      size: {
        value: 12,
      },
    },
  };
</script>

<template>
  <client-only>
    <VueParticles
      v-if="particles"
      id="particles"
      :options="options" />
  </client-only>
</template>
