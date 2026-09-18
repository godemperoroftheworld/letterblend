<script setup lang="ts">
  import { IconEdit, IconInfoCircle } from '@tabler/icons-vue';

  interface Props {
    loading?: boolean;
    users?: string[];
  }
  type Emits = {
    submitted: [names: string[]]
  }

  const { loading = false, users = [] } = defineProps<Props>();
  const emits = defineEmits<Emits>();
  const open = defineModel<boolean>('open', { default: false });

  function usersSubmitted(names: string[]) {
    emits('submitted', names);
  }
</script>

<template>
  <UModal v-model:open="open">
    <UButton
      name="editUsers"
      class="absolute top-3.5 right-4 min-w-0! p-1! px-2! text-sm!"
      button-style="hollow"
      @click="open = true">
      <icon-edit class="size-5" />
      <span class="max-sm:hidden">Edit</span>
    </UButton>
    <template #body>
      <UAlert class="mx-auto mb-4" :icon="IconInfoCircle">
        Updating the users for the room will re-compute the blend. This action is irreversible.
      </UAlert>
      <blend-users
        :loading="loading"
        :values="users"
        :submitted="usersSubmitted" />
    </template>
  </UModal>
</template>