<script setup lang="ts" generic="T extends FormObject">
  import {
    FieldArray,
    Form as ValidatedForm,
    type FormContext,
    type SubmissionHandler,
  } from 'vee-validate';
  import { computed, type UnwrapNestedRefs } from 'vue';
  import TextButton from '@/components/TextButton.vue';
  import FormControl from '@/components/form/FormControl.vue';
  import type { FieldProps, FormObject, FormProps, FormValueType } from '@/components/form/types';
  import isEmpty from 'lodash/isEmpty';
  import { IconPlus, IconTrash } from '@tabler/icons-vue';

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
    class="flex flex-col items-center justify-between"
    @submit="onSubmit as SubmissionHandler">
    <div class="flex flex-col items-center gap-4">
      <template
        v-for="key in keys"
        :key="key">
        <template v-if="fields[key].array">
          <field-array
            v-slot="{ fields: arrayFields, push, remove }"
            :name="String(key)">
            <template
              v-for="(entry, idx) in arrayFields"
              :key="entry.key">
              <div class="relative flex items-center gap-4">
                <form-control
                  :name="`${String(key)}[${idx}]`"
                  v-bind="fields[key] as FieldProps" />
                <div class="absolute -right-4 bottom-0 flex h-full w-fit translate-x-full gap-2">
                  <icon-button
                    type="danger"
                    :disabled="arrayFields.length < 3"
                    :icon="IconTrash"
                    @click="remove(idx)" />
                  <icon-button
                    v-if="idx + 1 === arrayFields.length"
                    type="submit"
                    :icon="IconPlus"
                    @click="push('')" />
                </div>
              </div>
            </template>
          </field-array>
        </template>
        <template v-else>
          <form-control
            :name="String(key)"
            v-bind="fields[key] as FieldProps" />
        </template>
      </template>
    </div>
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
