<script setup lang="ts" generic="T extends PropertyKey">
  import { useForm } from 'vee-validate';
  import type { FieldProps } from './types';

  interface Props extends FieldProps<T> {
    loading?: boolean;
  }

  const {
    labelSize = 'sm',
    name,
    label,
    props,
    validateOnMount,
  } = defineProps<Props>();

  const { defineField, errorBag } = useForm();
  const [field, fieldAttrs] = defineField(name, {
    label,
  });

  const touched = ref(false);
  const showValidation = ref(false);
  const model = defineModel<T>({
    default: field.value,
    set: (val) => {
      field.value = val
    }
  });
  const error = computed(() => {
    return errorBag.value[name]?.at(0);
  })

  watch(field, (val) => {
    model.value = val;
  });
  onMounted(() => {
    model.value = field.value;
    showValidation.value = validateOnMount;
  });
</script>

<template>
  <UTooltip :text="tooltip">
    <UFormField
      :name="name"
      :label="label"
      :label-size="labelSize"
      :uppercase="uppercase"
      :error="error"
      :success="(showValidation || touched) && !error">
      <component
        :is="as"
        v-model="field"
        v-bind="{ ...fieldAttrs, ...props }"
        :name="name"
        class="w-64! max-w-full"
        :class="{ 'bg-paper text-paper animate-pulse': loading }"
        @focus="touched = true"
        @click="touched = true" />
    </UFormField>
  </UTooltip>
</template>
