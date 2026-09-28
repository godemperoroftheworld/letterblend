<script setup lang="ts">
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import NoSparklesIcon from '@/components/ui/icons/NoSparklesIcon.vue';
  import NowPlayingHeader from '~/components/header/NowPlayingHeader.vue';

  const route = useRoute();
  const router = useRouter();
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });

  const isHome = computed(() => route.path === '/');
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
    <UContainer class="flex grow flex-col sm:py-2 lg:py-4">
      <UCard
        :ui="{
          root: 'max-lg:bg-transparent! shadow-none! border-0! inset-shadow-none!',
        }"
        class="mx-auto max-w-full"
        variant="solid">
        <main class="flex flex-col">
          <slot />
        </main>
      </UCard>
      <UFooter
        class="mt-auto"
        :ui="{ center: 'flex-col gap-1 font-mono' }">
        <div class="text-center text-xs text-slate-300">
          Letterblend is independent, not affiliated with
          <a
            class="underline"
            href="https://letterboxd.com"
            target="_blank"
            >Letterboxd</a
          >.
        </div>
        <UButton
          as="div"
          variant="link"
          target="_blank"
          size="sm"
          href="https://ko-fi.com/t2pellet">
          Support me on Ko-Fi.
        </UButton>
      </UFooter>
    </UContainer>
  </div>
</template>
