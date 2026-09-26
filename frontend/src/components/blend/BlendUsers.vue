<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types';
  import { IconPlus } from '@tabler/icons-vue';
  import useFriends from '~/composables/query/friends.ts';
  import NameField from '~/components/ui/NameField.vue';
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import { type RoomUsers, usersSchema } from '~/types/room.ts';

  interface Props {
    nested?: boolean;
  }
  type Emits = {
    submitted: [names: string[]]
  }

  const MAX_NAMES = 5;
  const MIN_NAMES = 2;

  // Setup
  const { nested = false } = defineProps<Props>();
  const emits = defineEmits<Emits>();
  const { greaterOrEqual } = useBreakpoints(breakpointsTailwind);
  const md = greaterOrEqual('md');

  // Form data
  const state = defineModel<Partial<RoomUsers>>({
    default: () => ({ users: [] }),
  });
  const users = computed(() => state.value.users ?? [])
  const { data: friends } = useFriends(users);

  const canAdd = computed(() => users.value.length < MAX_NAMES);
  const canRemove = computed(() => users.value.length > MIN_NAMES);

  // Helper
  async function validateForm(state: Partial<RoomUsers>): Promise<FormError[]> {
    const errors: FormError[] = [];

    const validity = await Promise.all(state.users!.map((n) => validateLetterboxdName(n)));
    state.users!.forEach((name, idx) => {
      if (!name.length) return;
      if (!validity[idx]) {
        errors.push({
          name: `users.${idx}`,
          message: 'User must be valid Letterboxd name.'
        })
      }
      if (state.users!.indexOf(name) !== state.users!.lastIndexOf(name)) {
        errors.push({
          name: `users.${idx}`,
          message: 'User must be unique.'
        })
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
</script>

<template>
  <UForm v-if="state.users" :nested="nested" :state="nested ? undefined : state" :schema="usersSchema" :validate="validateForm" :on-submit="submit" class="flex flex-col gap-2">
    <UFormField v-for="(_, idx) in state.users" :key="idx" :name="`users.${idx}`" :error-pattern="RegExp(`^users\.^${idx}$`)">
      <NameField v-model="state.users![idx]" :items="friends ?? []" :show-add-button="md && idx === state.users.length - 1" :can-add="canAdd" :can-remove="canRemove" @remove="removeName(idx)" @add="addName" />
    </UFormField>
    <UButton v-if="!md" :icon="IconPlus" :disabled="!canAdd" label="Add" class="justify-center font-bold" size="lg" @click="addName" />
    <UButton v-if="!nested" class="justify-center font-bold uppercase" size="xl">
      Submit
    </UButton>
  </UForm>
</template>
