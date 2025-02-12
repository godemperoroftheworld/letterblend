<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { number } from 'yup';
  import FormattedInput from '@/components/ui/FormattedInput.vue';
  import FormView from '@/components/ui/form/FormView.vue';
  import noop from 'lodash/noop';
  import type { RoomSettings } from '@/types/room';
  import MultiselectView from '@/components/ui/MultiselectView.vue';

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

  interface Props {
    submitted?: (data: RoomSettings) => Promise<void> | void;
    showSubmitButton?: boolean;
    submitButtonText?: string;
    loading?: boolean;
    values?: RoomSettings;
  }
  const props = withDefaults(defineProps<Props>(), {
    submitted: () => noop,
    showSubmitButton: false,
    submitButtonText: 'Submit',
    values: () => ({ top: 10, threshold: 0.6, genre: [] }),
  });
  const settingsForm = ref();
  defineExpose({ data: settingsForm });
</script>

<template>
  <form-view
    ref="settingsForm"
    name="settingsForm"
    :loading="loading"
    :fields="{
      top: {
        as: InputField,
        label: 'Count',
        rules: number().required().min(1).max(100),
        props: {
          type: 'number',
        },
        tooltip: 'The number of films in the blend.',
      },
      threshold: {
        as: FormattedInput,
        label: 'Threshold',
        rules: number().required().min(0).max(1),
        props: {
          format: '0,00.00%',
          percent: true,
        },
        tooltip: 'Percentage of users that need the film in their watchlist.',
      },
      genre: {
        as: MultiselectView,
        label: 'Genre',
        props: {
          options: GENRE_OPTIONS,
          multiple: true,
        },
      },
    }"
    :defaults="values"
    :show-submit-button="showSubmitButton"
    :submit-button-text="submitButtonText"
    :submitted="submitted" />
</template>
