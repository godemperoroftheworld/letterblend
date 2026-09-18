<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import type { FormExpose } from '@/components/ui/form/FormView.vue';
  import type { FormObject } from '@/components/ui/form/types';
  import { computedDeep } from '@/utils/computed';
  import { useAddRoom } from '@/composables/mutation/room';
  import BlendUsers from '@/components/blend/BlendUsers.vue';
  import type { RoomSettings } from '@/types/room';
  import isEqual from 'lodash/isEqual';
  import { IconArrowUp, IconArrowDown, IconInfoCircle } from '@tabler/icons-vue';

  // Setup
  interface FormResult {
    name: string[];
  }
  const router = useRouter();
  const { success } = useNotify();

  // Constants
  const USER_COLLAPSE_COUNT = 3;
  const JUST_PICK_SETTINGS: RoomSettings = {
    top: 1,
    threshold: 1,
    genre: [],
    decade: [],
  };
  const SOME_OPTIONS_SETTINGS: RoomSettings = {
    top: 15,
    threshold: 0.5,
    genre: [],
    decade: [],
  };
  const SOMETHING_COMFORTING: RoomSettings = {
    top: 3,
    threshold: 0.75,
    genre: ['adventure', 'family'],
    decade: [],
  };
  const PRESET_OPTIONS = [
    { label: 'Just Pick One', id: 'justpick', value: JUST_PICK_SETTINGS },
    { label: 'Wide Open', id: 'wideopen', value: SOME_OPTIONS_SETTINGS },
    { label: 'Family Adventure', id: 'comfort', value: SOMETHING_COMFORTING },
  ];

  // Functions
  const { mutateAsync: addRoom } = useAddRoom();
  async function submitted({ name }: FormResult) {
    const room = await addRoom({ users: name, settings: settingsValues.value });
    await router.push(`/room/${room.code}`);
    success({
      title: 'Room Created',
      message: 'Successfully created blend',
    });
  }

  // Collapsable settings
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');

  // Settings presets
  const presetSettings = ref<RoomSettings>();
  const settingsCollapsed = ref(false);

  // Form Data
  const userForm = ref<{ data: FormExpose<FormObject> }>();
  const settingsForm = ref<{ data: FormExpose<FormObject> }>();
  const userNames = computed<string[]>(() => userForm.value?.data.values?.name ?? []);
  const userValid = computedDeep(() => !!userForm.value?.data.valid);
  const settingsValid = computedDeep(() => !!settingsForm.value?.data.valid);
  const settingsValues = computedDeep(() => settingsForm.value?.data.values);

  watch(userNames, (val, oldVal) => {
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
  watch(
    settingsValues,
    (val) => {
      if (!isEqual(val, presetSettings.value)) {
        presetSettings.value = {};
      }
    },
    { deep: true },
  );
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative flex w-full items-stretch gap-4 max-md:flex-col">
      <UCard
        title="Users"
        class="basis-2/3">
        <UAlert class="mx-auto mb-4 w-full lg:mb-8" :icon="IconInfoCircle">
          Enter your friend's usernames. There can be up to five of you.
        </UAlert>
        <blend-users
          ref="userForm"
          :submitted="submitted"
          :show-submit-button="false" />
      </UCard>
      <UCard
        class="basis-1/3"
        title="Blend Type">
        <template #header v-if="isSmall">
            <Component
              @click="settingsCollapsed = !settingsCollapsed"
              :is="settingsCollapsed ? IconArrowDown : IconArrowUp"
              class="cursor-pointer aspect-square" />
        </template>
        <template #body v-if="!settingsCollapsed">
          <div class="flex flex-col items-center gap-4">
            <info-message class="w-full"> Configure your blend as you'd like it. </info-message>
            <UFormField label="Presets">
              <USelect
                v-model="presetSettings"
                class="w-64! max-w-full"
                value-key="id"
                label-key="label"
                :items="PRESET_OPTIONS" />
            </UFormField>
            <span class="bg-paper h-0.5 w-full shrink-0 grow rounded-sm" />
            <blend-settings
              ref="settingsForm"
              class="max-w-full"
              :values="presetSettings" />
          </div>
        </template>
      </UCard>
    </div>
    <UButton
      name="submit"
      text="Submit"
      button-style="submit"
      class="max-sm:w-full sm:w-64"
      :loading="userForm?.data.submitting"
      :disabled="!userValid || !settingsValid"
      @keyup.enter="userForm?.data.submit()"
      @click.prevent="userForm?.data.submit()" />
  </div>
</template>
