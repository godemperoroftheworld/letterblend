<script setup lang="ts">
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import { breakpointsTailwind, useLocalStorage } from '@vueuse/core';
  import NoSparklesIcon from '@/components/ui/icons/NoSparklesIcon.vue';
  import NowPlayingHeader from '~/components/header/NowPlayingHeader.vue';

  interface Props {
    cardSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  }
  const { cardSize } = defineProps<Props>();

  const route = useRoute();
  const router = useRouter();
  const { current } = useBreakpoints(breakpointsTailwind);
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });

  const sizes = current();
  const isHome = computed(() => route.path === '/');
  const isCardSize = computed(() => {
    if (cardSize) {
      return sizes.value.includes(cardSize);
    }
    return true;
  });
</script>

<template>
  <div class="flex h-full flex-col">
    <NowPlayingHeader>
      <template #left>
        <UButton
          v-if="!isHome"
          class="w-fit -translate-y-1"
          variant="subtle"
          color="neutral"
          size="md"
          :icon="IconArrowBack"
          label="Back"
          @click="router.back" />
      </template>
      <template #right>
        <USwitch
          v-model="particlesEnabled"
          color="dark"
          size="xl"
          :checked-icon="IconSparkles"
          :unchecked-icon="NoSparklesIcon" />
      </template>
    </NowPlayingHeader>
    <UContainer class="flex grow flex-col py-2 sm:py-4 lg:py-6">
      <UCard
        v-if="isCardSize"
        class="mx-auto max-w-full"
        variant="solid">
        <main class="flex flex-col">
          <slot />
        </main>
      </UCard>
      <main
        v-else
        class="relative flex h-full flex-col">
        <slot />
      </main>
      <UFooter class="mt-auto">
        <span class="font-mono text-slate-300">
          Letterblend is independent, not affiliated with Letterboxd
        </span>
      </UFooter>
    </UContainer>
  </div>
</template>
