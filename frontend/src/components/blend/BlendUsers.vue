<script setup lang="ts">
  import z from 'zod';
  import type { FormError } from '#ui/types';
  import { IconPlus } from '@tabler/icons-vue';
  import useFriends from '~/composables/query/friends.ts';
  import NameField from '~/components/ui/NameField.vue';
  import { breakpointsTailwind } from '@vueuse/core';
  import useUser from '~/composables/user.ts';

  interface Props {
    submitted: (data: string[]) => Promise<void> | void;
    nested?: boolean;
  }
  type Emits = {
    submitted: [names: string[]]
  }

  // Setup
  const { nested = false } = defineProps<Props>();
  const emits = defineEmits<Emits>();
  const { user } = useUser();
  const names = defineModel<string[]>({ default: () => [] })
  const { data: friends } = useFriends(names);
  const { greaterOrEqual } = useBreakpoints(breakpointsTailwind);
  const md = greaterOrEqual('md');

  // Form data
  interface Fields {
    names: string[];
  }
  const schema = z.object({
    names: z.array(z.string().nonempty()),
  });

  // Helper
  async function validateForm(state: Partial<Fields>): Promise<FormError[]> {
    const errors: FormError[] = [];
    const validity = await Promise.all(
      state.names!.map((n) => validateLetterboxdName(n)),
    );
    state.names!.forEach((name, idx) => {
      if (!validity[idx]) {
        errors.push({
          name: `names.${idx}`,
          message: 'User must be valid Letterboxd name.'
        })
      }
      if (state.names!.indexOf(name) !== state.names!.lastIndexOf(name)) {
        errors.push({
          name: `names.${idx}`,
          message: 'User must be unique.'
        })
      }
    });
    return errors;
  }
  function removeName(idx: number) {
    names.value = [...names.value.slice(0, idx), ...names.value.slice(idx + 1)];
  }
  function addName() {
    names.value.push('');
  }
  function submit() {
    emits('submitted', names.value);
  }

  onBeforeMount(() => {
    names.value = [user.value ?? ''];
  })
</script>

<template>
  <UForm class="flex flex-col gap-2" :validate="validateForm" :schema="schema" :on-submit="submit" :nested="nested">
    <UFormField v-for="(_, idx) in names" :key="idx" :error-pattern="RegExp(`^names.${idx}$`)">
      <NameField v-model="names[idx]" :items="friends" :show-add-button="md" @remove="removeName(idx)" @add="addName" />
    </UFormField>
    <UButton v-if="!md" :icon="IconPlus" @click="addName" />
    <UButton v-if="!nested">
      Submit
    </UButton>
  </UForm>
</template>
