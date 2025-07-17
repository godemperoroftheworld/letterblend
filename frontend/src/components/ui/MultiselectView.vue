<script setup lang="ts" generic="T extends PropertyKey, R">
  import VueMultiselect from 'vue-multiselect';
  import type { Option } from '@/utils/option';
  import isEqual from 'lodash/isEqual';

  export interface SelectProps<T extends PropertyKey, R> {
    options: R[] | Required<Option<T, R>>[];
    multiple?: boolean;
    searchable?: boolean;
  }
  const props = defineProps<SelectProps<T, R>>();
  const model = defineModel<R>();

  const isOptionType = computed(() => {
    return (
      typeof props.options[0] === 'object' &&
      props.options[0] != null &&
      'id' in props.options[0] &&
      'label' in props.options[0]
    );
  });

  function getInnerValue(value: R) {
    return props.options.find((o) => isEqual(o.value, value));
  }

  const innerModel = ref<R | Option<T, R>>();
  watch(innerModel, (val, old) => {
    if (isEqual(val, old)) return;
    if (isOptionType.value) {
      if (Array.isArray(val)) {
        model.value = val.map((v) => v.value);
      } else {
        model.value = val?.value ?? {};
      }
    } else {
      model.value = val;
    }
  });
  watch(model, (val, old) => {
    if (isEqual(val, old)) return;
    if (isOptionType.value) {
      if (Array.isArray(val)) {
        innerModel.value = val.map(getInnerValue);
      } else {
        innerModel.value = getInnerValue(val);
      }
    } else {
      innerModel.value = val;
    }
  });
</script>

<template>
  <vue-multiselect
    v-model="innerModel"
    class="h-10"
    :multiple="multiple"
    :searchable="searchable"
    :options="options"
    :allow-empty="true"
    :track-by="isOptionType ? 'id' : undefined"
    :label="isOptionType ? 'label' : undefined"
    :show-labels="false" />
</template>

<style src="vue-multiselect/dist/vue-multiselect.css" />
<style lang="scss">
  @use '@/assets/css/variables';
  .multiselect__tags {
    max-height: 2.5rem;

    .multiselect__tags-wrap {
      display: flex;
      width: fit-content;
      max-width: 100%;
      overflow: hidden;
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: thin;
    }

    .multiselect__tag {
      flex-shrink: 0;
    }
  }
  .multiselect,
  .multiselect__input,
  .multiselect__tags {
    background: variables.$color-content !important;
    outline: none;
    border: none;
  }
  .multiselect__content-wrapper {
    background: variables.$color-content;
    outline: none;
    border: none;
    box-shadow: none;
    color: white;
  }
  .multiselect__option--selected {
    background: variables.$color-paper;
  }
  .multiselect__option--highlight,
  .multiselect__option--highlight::after {
    background: variables.$color-primary;
  }
  .multiselect__option--selected.multiselect__option--highlight,
  .multiselect__option--selected.multiselect__option--highlight::after {
    background-color: variables.$color-secondary;
  }
  .multiselect__single {
    background-color: variables.$color-paper;
    padding: 0.125rem 0.5rem;
    width: fit-content;
    color: white;
  }
  .multiselect__option {
    font-size: 0.875rem;
  }
</style>
