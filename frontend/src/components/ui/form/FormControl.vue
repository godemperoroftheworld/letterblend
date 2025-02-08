<script setup lang="ts" generic="T extends PropertyKey">
  import { ErrorMessage, Field, type FieldContext } from 'vee-validate';
  import type { FieldProps } from './types';
  import LabeledValue from '../LabeledValue.vue';
  import LoadingIcon from '@/components/icons/LoadingIcon.vue';
  import type { UnwrapNestedRefs } from 'vue';

  const props = withDefaults(defineProps<FieldProps<T>>(), {
    labelSize: 'sm',
  });

  const fieldRef = ref<UnwrapNestedRefs<FieldContext>>();
  const loading = computed(() => fieldRef.value?.meta.pending);
  const errored = computed(() => !!fieldRef.value?.errorMessage);

  const touched = ref(false);
  const showValidation = ref(false);
  const model = defineModel<T>();
  watch(model, async (val) => {
    fieldRef.value?.setValue(val);
  });
  onMounted(() => {
    model.value = fieldRef.value?.value;
    showValidation.value = props.validateOnMount;
  });
</script>

<template>
  <div
    class="relative"
    @click="touched = true">
    <labeled-value
      :name="name"
      :label="label"
      :label-size="labelSize"
      :uppercase="uppercase"
      :errored="touched && errored"
      :success="(showValidation || touched) && !errored">
      <field
        ref="fieldRef"
        v-slot="{ setTouched }"
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
