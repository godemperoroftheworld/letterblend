<script setup lang="ts">
  import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
  import { useCycleList } from '@vueuse/core';
  import LabeledImage, { type LabeledImageProps } from '@/components/ui/LabeledImage.vue';
  import ProgressIcon from '@/components/ui/icons/ProgressIcon.vue';

  interface Props {
    slides: LabeledImageProps[];
    autoplay?: number;
  }
  const props = defineProps<Props>();
  const { state, next, prev, index, go } = useCycleList(props.slides);

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

  // Pagination
  const count = computed(() => props.slides.length);

  // Navigation
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

  // Listeners
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
    class="slider-content relative flex items-center justify-center px-11"
    :class="{ 'go-next': goingNext, 'go-back': goingBack }"
    @click.prevent="clicked = true"
    @keyup.enter="clicked = true">
    <button
      class="bg-content absolute top-1/2 left-0 z-10 -translate-y-1/2 cursor-pointer rounded-full p-1.5"
      name="back"
      @click.prevent="goBack"
      @keyup.enter="goBack">
      <icon-chevron-left class="h-8 w-8" />
    </button>
    <labeled-image
      class="slider-prev absolute h-[calc(100%-2rem)] w-full -translate-x-full px-11"
      :title="`${prevState.title}`"
      :image="prevState.image"
      :description="prevState.description" />
    <labeled-image
      class="slider-current h-[calc(100%-2rem)]"
      :title="`${state.title}`"
      :image="state.image"
      :description="state.description" />
    <labeled-image
      class="slider-next absolute h-[calc(100%-2rem)] w-full translate-x-full px-11"
      :title="`${nextState.title}`"
      :image="nextState.image"
      :description="nextState.description" />
    <div class="absolute top-1/2 right-0 max-h-11 max-w-11 -translate-y-1/2 cursor-pointer">
      <button
        class="bg-content z-1 cursor-pointer rounded-full p-1"
        name="next"
        @click.prevent="goNext"
        @keyup.enter="goNext">
        <icon-chevron-right class="h-8 w-8" />
      </button>
      <progress-icon
        v-if="autoplay"
        class="text-content absolute top-0.5 -left-1 -z-10 h-12 w-12 -translate-y-full"
        :enable="!clicked"
        :time-ms="autoplay"
        loop />
    </div>
    <div class="absolute right-1/2 bottom-0 left-1/2 flex h-2.5 w-max -translate-x-1/2 gap-1">
      <span
        v-for="idx in count"
        :key="idx"
        :class="{ '!bg-white': idx === index + 1 }"
        class="bg-paper inline-block h-2.5 w-2.5 cursor-pointer rounded-full"
        @click="go(idx - 1)" />
    </div>
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
    & > .slider-next {
      animation: slide-left 300ms ease;
      transform: translateX(-100%);
    }

    & > .slider-current {
      animation:
        slide-left 300ms ease,
        fade 300ms ease;
      transform: translateX(-100%);
      opacity: 0;
    }

    & > .slider-prev {
      display: none;
    }
  }

  .slider-content.go-back {
    & > .slider-prev {
      animation: slide-right 300ms ease;
      transform: translateX(100%);
    }

    & > .slider-current {
      animation:
        slide-right 300ms ease,
        fade 300ms ease;
      transform: translateX(100%);
      opacity: 0;
    }

    & > .slider-next {
      display: none;
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
  @keyframes fade {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
