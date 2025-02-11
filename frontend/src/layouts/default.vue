<script setup lang="ts">
  import Logo from '@/components/ui/LogoView.vue';
  import GenericButton from '@/components/ui/button/GenericButton.vue';
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import ContentView from '@/components/ui/ContentView.vue';
  import ToggleView from '@/components/ui/ToggleView.vue';
  import { useLocalStorage } from '@vueuse/core';

  const route = useRoute();
  const router = useRouter();
  const isHome = computed(() => route.path === '/');
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });
</script>

<template>
  <div class="relative flex min-h-full flex-col items-center justify-center p-4">
    <content-view class="mb-2 w-fit md:hidden">
      <nuxt-link to="/">
        <logo class="h-32 w-32" />
      </nuxt-link>
    </content-view>
    <content-view class="min-h-[75dvh] w-full max-w-screen-lg">
      <generic-button
        v-show="!isHome"
        class="absolute top-4 left-4 z-1 max-md:fixed max-sm:min-w-fit sm:w-40 lg:top-8 lg:left-8"
        button-style="hollow"
        @click.prevent="router.back"
        @keyup.enter="router.back">
        <icon-arrow-back />
        <span class="max-sm:hidden">Back</span>
      </generic-button>
      <div class="absolute top-4 right-4 z-1 w-fit max-md:fixed lg:top-8 lg:right-8">
        <toggle-view
          v-model="particlesEnabled"
          :icon="IconSparkles" />
      </div>
      <div class="mx-auto mt-2 w-fit">
        <nuxt-link
          to="/"
          class="max-md:hidden">
          <logo class="h-40 w-40" />
        </nuxt-link>
      </div>
      <main class="p-4">
        <slot />
      </main>
    </content-view>
  </div>
</template>
