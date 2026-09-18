<script setup lang="ts">
  import LetterblendLogo from '@/components/ui/LetterblendLogo.vue';
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import { useLocalStorage } from '@vueuse/core';
  import NoSparklesIcon from '@/components/ui/icons/NoSparklesIcon.vue';

  const route = useRoute();
  const router = useRouter();
  const isHome = computed(() => route.path === '/');
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });
</script>

<template>
  <UContainer class="relative flex flex-col items-center justify-center p-4">
    <!-- LetterblendLogo shows separately on mobile -->
    <UHeader class="md:hidden mb-2">
      <UCard>
        <nuxt-link to="/">
          <letterblend-logo class="size-32" />
        </nuxt-link>
      </UCard>
    </UHeader>
    <UMain>
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
          :checked-icon="IconSparkles"
          :unchecked-icon="NoSparklesIcon" />
      </div>
      <div class="mx-auto mt-2 w-fit">
        <nuxt-link
          to="/"
          class="max-md:hidden">
          <letterblend-logo class="size-40" />
        </nuxt-link>
      </div>
      <main class="p-4">
        <slot />
      </main>
    </UMain>
  </UContainer>
</template>
