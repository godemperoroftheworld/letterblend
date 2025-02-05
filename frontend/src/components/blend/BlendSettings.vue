<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { number } from 'yup';
  import FormView from '@/components/ui/form/FormView.vue';
  import noop from 'lodash/noop';

  const settingsForm = ref();
  defineExpose({ data: settingsForm });
</script>

<template>
  <form-view
    ref="settingsForm"
    name="settingsForm"
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
    :show-submit-button="false"
    :submitted="noop" />
</template>
