<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { number } from 'yup';
  import FormView from '@/components/ui/form/FormView.vue';
  import noop from 'lodash/noop';
  import type { BlendParams } from '@/composables/query/blend';

  export type BlendSettings = Omit<BlendParams, 'details'>;
  interface Props {
    submitted?: (data: BlendSettings) => Promise<void>;
    showSubmitButton?: boolean;
    loading?: boolean;
  }
  withDefaults(defineProps<Props>(), { submitted: noop, showSubmitButton: false });

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
        type: 'number',
        rules: number().required().min(1).max(100),
      },
      threshold: {
        as: InputField,
        label: 'Threshold',
        step: 0.1,
        type: 'number',
        rules: number().required().min(0).max(1),
      },
    }"
    :defaults="{ top: 10, threshold: 0.6 }"
    :show-submit-button="showSubmitButton"
    :submitted="submitted" />
</template>
