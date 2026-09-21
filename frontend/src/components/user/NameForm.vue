<script setup lang="ts">
  import { validateLetterboxdName } from '@/utils/validate';
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import useUser from '@/composables/user';
  import { IconInfoCircle } from '@tabler/icons-vue';
  import { UForm, UInput } from '#components';
  import z from 'zod';
  import type { ComponentExposed } from 'vue-component-type-helpers';
  import isEmpty from 'lodash/isEmpty';

  interface NameForm {
    name: string;
  }
  const emits = defineEmits(['submitted']);

  const { user: storedName } = useUser();

  const userForm = useTemplateRef<ComponentExposed<typeof UForm>>('formRef');
  const errors = ref({});

  const schema = z.object({
    name: z.string().nonempty().refine( validateLetterboxdName, { message: 'No such letterboxd user found'}),
  });
  const state = reactive<NameForm>({
    name: '',
  })

  async function submitted({ name }: NameForm) {
    storedName.value = name;
    emits('submitted');
  }
</script>

<template>
  <div class="flex h-full flex-col justify-center gap-4">
      <div class="flex items-center justify-center gap-4">
      <LetterboxdAvatar
        class="w-32 min-w-24 grow-0 max-sm:w-20 lg:w-40"
        :name="state.name"
        fallback />
        <UForm
          ref="formRef"
          class="flex h-full flex-col justify-center gap-4 max-w-xl"
          :schema="schema"
          :state="state"
          :validate-on="[]"
          @submit="(e) => submitted(e.data)">
          <UFormField
            label="Enter your Letterboxd Username"
            name="name">
            <UInput v-model="state.name" />
          </UFormField>
        </UForm>
      </div>
      <UAlert color="info" variant="subtle" class="mx-auto" :icon="IconInfoCircle">
        <template #description>
          Don't have an account? That's ok, make one
          <a
            class="font-bold underline"
            href="https://letterboxd.com/?register=true"
            target="_blank">
            here
          </a>
        </template>
      </UAlert>
      <UButton
        name="submit"
        class="mx-auto w-64 uppercase text-xl text-center"
        :disabled="!isEmpty(errors)"
        @keyup.enter="userForm?.submit()"
        @click.prevent="userForm?.submit()">
        Submit
      </UButton>
  </div>
</template>
