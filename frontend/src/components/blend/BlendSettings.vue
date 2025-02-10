<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { number } from 'yup';
  import FormView from '@/components/ui/form/FormView.vue';
  import noop from 'lodash/noop';
  import type { RoomSettings } from '@/types/room';

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
    values: () => ({ top: 10, threshold: 0.6 }),
  });

  const settingsForm = ref();
  watch(
    () => props.values,
    (val) => {
      settingsForm.value?.update(val);
    },
  );

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
      },
      threshold: {
        as: InputField,
        label: 'Threshold',
        rules: number().required().min(0).max(1),
        props: {
          step: 0.1,
          type: 'number',
        },
      },
    }"
    :defaults="values"
    :show-submit-button="showSubmitButton"
    :submit-button-text="submitButtonText"
    :submitted="submitted" />
</template>
