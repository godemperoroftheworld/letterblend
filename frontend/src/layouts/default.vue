<script setup lang="ts">
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import { useLocalStorage } from '@vueuse/core';
  import NoSparklesIcon from '@/components/ui/icons/NoSparklesIcon.vue';
  import NowPlayingHeader from '~/components/header/NowPlayingHeader.vue';

  const route = useRoute();
  const router = useRouter();
  const isHome = computed(() => route.path === '/');
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });
</script>

<template>
    <NowPlayingHeader class="mb-2 w-full h-64" />
    <UContainer class="max-h-[calc(100%-18rem)] h-fit my-auto py-2 sm:py-4 lg:py-6 flex flex-col">
      <UCard class="grow" variant="solid">
        <UButton
          v-show="!isHome"
          name="back"
          class="absolute top-4 left-4 z-1 max-md:fixed max-sm:min-w-fit sm:w-40 lg:top-8 lg:left-8"
          button-style="hollow"
          @click.prevent="router.back"
          @keyup.enter="router.back">
          <icon-arrow-back />
          <span class="max-sm:hidden">Back</span>
        </UButton>
        <div class="absolute top-4 right-4 z-1 w-fit max-md:fixed lg:top-8 lg:right-8">
          <USwitch
            v-model="particlesEnabled"
            color="dark"
            size="2xl"
            :checked-icon="IconSparkles"
            :unchecked-icon="NoSparklesIcon" />
        </div>
        <main class="pt-8">
          <slot />
        </main>
      </UCard>
    </UContainer>
</template>
