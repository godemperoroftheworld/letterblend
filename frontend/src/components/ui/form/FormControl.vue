<script setup lang="ts" generic="T extends PropertyKey">
  import {
    ErrorMessage,
    Field,
    type FieldContext,
    useFormContext,
    useSetFormValues,
  } from 'vee-validate';
  import type { FieldProps } from './types';
  import LabeledValue from '../LabeledValue.vue';
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';
  import type { UnwrapNestedRefs } from 'vue';

  const props = withDefaults(defineProps<FieldProps<T>>(), {
    validateOnBlur: true,
    validateOnInput: false,
    validateOnChange: true,
    validateOnModelUpdate: false,
    labelSize: 'sm',
  });

  const fieldRef = ref<UnwrapNestedRefs<FieldContext>>();
  const loading = computed(() => fieldRef.value?.meta.pending);
  const touched = computed(() => fieldRef.value?.meta.touched);
  const errored = computed(() => !!fieldRef.value?.errorMessage);

  const formContext = useFormContext();
  const model = defineModel<T>();
  watch(model, async (val) => {
    fieldRef.value?.setTouched(true);
    fieldRef.value?.setValue(val);
    // const { errors, valid } = await fieldRef.value?.validate();
    // fieldRef.value?.setErrors(errors);
    // if (fieldRef.value?.meta) {
    //   fieldRef.value.meta.valid = valid;
    // }
  });
  onMounted(() => {
    model.value = fieldRef.value?.value;
  });
</script>

<template>
  <div class="relative">
    <labeled-value
      :name="name"
      :label="label"
      :label-size="labelSize"
      :uppercase="uppercase"
      :errored="touched && errored"
      :success="touched && !errored">
      <field
        ref="fieldRef"
        class="w-64 max-w-full"
        :name="name"
        :rules="rules">
        <component
          :is="as"
          v-bind="{ ...$props, ...$attrs }"
          v-model="model" />
      </field>
      <div
        v-show="loading"
        class="absolute top-0 right-2 bottom-0 my-auto h-6 w-6">
        <loading-icon />
      </div>
    </labeled-value>
    <error-message
      v-show="touched"
      class="absolute right-0 -bottom-0.5 translate-y-full text-right text-xs text-red-600"
      :name="name" />
  </div>
</template>
