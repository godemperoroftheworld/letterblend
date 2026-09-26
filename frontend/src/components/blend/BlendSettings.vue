<script setup lang="ts">
  import noop from 'lodash/noop';
  import type { RoomSettings } from '@/types/room';
  import z from 'zod';
  import { DEFAULT_SETTINGS, ROOM_SETTINGS, ROOM_SETTINGS_MAP, type RoomSettingsKey } from '~/constants/room-settings.ts';

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
    loading?: boolean;
  }
  const {
    submitted = noop,
    nested = false,
    submitButtonText = 'Submit',
  } = defineProps<Props>();
  const settings = defineModel<RoomSettings>({ default: () => DEFAULT_SETTINGS });
  const presetSetting = ref<RoomSettingsKey>('default');
  const schema = z.object({
    rules: z.number().min(1).max(30),
    threshold: z.number().min(0).max(1),
  });

  watch(presetSetting, (val) => {
    settings.value = ROOM_SETTINGS_MAP[val];
  })
</script>

<template>
  <UForm :schema="schema" :on-submit="submitted">
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
        <UInputNumber size="lg" v-model="settings.top" />
      </UFormField>
    </UTooltip>
    <UTooltip text="How many users need the film in their watchlist">
      <UFormField name="threshold" label="Threshold">
        <UInputNumber size="lg" v-model="settings.threshold" :step="0.01" :format-options="{ style: 'percent' }" :min="0" :max="1" />
      </UFormField>
    </UTooltip>
    <UFormField name="genre" label="Genre">
      <USelect size="lg" v-model="settings.genre" class="w-full" :items="GENRE_OPTIONS" multiple />
    </UFormField>
    <UButton v-if="!nested">
      {{ submitButtonText }}
    </UButton>
  </UForm>
</template>
