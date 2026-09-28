<script setup lang="ts">
  import { IconShare } from '@tabler/icons-vue';

  const { normal } = useNotify();

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
    class="justify-center md:w-64 md:gap-2 md:px-3 md:py-2"
    color="info"
    size="md"
    label="Share"
    :icon="IconShare"
    @click="share" />
</template>
