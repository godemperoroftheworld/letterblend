<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { validateLetterboxdName } from '@/utils/validate';
  import FormView from '@/components/ui/form/FormView.vue';
  import InfoMessage from '@/components/ui/InfoMessage.vue';
  import AvatarView from '@/components/ui/AvatarView.vue';
  import { ref } from 'vue';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import useUser from '@/composables/user';

  interface NameForm {
    name: string;
  }
  const emits = defineEmits(['submitted']);

  const userForm = ref();
  const formName = computed(() => userForm.value?.values['name']);
  const formValid = computed(() => !!userForm.value?.valid);
  const { user: storedName, refresh } = useUser();

  async function submitted({ name }: NameForm) {
    storedName.value = name;
    refresh();
    emits('submitted');
  }

  defineExpose({ ...userForm });
</script>

<template>
  <div class="flex min-h-2/3 w-full flex-col items-center justify-center">
    <div class="flex w-full items-center justify-center gap-4 lg:flex-col lg:gap-8">
      <avatar-view
        class="max-lg:max-h-32 max-lg:max-w-32 lg:w-36"
        :name="formName"
        fallback />
      <form-view
        ref="userForm"
        class="relative max-sm:max-w-2/3"
        name="userForm"
        :fields="{
          name: {
            label: 'Enter your Letterboxd Username',
            labelSize: 'base',
            uppercase: true,
            as: InputField,
            validateOnMount: true,
            rules: validateLetterboxdName,
            props: {
              debounceMs: 200,
            },
          },
        }"
        :defaults="{ name: storedName }"
        :show-submit-button="false"
        :submitted="submitted" />
    </div>
    <info-message class="my-6 w-full max-w-lg min-w-64 md:px-8">
      Don't have an account? That's ok, make one
      <a
        class="font-bold underline"
        href="https://letterboxd.com/?register=true"
        target="_blank">
        here
      </a>
    </info-message>
    <text-button
      class="mx-auto w-64"
      text="Submit"
      button-style="submit"
      :disabled="userForm && !formValid"
      @keyup.enter="userForm.submit()"
      @click.prevent="userForm.submit()" />
  </div>
</template>
