<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import { useAddRoom } from '@/composables/mutation/room';
  import BlendUsers from '@/components/blend/BlendUsers.vue';
  import type { RoomSettings } from '@/types/room';
  import { IconArrowUp, IconArrowDown, IconInfoCircle } from '@tabler/icons-vue';
  import { DEFAULT_SETTINGS } from '~/constants/room-settings.ts';
  import { ref } from 'vue';

  // Setup
  const router = useRouter();
  const { success } = useNotify();

  // Constants
  const USER_COLLAPSE_COUNT = 3;

  // Functions
  const { mutateAsync: addRoom } = useAddRoom();
  async function submitted() {
    const room = await addRoom({ users: names.value, settings: settings.value });
    await router.push(`/room/${room.code}`);
    success({
      title: 'Room Created',
      message: 'Successfully created blend',
    });
  }

  // Collapsable settings
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');
  const settingsCollapsed = ref(false);

  // Form Data
  const names = ref(['']);
  const settings = ref<RoomSettings>(DEFAULT_SETTINGS);

  watch(names, (val, oldVal) => {
    if (val.length < oldVal.length) {
      if (val.length < USER_COLLAPSE_COUNT) {
        settingsCollapsed.value = false;
      }
    } else {
      if (val.length >= USER_COLLAPSE_COUNT) {
        settingsCollapsed.value = true;
      }
    }
  });
</script>

<template>
  <UForm class="flex flex-col items-center gap-4 mt-12">
    <div class="relative flex w-full items-stretch gap-4 max-md:flex-col">
      <UCard
        title="Users"
        class="basis-2/3">
        <UAlert class="mx-auto mb-4 w-full lg:mb-8" color="info" :icon="IconInfoCircle" title="Enter your friend's usernames. There can be up to five of you." variant="subtle" />
        <blend-users
          v-model="names"
          :submitted="submitted"
          nested />
      </UCard>
      <UCard
        class="basis-1/3"
        title="Blend Type">
        <template v-if="isSmall" #header>
            <Component
              :is="settingsCollapsed ? IconArrowDown : IconArrowUp"
              class="cursor-pointer aspect-square"
              @click="settingsCollapsed = !settingsCollapsed" />
        </template>
        <template v-if="!settingsCollapsed" #default>
          <div class="flex flex-col items-center gap-4">
            <UAlert color="info" :icon="IconInfoCircle" title="Configure your blend as you'd like it" variant="subtle" />
            <blend-settings
              v-model="settings"
              class="max-w-full"
              nested />
          </div>
        </template>
      </UCard>
    </div>
    <UButton
      label="Submit"
      class="max-sm:w-full sm:w-64" />
  </UForm>
</template>
