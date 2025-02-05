<script setup lang="ts">
  import InputField from '@/components/InputField.vue';
  import { useLocalStorage } from '@vueuse/core';

  interface FormResult {
    names: string[];
  }
  const storageName = useLocalStorage('user', '');

  function submitted(data: FormResult) {
    console.log(JSON.stringify(data));
  }
</script>

<template>
  <card-view title="Blend">
    <form-view
      ref="userForm"
      class="mt-8 flex h-full w-full flex-grow items-center justify-between disabled:cursor-not-allowed"
      name="userForm"
      :fields="{
        name: {
          as: InputField,
          array: true,
          rules: validateLetterboxdName,
        },
      }"
      :defaults="{ name: [storageName, ''] }"
      :show-submit-button="true"
      :submitted="submitted" />
  </card-view>
</template>
