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

  // Setup
  interface FormResult {
    name: string[];
  }
  const router = useRouter();

  // Constants
  const USER_COLLAPSE_COUNT = 3;

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
        title="Settings"
        :collapsable="isSmall"
        :collapsed-default="false">
        <info-message class="mx-auto mb-4 w-full lg:mb-8">
          Configure your blend as you'd like it.
        </info-message>
        <blend-settings ref="settingsForm" />
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
