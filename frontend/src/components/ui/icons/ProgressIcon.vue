<script setup lang="ts">
  interface Props {
    timeMs: number;
    enable: boolean;
    loop?: boolean;
    loopDelay?: number;
  }
  const props = defineProps<Props>();

  const progress = ref<number>(0);
  let interval: ReturnType<typeof setTimeout>;
  let delay: ReturnType<typeof setTimeout>;

  const progressStep = computed(() => 5000 / props.timeMs);
  function updateProgress() {
    progress.value = progress.value + progressStep.value;
    if (progress.value >= 100) {
      progress.value = 0;
      endProgress();
    }
  }
  function endProgress() {
    clearInterval(interval);
    if (props.loop) {
      delay = setTimeout(beginProgress, props.loopDelay ?? 0);
    }
  }
  function beginProgress() {
    progress.value = 0;
    interval = setInterval(updateProgress, 50);
  }
  function clearProgress() {
    clearInterval(interval);
    clearTimeout(delay);
  }

  watch(
    () => props.enable,
    (val) => {
      clearProgress();
      if (val) {
        beginProgress();
      }
    },
  );
  onMounted(() => {
    if (props.enable) {
      beginProgress();
    }
  });
  onBeforeUnmount(clearProgress);
</script>

<template>
  <div class="relative">
    <svg
      class="aspect-square min-h-full min-w-full -rotate-90"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg">
      <!-- Background Circle -->
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        class="stroke-current text-inherit"
        stroke-width="2"></circle>
      <!-- Progress Circle -->
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        class="text-info stroke-current"
        stroke-width="2.1"
        stroke-dasharray="100"
        :stroke-dashoffset="100 - progress"
        stroke-linecap="round"></circle>
    </svg>
  </div>
</template>
