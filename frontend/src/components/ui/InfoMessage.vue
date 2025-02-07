<script setup lang="ts">
  import { IconInfoCircle } from '@tabler/icons-vue';
</script>

<template>
  <div
    class="border-info text-info flex items-center justify-center gap-2 rounded border-2 p-2 text-center">
    <icon-info-circle />
    <span class="w-fit cursor-default"><slot /></span>
  </div>
</template>
