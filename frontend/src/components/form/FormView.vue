<script setup lang="ts" generic="T extends FormObject">
  import { Form as ValidatedForm, type FormContext, type SubmissionHandler } from 'vee-validate';
  import { computed, type UnwrapNestedRefs } from 'vue';
  import TextButton from '@/components/TextButton.vue';
  import FormControl from '@/components/form/FormControl.vue';
  import type { FieldProps, FormObject, FormProps, FormValueType } from '@/components/form/types';
  import isEmpty from 'lodash/isEmpty';

  export interface FormEmits<T> {
    (e: 'submitted', values: T): void;
    (e: 'cancelled'): void;
  }
  const props = withDefaults(defineProps<FormProps<T>>(), {
    cancelButtonText: 'Cancel',
    showSubmitButton: true,
  });
  const emits = defineEmits<FormEmits<T>>();

  const keys = computed(() => Object.keys(props.fields) as Array<keyof T>);

  function getFieldProps(key: keyof T) {
    return props.fields[key] as Omit<FieldProps<PropertyKey>, 'name'>;
  }
  async function onSubmit(values: T) {
    await props.submitted(values as FormValueType<T>);
    emits('submitted', values);
  }

  const formRef = ref<UnwrapNestedRefs<FormContext>>();
  const values = computed(() => formRef.value?.values as T);
  const isValid = computed(() => formRef.value?.meta.valid);

  defineExpose({
    valid: isValid,
    values: values,
    submit: () => formRef.value?.$el.requestSubmit(),
  });
</script>

<template>
  <validated-form
    v-slot="{ isSubmitting, errorBag, errors, values, meta }"
    ref="formRef"
    :name="name"
    :initial-values="defaults"
    class="flex flex-col items-center gap-4"
    @submit="onSubmit as SubmissionHandler">
    <template
      v-for="key in keys"
      :key="key">
      <form-control
        :name="String(key)"
        :empty="!values[key]"
        :errored="!!errorBag[key]?.length"
        :success="!errorBag[key]?.length"
        v-bind="getFieldProps(key)" />
    </template>
    <div
      v-if="showSubmitButton || showCancelButton"
      class="mt-2 flex justify-between text-center"
      :class="{ 'w-full': showCancelButton && showSubmitButton }">
      <text-button
        v-if="showCancelButton"
        type="danger"
        :text="cancelButtonText"
        @click.prevent="emits('cancelled')" />
      <text-button
        v-if="showSubmitButton"
        :disabled="!isEmpty(errors)"
        :loading="isSubmitting"
        type="submit"
        text="Submit" />
    </div>
  </validated-form>
</template>
