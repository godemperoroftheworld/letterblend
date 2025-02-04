<script setup lang="ts">
  import InputField from '@/components/InputField.vue';
  import { useLocalStorage } from '@vueuse/core';
  import { ref } from 'vue';
  import AvatarView from '@/components/AvatarView.vue';
  import CardView from '@/components/CardView.vue';
  import { validateLetterboxdName } from '@/utils/validate';

  interface NameForm {
    name: string;
  }

  const userForm = ref();
  const storedName = useLocalStorage('user', '');
  const formValid = computed(() => !!userForm.value?.valid);
  const formName = computed(() => userForm.value?.values['name']);

  // Form
  async function submitted({ name }: NameForm) {
    localStorage.setItem('user', name);
  }

  watch(formName, (val) => {
    console.log('name: ' + val);
  });
</script>

<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
    <card-view
      title="Blend"
      class="col-span-1 lg:col-span-3">
      <div class="flex w-full flex-grow items-center justify-center gap-8">
        <avatar-view
          class="h-24 w-24"
          :show="formValid"
          :name="formName" />
        <form-view
          ref="userForm"
          name="userForm"
          :fields="{
            name: {
              label: 'Enter your Letterboxd Username',
              uppercase: true,
              as: InputField,
              validateOnChange: true,
              validateOnBlur: false,
              rules: validateLetterboxdName,
              debounceMs: 200,
            },
          }"
          :defaults="{ name: storedName }"
          :show-submit-button="false"
          :submitted="submitted" />
      </div>
      <text-button
        class="mx-auto"
        text="Submit"
        type="submit"
        :disabled="!formValid"
        @keyup.prevent="userForm.submit()"
        @click.prevent="userForm.submit()" />
    </card-view>
    <card-view
      title="How-To"
      class="order-first hidden md:block lg:order-none lg:col-span-2" />
  </div>
</template>
