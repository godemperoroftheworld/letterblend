<template>
  <card-view title="Sign In">
    <name-form @submitted="submitted" />
  </card-view>
</template>
<script setup lang="ts">
  import CardView from '@/components/ui/CardView.vue';
  import useUser from '@/composables/user';

  const route = useRoute();
  const router = useRouter();
  const { isSet } = useUser();
  const redirect = computed<string>(() => {
    return (route.query.redirect as string) ?? route.redirectedFrom?.fullPath ?? '/';
  });
  function submitted() {
    router.replace(redirect.value);
  }

  onMounted(() => {
    if (isSet.value) {
      router.replace(redirect.value);
    }
  });
</script>
