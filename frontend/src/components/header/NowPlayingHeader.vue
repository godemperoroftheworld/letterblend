<script setup lang="ts">
  import BulbRow from '~/components/header/BulbRow.vue';
  import LetterboxdIcon from '~/components/ui/icons/LetterboxdIcon.vue';

  interface Props {
    canCollapse?: boolean;
  }
  const { canCollapse = false } = defineProps<Props>();

  const COLLAPSE_HEIGHT = 60;

  const { y } = useWindowScroll();

  const { height } = useWindowSize();
  const scrollHeight = computedWithControl(
    height,
    () => document.scrollingElement?.scrollHeight ?? 0,
  );

  const shouldCollapse = computed(() => {
    if (!canCollapse) return false;
    // If collapsing will lower us below scroll height, don't (prevents weird jiggly thing)
    if (scrollHeight.value - height.value <= COLLAPSE_HEIGHT) {
      return false;
    }
    return !!y.value;
  });
</script>

<template>
  <div class="bg-dark drop-shadow-dark/50 flex w-full flex-col py-2 drop-shadow md:h-56">
    <BulbRow class="mb-2" />
    <div
      class="from-paper/25 via-dark to-dark flex grow flex-col items-center justify-around bg-linear-to-b from-[1px] via-[1px] bg-size-[100%_20px] select-none max-md:gap-3">
      <span
        ref="screeningText"
        :class="{ hidden: shouldCollapse }"
        class="text-bulb drop-shadow-round-lg drop-shadow-bulb/50 font-mono font-medium uppercase">
        Now Screening
      </span>
      <ULink
        to="/"
        as="div"
        :class="{ 'flex-col': !shouldCollapse, 'gap-2': shouldCollapse }"
        class="flex grow items-center justify-center">
        <LetterboxdIcon
          ref="icon"
          class="h-6 md:h-10"
          shadow />
        <h1
          class="drop-shadow-round-lg text-3xl leading-none font-bold text-white drop-shadow-white/50 md:text-4xl">
          Letterblend
        </h1>
      </ULink>
      <span class="text-default text-sm sm:hidden">
        Blend together your Letterboxd watchlists!
      </span>
    </div>
    <div class="absolute top-8 left-4">
      <slot name="left" />
    </div>
    <div class="absolute top-8 right-4">
      <slot name="right" />
    </div>
    <BulbRow class="mt-2" />
  </div>
</template>
