<script setup lang="ts">
  import NameForm from '@/components/user/NameForm.vue';

  const router = useRouter();
</script>

<template>
  <Ticket />
  <NameForm class="max-w-xl mx-auto" @submitted="router.push({ name: 'create' })" />
</template>
