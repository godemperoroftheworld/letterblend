<script setup lang="ts" generic="T, V">
  import FormView, { type FormEmits } from './FormView.vue';
  import type { DataFormProps, StrippedFormProps } from './types';
  import { computed, unref, type UnwrapRef } from 'vue';

  const props = defineProps<DataFormProps<T, V>>();
  const emits = defineEmits<FormEmits<UnwrapRef<V>>>();

  const { mutateAsync } = props.mutation();

  const strippedProps = computed<StrippedFormProps<V>>(() => {
    const { mutation: _ignored, ...rest } = props;
    return rest;
  });

  async function onSubmit(values: V) {
    await mutateAsync(values);
    emits('submitted', unref(values) as UnwrapRef<V>);
  }
</script>

<template>
  <form-view
    v-bind="strippedProps"
    :submitted="(values: unknown) => onSubmit(values as V)"
    @cancelled="emits('cancelled')" />
</template>
