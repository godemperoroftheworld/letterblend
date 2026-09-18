<script setup lang="ts">
  import NameForm from '@/components/user/NameForm.vue';

  const router = useRouter();
</script>

<template>
  <div class="relative flex items-stretch gap-4 max-md:flex-col">
    <UCard
      title="Get Started"
      justify="center"
      class="basis-3/5">
      <name-form @submitted="router.push({ name: 'create' })" />
    </UCard>
  </div>
</template>
