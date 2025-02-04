<script setup lang="ts" generic="T extends PropertyKey">
  import { ErrorMessage, Field, type FieldContext } from 'vee-validate';
  import type { FieldProps } from './types';
  import LabeledValue from '../LabeledValue.vue';
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';
  import type { UnwrapNestedRefs } from 'vue';

  withDefaults(defineProps<FieldProps<T>>(), {
    validateOnBlur: true,
    validateOnInput: false,
    validateOnChange: false,
  });
  const fieldRef = ref<UnwrapNestedRefs<FieldContext>>();
  const touched = computed(() => fieldRef.value?.meta.touched);
  const errored = computed(() => !!fieldRef.value?.errorMessage);

  watch(
    () => !!fieldRef.value?.value,
    (val) => {
      console.log('value: ' + val);
      if (val) {
        fieldRef.value?.setTouched(true);
      }
    },
  );
</script>

<template>
  <div>
    <labeled-value
      :name="name"
      :label="label"
      :uppercase="uppercase"
      :errored="touched && errored"
      :success="touched && !errored">
      <field ref="fieldRef" />
      <div
        v-if="touched && fieldRef?.meta.pending"
        class="absolute top-0 right-2 bottom-0 my-auto h-6 w-6">
        <loading-icon />
      </div>
    </labeled-value>
    <error-message
      v-if="touched && fieldRef?.errors"
      class="block text-right text-xs text-red-600"
      :name="name" />
  </div>
</template>
