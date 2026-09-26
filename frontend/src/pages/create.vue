<script setup lang="ts">
  import { useAddRoom } from '@/composables/mutation/room';
  import BlendUsers from '@/components/blend/BlendUsers.vue';
  import { IconInfoCircle } from '@tabler/icons-vue';
  import type { FormSubmitEvent } from '#ui/types';
  import  { type RoomSettings, type RoomUsers, settingsSchema, usersSchema } from '~/types/room.ts';
  import useUser from '~/composables/user.ts';
  import { DEFAULT_SETTINGS } from '~/constants/room-settings.ts';
  import z from 'zod';

  type Schema = Partial<RoomSettings & RoomUsers>;
  const schema = z.object({
    ...usersSchema.shape,
    ...settingsSchema.shape
  })

  // Setup
  const router = useRouter();
  const { success } = useNotify();
  const { user } = useUser();

  const state = reactive<Schema>({
    users: [user.value, ''],
    ...DEFAULT_SETTINGS,
  });

  // Functions
  const { mutateAsync: addRoom } = useAddRoom();
  async function submitted(event: FormSubmitEvent<Required<Schema>>) {
    const { users, ...settings } = event.data;
    const room = await addRoom({ users, settings });
    await router.push(`/room/${room.code}`);
    success({
      title: 'Room Created',
      message: 'Successfully created blend',
    });
  }
</script>

<template>
  <UForm class="flex flex-col items-center gap-4 mt-8" :schema="schema" :state="state" @submit="submitted">
    <div class="relative flex w-full items-stretch gap-4 max-md:flex-col">
      <UCard
        title="Users"
        class="basis-1/2">
        <UAlert class="mx-auto mb-4 w-full lg:mb-8" color="info" :icon="IconInfoCircle" title="Enter your friend's usernames. There can be up to five of you." variant="subtle" />
        <blend-users v-model="state" nested />
      </UCard>
      <UCard
        class="basis-1/2"
        title="Blend Type">
          <div class="flex flex-col items-center gap-4">
            <UAlert color="info" :icon="IconInfoCircle" title="Configure your blend as you'd like it" variant="subtle" />
            <BlendSettings
              v-model="state"
              class="max-w-full"
              nested />
          </div>
      </UCard>
    </div>
    <UButton
      type="submit"
      label="Submit"
      class="max-sm:w-full sm:w-64 uppercase font-bold justify-center"
      size="xl" />
  </UForm>
</template>
