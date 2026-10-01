<script setup lang="ts">
  import { IconEdit, IconInfoCircle } from '@tabler/icons-vue';

  type Emits = {
    submitted: [names: string[]];
  };

  const emits = defineEmits<Emits>();
  const open = defineModel<boolean>('open', { default: false });
  const users = defineModel<string[]>('users', { default: () => [] });
  const state = computed({
    get: () => ({ users: users.value }),
    set: (value) => (users.value = value.users),
  });

  function usersSubmitted(names: string[]) {
    emits('submitted', names);
  }
</script>

<template>
  <UModal
    v-model:open="open"
    title="Update Users">
    <UButton
      color="secondary"
      :icon="IconEdit"
      size="md"
      label="Edit"
      @click="open = true" />
    <template #body>
      <UAlert
        class="mx-auto mb-4"
        :icon="IconInfoCircle"
        color="info"
        variant="subtle"
        title="Updating the users for the room will re-compute the blend. This action is irreversible." />
      <BlendUsers
        v-model="state"
        @submitted="usersSubmitted" />
    </template>
  </UModal>
</template>
