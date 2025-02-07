<script setup lang="ts">
  import Logo from '@/components/ui/LogoView.vue';
  import GenericButton from '@/components/ui/button/GenericButton.vue';
  import { IconArrowBack } from '@tabler/icons-vue';
  import ContentView from '@/components/ui/ContentView.vue';

  const route = useRoute();
  const router = useRouter();
  const isHome = computed(() => route.path === '/');
</script>

<template>
  <div
    class="relative flex h-full min-h-fit w-full flex-grow flex-col gap-2 overflow-hidden p-2 md:gap-4 lg:gap-8 lg:p-8">
    <content-view class="mx-auto h-fit w-fit md:hidden">
      <router-link
        to="/"
        class="mx-auto w-fit">
        <logo class="h-36 w-36" />
      </router-link>
    </content-view>
    <content-view class="mx-auto my-auto h-fit min-h-3/4 w-full max-w-screen-xl flex-grow">
      <generic-button
        v-show="!isHome"
        class="absolute top-4 left-4 z-1 w-40 max-sm:w-24 lg:top-8 lg:left-8"
        button-style="hollow"
        @click.prevent="router.back"
        @keyup.enter="router.back">
        <icon-arrow-back />
        <span class="max-sm:hidden">Back</span>
      </generic-button>
      <router-link
        to="/"
        class="mx-auto hidden w-fit md:block">
        <logo class="h-40 w-40" />
      </router-link>
      <main
        class="relative flex flex-grow place-content-stretch content-stretch items-stretch overflow-scroll text-white md:mt-0 lg:p-4">
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
