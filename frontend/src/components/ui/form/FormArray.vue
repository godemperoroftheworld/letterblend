<script setup lang="ts" generic="T extends PropertyKey">
  import type { FieldProps } from '@/components/ui/form/types';
  import { IconPlus, IconTrash } from '@tabler/icons-vue';
  import FormControl from '@/components/ui/form/FormControl.vue';
  import { FieldArray, type FieldArrayContext, useFormContext } from 'vee-validate';
  import IconButton from '@/components/ui/button/IconButton.vue';
  import GenericButton from '@/components/ui/button/GenericButton.vue';

  interface Props {
    fieldProps: Omit<FieldProps<T>, 'name'>;
    arrayKey: PropertyKey;
    length?: { min?: number; max?: number };
    loading?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    length: () => ({ min: 1, max: 5 }),
  });

  const fieldArrayRef = ref<FieldArrayContext>();
  const formContext = useFormContext();
  const arrayValues = computed(() => {
    return formContext.values[props.arrayKey as keyof FieldArrayContext] ?? [];
  });
  const disableRemove = computed(() => {
    if (props.length.min) {
      return arrayValues.value.length <= props.length.min;
    }
    return false;
  });
  const disableAdd = computed(() => {
    if (props.length.max) {
      return arrayValues.value.length >= props.length.max;
    }
    return false;
  });
</script>

<template>
  <field-array
    ref="fieldArrayRef"
    v-slot="{ fields: arrayFields, push, remove }"
    :name="String(arrayKey)">
    <template
      v-for="(entry, idx) in arrayFields"
      :key="entry.key">
      <div class="relative flex items-center gap-2">
        <slot
          name="beforeField"
          :value="entry.value" />
        <form-control
          :name="`${String(arrayKey)}[${idx}]`"
          v-bind="fieldProps"
          :loading="loading" />
        <icon-button
          class="sm:hidden"
          button-style="danger"
          :disabled="disableRemove"
          :icon="IconTrash"
          name="removeEntry"
          @click="remove(idx)" />
        <div
          class="absolute -right-2 bottom-0 hidden w-fit translate-x-full items-center gap-2 sm:flex">
          <icon-button
            button-style="danger"
            :disabled="disableRemove"
            :icon="IconTrash"
            name="removeEntry"
            @click="remove(idx)" />
          <icon-button
            v-if="idx + 1 === arrayFields.length"
            :disabled="disableAdd"
            button-style="submit"
            :icon="IconPlus"
            :size="12"
            name="addEntry"
            @click="push('')" />
        </div>
      </div>
    </template>
  </field-array>
  <generic-button
    name="addEntry"
    class="mx-auto w-64 sm:hidden"
    :disabled="disableAdd"
    @click="fieldArrayRef?.push('')">
    <icon-plus />
    Add Entry
  </generic-button>
</template>
