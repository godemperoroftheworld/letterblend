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
  import FormArray from '@/components/ui/form/FormArray.vue';
  import AccordionView from '@/components/ui/AccordionView.vue';
  import { computedDeep } from '@/utils/computed';

  export interface FormExpose<T> {
    valid: boolean;
    validating: boolean;
    values: T;
    submit: () => void;
  }
  export interface FormEmits<T> {
    (e: 'submitted', values: T): void;
    (e: 'cancelled'): void;
  }
  const props = withDefaults(defineProps<FormProps<T>>(), {
    cancelButtonText: 'Cancel',
    showSubmitButton: true,
  });
  const emits = defineEmits<FormEmits<T>>();

  const keys = computed(
    () => Object.keys(props.fields).filter((k) => !props.fields[k].advanced) as Array<keyof T>,
  );
  const advancedKeys = computed(
    () => Object.keys(props.fields).filter((k) => !!props.fields[k].advanced) as Array<keyof T>,
  );

  async function onSubmit(values: T) {
    await props.submitted(values as FormValueType<T>);
    emits('submitted', values);
  }

  const formRef = ref<UnwrapNestedRefs<FormContext>>();
  const values = computed(() => formRef.value?.values as T);
  const isValid = computed(() => isEmpty(formRef.value?.errors));
  const isValidating = computed(() => !!formRef.value?.isValidating);

  function getField(key: keyof T) {
    return props.fields[key] as Omit<FieldProps<T[keyof T]>, 'name'>;
  }

  defineExpose({
    valid: isValid,
    values,
    validating: isValidating,
    submit: () => formRef.value?.$el.requestSubmit(),
  });
</script>

<template>
  <validated-form
    v-slot="{ isSubmitting, errors }"
    ref="formRef"
    :name="name"
    :initial-values="defaults"
    class="flex flex-col items-center justify-between"
    @submit="onSubmit as SubmissionHandler">
    <div class="flex max-w-full shrink flex-grow flex-col items-center gap-5">
      <template
        v-for="key in keys"
        :key="key">
        <template v-if="fields[key as keyof typeof fields].array">
          <form-array
            :array-key="key"
            :length="getField(key).length"
            :field-props="getField(key)">
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
              v-bind="getField(key)" />
          </div>
        </template>
      </template>
      <accordion-view
        v-if="advancedKeys.length"
        class="mt-4 w-96"
        :name="`${name}-advanced`"
        label="Advanced Fields">
        <div class="flex flex-col gap-4">
          <template
            v-for="key in advancedKeys"
            :key="key">
            <template v-if="getField(key).array">
              <form-array
                :array-key="key"
                :field-props="getField(key)"
                :length="getField(key).length" />
            </template>
            <template v-else>
              <form-control
                :name="String(key)"
                v-bind="getField(key)" />
            </template>
          </template>
        </div>
      </accordion-view>
    </div>
    <div
      v-if="showSubmitButton || showCancelButton"
      class="mt-5 flex justify-between text-center"
      :class="{ 'w-full': showCancelButton && showSubmitButton }">
      <text-button
        v-if="showCancelButton"
        class="w-40"
        button-style="danger"
        :text="cancelButtonText"
        @click.prevent="emits('cancelled')" />
      <text-button
        v-if="showSubmitButton"
        class="w-40"
        :disabled="!isEmpty(errors)"
        :loading="isSubmitting"
        button-style="submit"
        text="Submit"
        @click="formRef.$el.requestSubmit()" />
    </div>
  </validated-form>
</template>
