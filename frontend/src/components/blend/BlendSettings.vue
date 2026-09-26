<script setup lang="ts">
  import noop from 'lodash/noop';
  import  { type RoomSettings, settingsSchema } from '@/types/room';
  import { DEFAULT_SETTINGS, ROOM_SETTINGS, ROOM_SETTINGS_MAP, type RoomSettingsKey } from '~/constants/room-settings.ts';
  import { assign } from 'lodash';

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
    submitted?: (data: RoomSettings) => Promise<void> | void;
    nested?: boolean;
    submitButtonText?: string;
  }
  const {
    submitted = noop,
    nested = false,
    submitButtonText = 'Submit',
  } = defineProps<Props>();
  const settings = defineModel<Partial<RoomSettings>>({ default: () => DEFAULT_SETTINGS });

  const presetSetting = ref<RoomSettingsKey>('default');
  watch(presetSetting, (val) => {
    assign(settings.value, ROOM_SETTINGS_MAP[val]);
  });
</script>

<template>
  <UForm class="flex flex-col gap-2" :schema="settingsSchema" :state="nested ? undefined : settings" :nested="nested" @submit="submitted">
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
    <UTooltip text="The number of films in the blend.">
      <UFormField name="top" label="Top">
        <UInputNumber v-model="settings.top" size="lg" />
      </UFormField>
    </UTooltip>
    <UTooltip text="How many users need the film in their watchlist">
      <UFormField name="threshold" label="Threshold">
        <div>
          <USlider v-model="settings.threshold" size="lg" :min="0" :max="1" :step="0.01" :format-options="{ style: 'percent' }" />
          <div class="absolute text-white right-0 -top-1 -translate-y-full">
            {{
              settings.threshold?.toLocaleString('en-CA', {
                style: 'percent',
                maximumFractionDigits: 1,
              })
            }}
          </div>
        </div>
      </UFormField>
    </UTooltip>
    <UFormField name="genre" label="Genre">
      <USelect v-model="settings.genre" size="lg" class="w-full" :items="GENRE_OPTIONS" multiple />
    </UFormField>
    <UButton v-if="!nested" type="submit" :label="submitButtonText" />
  </UForm>
</template>
