<script setup lang="ts">
  import LetterboxdAvatar from '~/components/ui/LetterboxdAvatar.vue';
  import useUser from '~/composables/user.ts';
  import useExists from '~/composables/query/exists.ts';
  import {
    IconBlender,
    IconLoader,
    IconQuestionMark,
    IconUserEdit,
    IconUsersGroup,
  } from '@tabler/icons-vue';
  import { useRoomCount } from '~/composables/query/room.ts';
  import { ref } from 'vue';
  import { QrcodeSvg } from 'qrcode.vue';

  definePageMeta({
    layout: {
      name: 'default',
      props: {
        stickyHeader: true,
        showBackButton: false,
      },
    },
  });

  const router = useRouter();
  const { user: storedName } = useUser();
  const { data: count } = useRoomCount();

  const name = ref('');
  const currentDate = ref<string>('');
  const debouncedName = useDebounce(name, 250);
  const { data: exists, isFetching } = useExists(debouncedName, {
    enabled: () => !!debouncedName.value.length,
  });

  const settling = computed(() => debouncedName.value !== name.value || isFetching.value);
  const error = computed<boolean | string>(() => {
    if (!settling.value && name.value.length && exists.value === false) {
      return `Unkown username ${name.value}`;
    }
    return false;
  });
  const url = computed(() => `https://letterboxd.com/${name.value}`);

  onMounted(() => {
    currentDate.value = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  });

  async function submitted() {
    storedName.value = name.value;
    await router.push({ name: 'create' });
  }

  onMounted(() => {
    name.value = storedName.value;
  });
</script>

<template>
  <div class="flex items-center justify-around gap-6 sm:max-md:mt-8 xl:flex-col">
    <MovieTicket class="max-xl:w-64 xl:h-64">
      <template #left>
        <div
          class="text-background flex h-full items-center justify-center gap-6 max-xl:w-full xl:flex-col xl:justify-between xl:gap-3">
          <LetterboxdAvatar
            class="size-12"
            :name="name"
            :icon="IconQuestionMark" />
          <div class="xl:writing-vertical-lr font-mono text-sm font-bold text-nowrap">
            Admit One
          </div>
          <QrcodeSvg
            class="text-background size-10"
            :value="url"
            background="transparent"
            foreground="currentColor" />
        </div>
      </template>
      <template #right>
        <div class="flex h-full flex-col justify-between">
          <UForm
            class="flex grow flex-col"
            @submit="submitted">
            <UFormField
              label="Enter your Letterboxd Username"
              :ui="{
                label: 'text-background uppercase font-mono',
                error: 'select-none italic text-xs mt-0! font-light',
              }"
              name="name"
              :error="error">
              <input
                v-model="name"
                class="border-b-2 border-dotted text-black ring-0 outline-0 focus:border-dashed max-lg:w-full"
                :class="{ 'text-error border-b-black': !!error, 'pl-6': isFetching }" />
              <IconLoader
                v-if="isFetching"
                class="absolute top-0 size-4 animate-spin" />
            </UFormField>
            <div class="mt-2 mb-auto text-sm text-slate-700 italic">
              Don't have an account? That's ok, make one
              <ULink
                class="font-bold text-slate-700 underline"
                href="https://letterboxd.com/?register=true"
                target="_blank">
                here
              </ULink>
            </div>
            <div class="flex items-center gap-2 max-lg:flex-col">
              <UButton
                type="submit"
                color="neutral"
                class="px-6 font-mono text-xl tracking-tighter uppercase"
                :disabled="!name || !!error || settling">
                Start my Blend
              </UButton>
              <span class="text-background font-mono text-sm uppercase"> Next — Add Friends </span>
            </div>
          </UForm>
          <div>
            <div class="border-b-background my-2 w-full border-b-3 border-dotted" />
            <div
              class="text-background flex items-end justify-between font-mono text-xs font-semibold lg:text-sm">
              <span>No. {{ (count ?? 0) + 1 }}</span>
              <span>
                {{ currentDate }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </MovieTicket>
    <FilmReel
      class="max-sm:hidden"
      :cells="[
        {
          title: 'Enter your username',
          icon: IconUserEdit,
          content:
            'Enter your Letterboxd username to get started. There is nothing to connect or authorize!',
        },
        {
          title: 'Add your friends',
          icon: IconUsersGroup,
          content:
            'Enter your friends usernames. Sadly, we cannot provide those for you— Strict BYOF policy.',
        },
        {
          title: 'Make your blend',
          icon: IconBlender,
          content:
            'Set your parameters, and make your blend! It\'s never been easier to get started on movie night!',
        },
      ]" />
  </div>
</template>
