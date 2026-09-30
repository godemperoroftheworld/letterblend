<script setup lang="ts">
  import { IconArrowBack, IconSparkles } from '@tabler/icons-vue';
  import NoSparklesIcon from '@/components/ui/icons/NoSparklesIcon.vue';
  import NowPlayingHeader from '~/components/header/NowPlayingHeader.vue';

  interface Props {
    stickyHeader?: boolean;
    showBackButton?: boolean;
  }
  const { stickyHeader = false, showBackButton = true } = defineProps<Props>();

  const router = useRouter();
  const particlesEnabled = useLocalStorage('particles', true, { initOnMounted: true });
</script>

<template>
  <div class="flex h-full flex-col">
    <NowPlayingHeader
      :can-collapse="stickyHeader"
      :class="{ 'sticky top-0 z-2': stickyHeader }">
      <template #left>
        <UButton
          v-if="showBackButton"
          class="w-fit"
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
    <UContainer class="flex grow flex-col pt-4 xl:pt-6">
      <UCard
        :ui="{
          root: 'max-lg:bg-transparent! max-lg:shadow-none! max-lg:border-0! max-lg:inset-shadow-none!',
          body: 'max-lg:p-0!',
        }"
        class="mx-auto max-w-full"
        variant="solid">
        <main class="flex flex-col">
          <slot />
        </main>
      </UCard>
    </UContainer>
    <UFooter
      class="mt-auto"
      :ui="{ center: 'flex-col lg:gap-2 font-mono' }">
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
  </div>
</template>
