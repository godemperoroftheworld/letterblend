<script setup lang="ts">
  import { useBlend } from '@/composables/query/blend';

  const route = useRoute();
  const top = computed(() => Number(route.query.top));
  const threshold = computed(() => Number(route.query.threshold));
  const names = computed(() => (route.query.names as string).split(','));
  const { data: result } = useBlend(names, {
    top,
    threshold,
    data: false,
  });

  watch(result, (val) => {
    console.log(JSON.stringify(val));
  });
  onMounted(() => {
    console.log('names: ' + names.value);
  });
</script>

<template>TEST</template>
