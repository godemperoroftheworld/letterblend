<script setup lang="ts" generic="T extends PropertyKey">
  import { ErrorMessage, Field, type FieldContext } from 'vee-validate';
  import type { FieldProps } from './types';
  import LabeledValue from '../LabeledValue.vue';
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';
  import type { UnwrapNestedRefs } from 'vue';

  const formProps = withDefaults(defineProps<FieldProps<T> & { loading?: boolean }>(), {
    labelSize: 'sm',
  });

  const fieldRef = ref<UnwrapNestedRefs<FieldContext>>();
  const loadingValidation = computed(() => fieldRef.value?.meta.pending);
  const errored = computed(() => !!fieldRef.value?.errorMessage);

  const touched = ref(false);
  const showValidation = ref(false);
  const model = defineModel<T>();
  const fieldModel = computed({
    get: () => model.value,
    set(val) {
      model.value = val;
      fieldRef.value?.setValue(val);
    },
  });
  onMounted(() => {
    showValidation.value = formProps.validateOnMount;
  });
  watch(
    () => fieldRef.value?.value,
    (val) => {
      model.value = val;
    },
    { immediate: true },
  );
</script>

<template>
  <labeled-value
    :name="name"
    :label="label"
    :label-size="labelSize"
    :uppercase="uppercase"
    :errored="touched && errored"
    :success="(showValidation || touched) && !errored"
    @click="touched = true">
    <field
      ref="fieldRef"
      :name="name"
      :rules="rules">
      <component
        :is="as"
        v-model="fieldModel"
        :name="name"
        v-bind="props"
        class="w-64 max-w-full"
        :class="{ 'bg-paper text-paper animate-pulse': loading }" />
    </field>
    <div
      v-show="loadingValidation"
      class="absolute top-0 right-2 bottom-0 my-auto h-6 w-6">
      <loading-icon />
    </div>
    <error-message
      v-show="touched"
      class="absolute right-0 -bottom-0.5 translate-y-full text-right text-xs text-red-600"
      :name="name" />
  </labeled-value>
</template>
