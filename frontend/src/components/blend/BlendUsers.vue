<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types';
  import { IconPlus } from '@tabler/icons-vue';
  import useFriends from '~/composables/query/friends.ts';
  import NameField from '~/components/ui/NameField.vue';
  import { type RoomUsers, usersSchema, MAX_USERS, MIN_USERS } from '~/types/room.ts';
  import useUser from '~/composables/user.ts';
  import { keepPreviousData } from '@tanstack/vue-query';

  interface Props {
    nested?: boolean;
  }
  type Emits = {
    submitted: [names: string[]];
  };

  // Setup
  const { nested = false } = defineProps<Props>();
  const emits = defineEmits<Emits>();
  const { user } = useUser();

  // Form data
  const state = defineModel<Partial<RoomUsers>>({
    default: () => ({ users: ['', ''] }),
  });

  const users = computed<string[]>(() => state.value.users ?? []);
  const isEditing = ref(false);
  const { data: friends } = useFriends(users, {
    enabled: () => !isEditing.value,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const canAdd = computed(() => users.value.length < MAX_USERS);
  const canRemove = computed(() => users.value.length > MIN_USERS);

  // Helper
  async function validateForm(state: Partial<RoomUsers>): Promise<FormError[]> {
    const errors: FormError[] = [];

    const validity = await Promise.all(state.users!.map((n) => validateLetterboxdName(n)));
    state.users!.forEach((name, idx) => {
      if (!name.length) return;
      if (!validity[idx]) {
        errors.push({
          name: `users.${idx}`,
          message: 'User must be valid Letterboxd name.',
        });
      }
      if (state.users!.indexOf(name) !== state.users!.lastIndexOf(name)) {
        errors.push({
          name: `users.${idx}`,
          message: 'User must be unique.',
        });
      }
    });

    return errors;
  }
  function removeName(idx: number) {
    state.value.users!.splice(idx, 1);
  }
  function addName() {
    state.value.users!.push('');
  }
  function submit(event: FormSubmitEvent<RoomUsers>) {
    emits('submitted', event.data.users);
  }

  onMounted(async () => {
    if (!users.value[0]) {
      users.value[0] = user.value;
    }
  });
</script>

<template>
  <UForm
    v-if="state.users"
    :nested="nested"
    :state="nested ? undefined : state"
    :schema="usersSchema"
    :validate="validateForm"
    :validate-on="['blur', 'input']"
    :on-submit="submit"
    class="mx-auto flex w-fit flex-col gap-2">
    <UFormField
      v-for="(_, idx) in state.users"
      :key="idx"
      :name="`users.${idx}`"
      :error-pattern="RegExp(`^users\.^${idx}$`)">
      <NameField
        v-model="state.users![idx]"
        :items="friends ?? []"
        :show-add-button="idx === state.users.length - 1"
        :can-add="canAdd"
        :can-remove="canRemove"
        @remove="removeName(idx)"
        @add="addName"
        @focus="isEditing = true"
        @blur="isEditing = false" />
    </UFormField>
    <UButton
      :icon="IconPlus"
      :disabled="!canAdd"
      label="Add"
      class="justify-center font-bold max-md:inline-flex md:hidden"
      size="lg"
      @click="addName" />
    <UButton
      v-if="!nested"
      type="submit"
      class="justify-center"
      size="xl">
      Submit
    </UButton>
  </UForm>
</template>
