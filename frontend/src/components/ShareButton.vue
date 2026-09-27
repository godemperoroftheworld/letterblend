<script setup lang="ts">
  import { IconShare } from '@tabler/icons-vue';
  import { breakpointsTailwind } from '@vueuse/core';

  const { normal } = useNotify();
  const { greaterOrEqual } = useBreakpoints(breakpointsTailwind);

  const isMedium = greaterOrEqual('md');

  function share() {
    const data: ShareData = {
      title: 'Check out my Letterblend!',
      url: window.location.href,
    };
    if ('canShare' in navigator && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      navigator.clipboard.writeText(window.location.href);
      normal({
        title: 'Copied to clipboard',
        message: 'Room code copied to clipboard.',
      });
    }
  }
</script>

<template>
  <UButton
    name="share"
    class="justify-center md:w-64"
    color="info"
    :size="isMedium ? 'lg' : 'md'"
    label="Share"
    :icon="IconShare"
    @click="share" />
</template>
