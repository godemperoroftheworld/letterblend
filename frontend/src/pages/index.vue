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

  watch(formName, (val) => {
    console.log('updated: ' + val);
  });
</script>

<template>
  <div class="grid gap-4 max-xl:grid-rows-5 lg:gap-8 xl:grid-cols-5">
    <card-view
      title="Get Started"
      justify="center"
      class="max-xl:row-span-3 xl:col-span-3">
      <div class="flex min-h-2/3 w-full flex-col items-center justify-center">
        <div class="flex w-full items-center justify-center gap-4 lg:flex-col lg:gap-8">
          <avatar-view
            class="md:h-36 md:w-36"
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
                validateOnBlur: false,
                rules: validateLetterboxdName,
                debounceMs: 200,
              },
            }"
            :defaults="{ name: storedName }"
            :show-submit-button="false"
            :submitted="submitted" />
        </div>
        <div class="w-full max-w-lg md:px-8">
          <info-message class="mt-4 w-full min-w-64">
            Don't have an account? That's ok, make one
            <a
              class="font-bold underline"
              href="https://letterboxd.com/?register=true"
              >here</a
            >
          </info-message>
        </div>
      </div>
      <text-button
        class="mx-auto mt-auto w-64"
        text="Submit"
        type="submit"
        :disabled="userForm && !formValid"
        @keyup.enter="userForm.submit()"
        @click.prevent="userForm.submit()" />
    </card-view>
    <card-view
      title="How-To"
      class="order-first max-xl:row-span-2 xl:order-none xl:col-span-2">
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
