<script setup lang="ts" generic="T extends PropertyKey">
  import {  Field, type FieldContext } from 'vee-validate';
  import type { FieldProps } from './types';
  import type { UnwrapNestedRefs } from 'vue';
  import isEqual from 'lodash/isEqual';

  const formProps = withDefaults(defineProps<FieldProps<T> & { loading?: boolean }>(), {
    labelSize: 'sm',
  });

  const fieldRef = ref<UnwrapNestedRefs<FieldContext>>();
  const errorMessage = computed(() => fieldRef.value?.errorMessage);

  const touched = ref(false);
  const showValidation = ref(false);
  const model = defineModel<T>();
  watch(model, (val, old) => {
    if (!isEqual(val, old)) {
      fieldRef.value?.setValue(val);
    }
  });
  watch(
    () => fieldRef.value?.value,
    (val, old) => {
      if (!isEqual(val, old)) {
        model.value = val;
      }
    },
  );
  onMounted(() => {
    model.value = fieldRef.value?.value;
    showValidation.value = formProps.validateOnMount;
  });
</script>

<template>
  <UTooltip :text="tooltip">
    <UFormField
      :name="name"
      :label="label"
      :label-size="labelSize"
      :uppercase="uppercase"
      :error="errorMessage"
      :success="(showValidation || touched) && !errorMessage">
      <field
        ref="fieldRef"
        :name="name"
        :rules="rules">
        <component
          :is="as"
          v-model="model"
          :name="name"
          v-bind="props"
          class="w-64! max-w-full"
          :class="{ 'bg-paper text-paper animate-pulse': loading }"
          @focus="touched = true"
          @click="touched = true" />
      </field>
    </UFormField>
  </UTooltip>
</template>
