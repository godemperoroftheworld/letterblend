<script setup lang="ts" generic="T extends FormObject">
  import { Form as ValidatedForm, type FormContext, type SubmissionHandler } from 'vee-validate';
  import { computed, type UnwrapNestedRefs } from 'vue';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import FormControl from '@/components/ui/form/FormControl.vue';
  import type {
    FieldProps,
    FormObject,
    FormProps,
    FormValueType,
  } from '@/components/ui/form/types';
  import isEmpty from 'lodash/isEmpty';
  import isEqual from 'lodash/isEqual';
  import FormArray from '@/components/ui/form/FormArray.vue';
  import type { PartialDeep } from 'type-fest';

  // Setup
  export interface FormExpose<T> {
    valid: boolean;
    validating: boolean;
    submitting: boolean;
    values: T;
    submit: () => void;
  }
  export interface FormEmits<T> {
    (e: 'submitted', values: T): void;
    (e: 'cancelled'): void;
  }
  interface FormRef extends UnwrapNestedRefs<FormContext> {
    $el: HTMLFormElement;
  }
  const props = withDefaults(defineProps<FormProps<T>>(), {
    cancelButtonText: 'Cancel',
    submitButtonText: 'Submit',
    showSubmitButton: true,
  });
  const emits = defineEmits<FormEmits<T>>();

  // State
  const keys = computed(() => Object.keys(props.fields) as Array<keyof T>);
  const isSubmitting = ref(false);

  // Form values
  const formRef = ref<FormRef>();
  const values = computed(() => formRef.value?.values as T);
  const isValid = computed(() => {
    return isEmpty(formRef.value?.errors);
  });
  const isValidating = computed(() => !!formRef.value?.isValidating);

  // Helpers
  function getField(key: keyof T) {
    return props.fields[key] as Omit<FieldProps<T[keyof T]>, 'name'>;
  }
  async function onSubmit(values: T) {
    isSubmitting.value = true;
    try {
      await props.submitted(values as FormValueType<T>);
    } finally {
      isSubmitting.value = false;
    }
    emits('submitted', values);
  }

  // Expose
  defineExpose({
    valid: isValid,
    values,
    validating: isValidating,
    submitting: isSubmitting,
    update: (values: PartialDeep<T>) => formRef.value?.setValues(values),
    submit: () => formRef.value?.$el.requestSubmit(),
  });
</script>

<template>
  <validated-form
    v-slot="{ errors }"
    ref="formRef"
    :name="name"
    :initial-values="defaults"
    class="relative flex flex-col items-center justify-between"
    @submit="onSubmit as SubmissionHandler">
    <div class="flex w-fit max-w-full flex-col gap-5">
      <template
        v-for="key in keys"
        :key="key">
        <template v-if="getField(key).array">
          <form-array
            :array-key="key"
            :length="getField(key).length"
            :field-props="getField(key)"
            :loading="loading">
            <template #beforeField="{ value }">
              <slot
                name="beforeField"
                :value="value as PropertyKey" />
            </template>
          </form-array>
        </template>
        <template v-else>
          <div class="max-w-full shrink">
            <slot
              name="beforeField"
              :value="null" />
            <form-control
              :name="String(key)"
              v-bind="getField(key)"
              :loading="loading" />
          </div>
        </template>
      </template>
    </div>
    <div
      v-if="showSubmitButton || showCancelButton"
      class="mt-5 flex max-w-full justify-between text-center"
      :class="{ 'w-full': showCancelButton && showSubmitButton }">
      <text-button
        v-if="showCancelButton"
        class="w-64"
        button-style="danger"
        :text="cancelButtonText"
        :loading="loading"
        @click.prevent="emits('cancelled')" />
      <text-button
        v-if="showSubmitButton"
        class="w-64"
        :disabled="!isEmpty(errors)"
        :loading="loading || isSubmitting"
        button-style="submit"
        :text="submitButtonText"
        @click="formRef?.$el.requestSubmit()" />
    </div>
  </validated-form>
</template>
