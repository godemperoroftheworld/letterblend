<script setup lang="ts">
  import InputField from '@/components/ui/InputField.vue';
  import { useLocalStorage } from '@vueuse/core';
  import { ref } from 'vue';
  import AvatarView from '@/components/ui/AvatarView.vue';
  import CardView from '@/components/ui/CardView.vue';
  import { validateLetterboxdName } from '@/utils/validate';
  import TextButton from '@/components/ui/button/TextButton.vue';
  import FormView from '@/components/ui/form/FormView.vue';
  import SlidesView from '@/components/ui/SlidesView.vue';
  import InfoMessage from '@/components/ui/InfoMessage.vue';

  interface NameForm {
    name: string;
  }

  // Form info
  const userForm = ref();
  const storedName = useLocalStorage('user', '');
  const formValid = computed(() => !!userForm.value?.valid);
  const formName = computed(() => userForm.value?.values['name']);

  // Form submission
  const router = useRouter();
  async function submitted({ name }: NameForm) {
    localStorage.setItem('user', name);
    await router.push('/blend');
  }
</script>

<template>
  <div class="grid gap-4 max-lg:grid-rows-5 lg:grid-cols-5 lg:gap-8">
    <card-view
      title="Get Started"
      justify="center"
      class="max-lg:row-span-3 lg:col-span-3">
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
                debounceMs: 200,
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
      </div>
      <text-button
        class="mx-auto w-64"
        text="Submit"
        button-style="submit"
        :disabled="userForm && !formValid"
        @keyup.enter="userForm.submit()"
        @click.prevent="userForm.submit()" />
    </card-view>
    <card-view
      title="How-To"
      class="max-lg:order-first max-lg:row-span-2 lg:col-span-2">
      <slides-view
        class="my-auto h-64 max-h-full w-full"
        :slides="[
          {
            title: 'Grab Some Friends',
            description: 'Friends are not provided...',
            image: '/img/friends.svg',
          },
          {
            title: `Use this app`,
            description: `You're already in the right place, might as well.`,
            image: '/img/app.svg',
          },
          {
            title: `Make a decision`,
            description: `It's easy now!`,
            image: '/img/decide.svg',
          },
          {
            title: 'Movie time!',
            description: 'Finally! That took forever...',
            image: '/img/movie.svg',
          },
        ]"
        :autoplay="5000" />
    </card-view>
  </div>
</template>
