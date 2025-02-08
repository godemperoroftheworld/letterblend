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
  <div
    class="relative flex h-full min-h-fit w-full flex-grow flex-col gap-2 overflow-hidden p-2 md:gap-4 lg:gap-8 lg:p-8">
    <div class="right-0 -mb-15 ml-auto flex h-15 flex-col sm:hidden">
      <toggle-view
        v-model="particlesEnabled"
        :icon="IconSparkles" />
    </div>
    <content-view class="mx-auto h-fit w-fit md:hidden">
      <nuxt-link
        to="/"
        class="mx-auto w-fit">
        <logo class="h-36 w-36" />
      </nuxt-link>
    </content-view>
    <content-view class="mx-auto my-auto h-fit min-h-3/4 w-full max-w-screen-xl flex-grow">
      <generic-button
        v-show="!isHome"
        class="absolute top-4 left-4 z-1 max-sm:fixed max-sm:min-w-fit sm:w-40 lg:top-8 lg:left-8"
        button-style="hollow"
        @click.prevent="router.back"
        @keyup.enter="router.back">
        <icon-arrow-back />
        <span class="max-sm:hidden">Back</span>
      </generic-button>
      <div class="absolute top-0 right-0 z-10 w-fit p-4 max-sm:hidden">
        <toggle-view
          v-model="particlesEnabled"
          :icon="IconSparkles" />
      </div>
      <nuxt-link
        to="/"
        class="mx-auto hidden w-fit md:block">
        <logo class="h-40 w-40" />
      </nuxt-link>
      <main
        class="relative flex flex-grow place-content-stretch content-stretch items-stretch text-white md:mt-0 lg:p-4">
        <slot />
      </main>
    </content-view>
  </div>
</template>

<style scoped lang="scss">
  main > * {
    width: 100%;
  }
</style>
