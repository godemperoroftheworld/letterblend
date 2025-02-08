<script setup lang="ts">
  import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
  import { useCycleList } from '@vueuse/core';
  import LabeledImage, { type LabeledImageProps } from '@/components/ui/LabeledImage.vue';
  import ProgressIcon from '@/components/icons/ProgressIcon.vue';

  interface Props {
    slides: LabeledImageProps[];
    autoplay?: number;
  }
  const props = defineProps<Props>();
  const { state, next, prev, index } = useCycleList(props.slides);

  const steps = computed(() => props.slides.length);
  const prevIndex = computed(() => {
    return index.value === 0 ? steps.value - 1 : index.value - 1;
  });
  const prevState = computed(() => {
    return props.slides[prevIndex.value];
  });
  const nextIndex = computed(() => {
    return index.value + 1 === steps.value ? 0 : index.value + 1;
  });
  const nextState = computed(() => {
    return props.slides[nextIndex.value];
  });

  // Autoplay
  let autoplayTimer: ReturnType<typeof setTimeout>;
  function doAutoplay() {
    clearTimeout(autoplayTimer);
    if (props.autoplay) {
      autoplayTimer = setTimeout(() => {
        goNext();
        doAutoplay();
      }, props.autoplay);
    }
  }

  // Navigation animation
  const clicked = ref(false);
  const goingNext = ref(false);
  let nextTimer: ReturnType<typeof setTimeout>;
  function goNext() {
    goingNext.value = true;
    clearTimeout(nextTimer);
    nextTimer = setTimeout(() => {
      next();
      goingNext.value = false;
    }, 300);
  }
  const goingBack = ref(false);
  let backTimer: ReturnType<typeof setTimeout>;
  function goBack() {
    goingBack.value = true;
    clearTimeout(backTimer);
    backTimer = setTimeout(() => {
      prev();
      goingBack.value = false;
    }, 300);
  }

  onMounted(doAutoplay);
  watch(() => props.autoplay, doAutoplay);
  watch(clicked, (val) => {
    if (val) clearTimeout(autoplayTimer);
  });
  onBeforeUnmount(() => {
    clearTimeout(backTimer);
    clearTimeout(nextTimer);
    clearTimeout(autoplayTimer);
  });
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    @click.prevent="clicked = true"
    @keyup.enter="clicked = true">
    <button
      class="bg-content absolute top-1/2 left-0 z-10 -translate-y-1/2 cursor-pointer rounded-full p-1.5"
      @click.prevent="goBack"
      @keyup.enter="goBack">
      <icon-chevron-left class="h-8 w-8" />
    </button>
    <div
      class="slider-content relative h-full w-full px-8"
      :class="{ 'go-next': goingNext, 'go-back': goingBack }">
      <labeled-image
        class="slider-prev absolute top-0 -left-8 -translate-x-full px-8"
        :title="`(${prevIndex + 1}) ${prevState.title}`"
        :image="prevState.image"
        :description="prevState.description" />
      <labeled-image
        :title="`(${index + 1}) ${state.title}`"
        :image="state.image"
        :description="state.description" />
      <labeled-image
        class="slider-next absolute top-0 -right-8 translate-x-full px-8"
        :title="`(${nextIndex + 1}) ${nextState.title}`"
        :image="nextState.image"
        :description="nextState.description" />
    </div>
    <template v-if="autoplay != null">
      <div class="absolute top-1/2 right-0 max-h-10 max-w-10 -translate-y-1/2 cursor-pointer">
        <button
          class="bg-content z-10 cursor-pointer rounded-full p-1"
          @click.prevent="goNext"
          @keyup.enter="goNext">
          <icon-chevron-right class="h-8 w-8" />
        </button>
        <progress-icon
          class="text-content absolute top-0.5 -left-1 -z-10 h-12 w-12 -translate-y-full"
          :enable="!clicked"
          :time-ms="autoplay"
          loop />
      </div>
    </template>
    <template v-else>
      <button
        class="button bg-content absolute top-1/2 right-0 z-10 -translate-y-1/2 cursor-pointer rounded-full p-1"
        @click.prevent="goNext"
        @keyup.enter="goNext">
        <icon-chevron-right class="h-8 w-8" />
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .slider-content:not(.go-next):not(.go-back) {
    & > .slider-next,
    .slider-prev {
      display: none;
    }
  }

  .slider-content.go-next {
    animation: slide-left 300ms ease;
    transform: translateX(-100%);

    & > .slider-next {
      right: 0;
    }
  }

  .slider-content.go-back {
    animation: slide-right 300ms ease;
    transform: translateX(100%);

    & > .slider-prev {
      left: 0;
    }
  }

  @keyframes slide-left {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  @keyframes slide-right {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
