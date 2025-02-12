<script setup lang="ts" generic="T">
  import VueMultiselect from 'vue-multiselect';
  import type { Option } from '@/utils/option';

  export interface SelectProps<T> {
    options: T[] | Option<T>[];
    multiple?: boolean;
  }
  defineProps<SelectProps>();
  const model = defineModel<T | Option<T>>();
</script>

<template>
  <vue-multiselect
    v-model="model"
    class="h-10"
    v-bind="$props"
    :searchable="false"
    :multiple="multiple"
    select-label=""
    deslect-label="" />
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
