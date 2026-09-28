<script setup lang="ts">
  import { type RoomSettings, settingsSchema } from '@/types/room';
  import {
    DEFAULT_SETTINGS,
    ROOM_SETTINGS,
    ROOM_SETTINGS_MAP,
    type RoomSettingsKey,
  } from '~/constants/room-settings.ts';
  import type { FormSubmitEvent } from '#ui/types';

  // Constant
  const GENRE_OPTIONS = [
    'action',
    'adventure',
    'animation',
    'comedy',
    'crime',
    'documentary',
    'drama',
    'family',
    'fantasy',
    'history',
    'horror',
    'music',
    'mystery',
    'romance',
    'science-fiction',
    'thriller',
    'tv-movie',
    'war',
    'western',
  ];

  // Setup
  interface Props {
    nested?: boolean;
    submitButtonText?: string;
    presets?: boolean;
  }
  type Emits = {
    submitted: [settings: RoomSettings];
  };
  const { nested = false, submitButtonText = 'Submit', presets = true } = defineProps<Props>();
  const emits = defineEmits<Emits>();
  const settings = defineModel<Partial<RoomSettings>>({ default: () => DEFAULT_SETTINGS });

  function submitted(event: FormSubmitEvent<RoomSettings>) {
    emits('submitted', event.data);
  }

  const presetSetting = ref<RoomSettingsKey>('default');
  watch(presetSetting, (val) => {
    Object.assign(settings.value, ROOM_SETTINGS_MAP[val]);
  });
</script>

<template>
  <UForm
    class="flex flex-col gap-2"
    :schema="settingsSchema"
    :state="nested ? undefined : settings"
    :nested="nested"
    @submit="submitted">
    <template v-if="presets">
      <UFormField label="Presets">
        <USelect
          v-model="presetSetting"
          class="w-full"
          value-key="id"
          label-key="label"
          size="lg"
          :items="ROOM_SETTINGS" />
      </UFormField>
      <span class="bg-paper h-0.5 w-full shrink-0 grow rounded-sm" />
    </template>
    <UFormField
      name="top"
      label="Top"
      description="The number of films in the blend">
      <UInputNumber
        v-model="settings.top"
        class="w-full"
        size="lg" />
    </UFormField>
    <UFormField
      name="threshold"
      label="Threshold"
      description="What percentage of users need the film in their watchlist">
      <div>
        <USlider
          v-model="settings.threshold"
          class="mb-1"
          size="lg"
          :min="0"
          :max="1"
          :step="0.01"
          :format-options="{ style: 'percent' }" />
        <div class="absolute -top-1 right-0 -translate-y-full text-white">
          {{
            settings.threshold?.toLocaleString('en-CA', {
              style: 'percent',
              maximumFractionDigits: 1,
            })
          }}
        </div>
      </div>
    </UFormField>
    <UFormField
      name="genre"
      label="Genre"
      description="What genres you'd like to watch. Movies must match all entered">
      <USelect
        v-model="settings.genre"
        size="lg"
        class="w-full"
        :items="GENRE_OPTIONS"
        multiple />
    </UFormField>
    <UButton
      v-if="!nested"
      type="submit"
      :label="submitButtonText"
      color="secondary"
      class="justify-center"
      size="lg" />
  </UForm>
</template>
