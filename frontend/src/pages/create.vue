<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import type { FormExpose } from '@/components/ui/form/FormView.vue';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import CardView, { type CardExpose } from '@/components/ui/CardView.vue';
  import type { FormObject } from '@/components/ui/form/types';
  import { computedDeep } from '@/utils/computed';
  import InfoMessage from '@/components/ui/InfoMessage.vue';
  import { useAddRoom } from '@/composables/mutation/room';
  import BlendUsers from '@/components/blend/BlendUsers.vue';
  import AccordionView from '@/components/ui/AccordionView.vue';
  import type { RoomSettings } from '@/types/room';
  import LabeledValue from '@/components/ui/LabeledValue.vue';
  import MultiselectView from '@/components/ui/MultiselectView.vue';

  // Setup
  interface FormResult {
    name: string[];
  }
  const router = useRouter();

  // Constants
  const USER_COLLAPSE_COUNT = 3;
  const JUST_PICK_SETTINGS: RoomSettings = {
    top: 1,
    threshold: 1,
  };
  const SOME_OPTIONS_SETTINGS: RoomSettings = {
    top: 5,
    threshold: 0.5,
  };
  const PRESET_OPTIONS = [
    { label: 'Just Pick One', id: JUST_PICK_SETTINGS },
    { label: 'Give Me Some Options', id: SOME_OPTIONS_SETTINGS },
  ];

  // Functions
  const { mutateAsync: addRoom } = useAddRoom();
  async function submitted({ name }: FormResult) {
    const settingsValues = settingsForm.value?.data.values;
    const room = await addRoom({ users: name, settings: settingsValues });
    await router.push(`/room/${room.code}`);
  }

  // Collapsable settings
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');
  const collapsableSettings = ref<CardExpose>();

  // Settings presets
  const presetSettings = ref<RoomSettings>();

  // Form Data
  const userForm = ref<{ data: FormExpose<FormObject> }>();
  const settingsForm = ref<{ data: FormExpose<FormObject> }>();
  const userNames = computed<string[]>(() => userForm.value?.data.values?.name ?? []);
  const userValid = computedDeep(() => !!userForm.value?.data.valid);
  const settingsValid = computedDeep(() => !!settingsForm.value?.data.valid);
  watch(userNames, (val, oldVal) => {
    if (val.length < oldVal.length) {
      if (val.length < USER_COLLAPSE_COUNT) {
        collapsableSettings.value?.setCollapsed(false);
      }
    } else {
      if (val.length >= USER_COLLAPSE_COUNT) {
        collapsableSettings.value?.setCollapsed(true);
      }
    }
  });
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative flex w-full items-stretch gap-4 max-md:flex-col">
      <card-view
        title="Users"
        class="basis-2/3">
        <info-message class="mx-auto mb-4 w-full lg:mb-8">
          Enter your friend's usernames. There can be up to five of you.
        </info-message>
        <blend-users
          ref="userForm"
          :submitted="submitted"
          :show-submit-button="false" />
      </card-view>
      <card-view
        ref="collapsableSettings"
        class="basis-1/3"
        title="Blend Type"
        :collapsable="isSmall"
        :collapsed-default="false">
        <div class="flex flex-col items-center gap-4">
          <info-message class="w-full"> Configure your blend as you'd like it. </info-message>
          <labeled-value
            label-size="sm"
            name="presets"
            label="Presets">
            <multiselect-view
              v-model="presetSettings"
              class="!w-64 max-w-full"
              track-by="value"
              label="label"
              :options="PRESET_OPTIONS" />
          </labeled-value>
          <blend-settings
            ref="settingsForm"
            :values="presetSettings" />
        </div>
      </card-view>
    </div>
    <text-button
      text="Submit"
      button-style="submit"
      class="max-sm:w-full sm:w-64"
      :loading="userForm?.data.submitting"
      :disabled="!userValid || !settingsValid"
      @keyup.enter="userForm?.data.submit()"
      @click.prevent="userForm?.data.submit()" />
  </div>
</template>
