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
  const { user: storedName } = useUser();

  async function submitted({ name }: NameForm) {
    storedName.value = name;
    emits('submitted');
  }
</script>

<template>
  <div class="flex h-full flex-col justify-center gap-4">
    <div class="flex items-center justify-center gap-4">
      <avatar-view
        class="w-32 min-w-24 grow-0 max-sm:w-20 lg:w-40"
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
    <info-message class="mx-auto">
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
