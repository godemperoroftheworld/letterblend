<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints, useLocalStorage } from '@vueuse/core';
  import FormView, { type FormExpose } from '@/components/ui/form/FormView.vue';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import NameField from '@/components/ui/NameField.vue';
  import CardView, { type CardExpose } from '@/components/ui/CardView.vue';
  import type { FormObject } from '@/components/ui/form/types';
  import { computedDeep } from '@/utils/computed';
  import { useDataQuery } from '@/utils/query';
  import { queryClient } from '@/plugins/query';
  import { uniq } from 'lodash';
  import InfoMessage from '@/components/ui/InfoMessage.vue';
  import { useAddRoom } from '@/composables/mutation/room';

  // Setup
  interface FormResult {
    name: string[];
  }
  const router = useRouter();
  const storageName = useLocalStorage('user', '');

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
  const userForm = ref<FormExpose<FormObject>>();
  const settingsForm = ref<FormExpose<FormObject>>();
  const userNames = computed<string[]>(() => userForm.value?.values?.name ?? []);
  const userValid = computedDeep(() => !!userForm.value?.valid);
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

  // Autocomplete
  const fixedNames = computed(() => {
    return uniq([
      storageName.value,
      ...userNames.value
        .filter((u) => !!u)
        .filter((u) => {
          const value = queryClient.getQueryData(['exists', u]);
          return value ? value.exists : false;
        }),
    ]);
  });
  const { data: friends } = useDataQuery(['friends', storageName, fixedNames], '/user/friends', {
    config: {
      method: 'POST',
      data: { names: fixedNames },
    },
    transform: (data) => Object.keys(data),
  });
</script>

<template>
  <div class="flex flex-col items-center gap-2 md:gap-4 lg:gap-8">
    <div class="grid w-full flex-grow gap-2 md:gap-4 lg:grid-cols-5 lg:gap-8">
      <card-view
        title="Users"
        class="min-h-fit lg:col-span-3">
        <info-message class="w-full max-w-sm">
          Enter your friend's usernames. There can be up to five of you.
        </info-message>
        <form-view
          ref="userForm"
          name="userForm"
          :fields="{
            name: {
              as: NameField,
              rules: validateLetterboxdName,
              validateOnMount: true,
              props: {
                options: friends ?? [],
                debounceMs: 200,
              },
              array: true,
              length: { min: 2, max: 5 },
            },
          }"
          :show-submit-button="false"
          :defaults="{ name: [storageName, ''] }"
          :submitted="submitted">
        </form-view>
      </card-view>
      <card-view
        ref="collapsableSettings"
        title="Settings"
        :collapsable="isSmall"
        :collapsed-default="false"
        class="flex-shrink-0 lg:col-span-2">
        <info-message class="w-full max-w-sm">Configure your blend as you'd like it.</info-message>
        <blend-settings ref="settingsForm" />
      </card-view>
    </div>
    <text-button
      text="Submit"
      button-style="submit"
      class="w-64 max-md:my-4"
      :loading="userForm?.submitting"
      :disabled="!userValid || !settingsValid"
      @keyup.enter="userForm?.submit()"
      @click.prevent="userForm?.submit()" />
  </div>
</template>
