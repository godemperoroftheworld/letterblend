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
  }
  const props = withDefaults(defineProps<Props>(), {
    length: () => ({ min: 1, max: 5 }),
  });

  const fieldArrayRef = ref<FieldArrayContext>();
  const formContext = useFormContext();
  const disableAdd = computed(() => {
    return formContext.values[props.arrayKey].length === props.length.max;
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
      <div class="relative flex items-center gap-2 md:gap-4">
        <slot
          name="beforeField"
          :value="entry.value" />
        <form-control
          :name="`${String(arrayKey)}[${idx}]`"
          v-bind="fieldProps" />
        <icon-button
          class="sm:hidden"
          type="danger"
          :disabled="arrayFields.length <= length.min"
          :icon="IconTrash"
          @click="remove(idx)" />
        <div
          class="absolute -right-2 bottom-0 hidden w-fit translate-x-full items-center gap-2 sm:flex">
          <icon-button
            type="danger"
            :disabled="arrayFields.length <= length.min"
            :icon="IconTrash"
            @click="remove(idx)" />
          <icon-button
            v-if="idx + 1 === arrayFields.length"
            :disabled="disableAdd"
            type="submit"
            :icon="IconPlus"
            :size="12"
            @click="fieldArrayRef?.push('')" />
        </div>
      </div>
    </template>
  </field-array>
  <generic-button
    v-if="fieldArrayRef"
    class="mt-auto sm:hidden"
    type="submit"
    :disabled="disableAdd"
    @click="fieldArrayRef.push('')">
    <icon-plus />
    Add Entry
  </generic-button>
</template>
