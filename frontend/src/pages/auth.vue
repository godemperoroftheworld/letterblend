<template>
  <card-view
    class="h-fit"
    title="Sign In">
    <name-form @submitted="submitted" />
  </card-view>
</template>

<script setup lang="ts">
  import CardView from '@/components/ui/CardView.vue';
  import useUser from '@/composables/user';
  import NameForm from '@/components/user/NameForm.vue';

  const route = useRoute();
  const router = useRouter();
  const { exists } = useUser();
  const redirect = computed<string>(() => {
    return (route.query.redirect as string) ?? route.redirectedFrom?.fullPath ?? '/';
  });
  function submitted() {
    router.replace(redirect.value);
  }

  onMounted(() => {
    if (exists.value) {
      router.replace(redirect.value);
    }
  });
</script>
