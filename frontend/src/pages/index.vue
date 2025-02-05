<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { useLocalStorage } from '@vueuse/core';
  import { ref } from 'vue';
  import AvatarView from '@/components/ui/AvatarView.vue';
  import CardView from '@/components/ui/CardView.vue';
  import { validateLetterboxdName } from '@/utils/validate';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import FormView from '@/components/ui/form/FormView.vue';

  interface NameForm {
    name: string;
  }

  const userForm = ref();
  const router = useRouter();
  const storedName = useLocalStorage('user', '');
  const formValid = computed(() => !!userForm.value?.valid);
  const formName = computed(() => userForm.value?.values['name']);

  // Form
  async function submitted({ name }: NameForm) {
    localStorage.setItem('user', name);
    await router.push('/blend');
  }
</script>

<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
    <card-view
      title="Get Started"
      class="col-span-1 lg:col-span-3">
      <div class="flex w-full flex-grow flex-col items-center justify-center gap-8 md:flex-row">
        <avatar-view
          class="h-36 w-36 flex-shrink-0"
          :show="formValid"
          :name="formName"
          fallback />
        <form-view
          ref="userForm"
          name="userForm"
          :fields="{
            name: {
              label: 'Enter your Letterboxd Username',
              labelSize: 'base',
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
        class="mx-auto w-32"
        text="Submit"
        type="submit"
        :disabled="userForm && !formValid"
        @keyup.enter="userForm.submit()"
        @click.prevent="userForm.submit()" />
    </card-view>
    <card-view
      title="How-To"
      class="order-first hidden md:block lg:order-none lg:col-span-2" />
  </div>
</template>
