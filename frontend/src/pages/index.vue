<script setup lang="ts">
  import LetterboxdAvatar from '~/components/ui/LetterboxdAvatar.vue';
  import VueBarcode from '@chenfengyuan/vue-barcode';
  import useUser from '~/composables/user.ts';
  import useExists from '~/composables/query/exists.ts';
  import { IconBlender, IconLoader, IconQuestionMark, IconUserEdit, IconUsersGroup } from '@tabler/icons-vue';
  import { useRoomCount } from '~/composables/query/room.ts';
  import { ref } from 'vue';
  import { QrcodeSvg } from 'qrcode.vue';

  const FALLBACK_BARCODE = 'godemperofearth';
  const CURRENT_DATE_STRING = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const router = useRouter();
  const { user: storedName } = useUser();
  const { data: count } = useRoomCount();
  const content = useCssVar('--color-background');

  const name = ref(storedName.value ?? '');
  const { data: exists, isFetching } = useExists(() => name.value, { enabled: () => !!name.value.length });

  const error = computed<boolean | string>(() => {
    if (!isFetching.value && name.value.length && !exists.value) {
      return `Unkown username ${name.value}`;
    }
    return false;
  });
  const url = computed(() => `https://letterboxd.com/${name.value ?? FALLBACK_BARCODE}`);

  async function submitted() {
    storedName.value = name.value;
    await router.push({ name: 'create' });
  }
</script>

<template>
  <MovieTicket class="h-56 mx-auto -rotate-5 mb-16">
    <template #left>
      <div class="h-full flex flex-col items-center justify-between text-background">
        <LetterboxdAvatar class="size-12" :name="name" :icon="IconQuestionMark" />
        <div class="font-mono rotate-270 font-bold text-sm">
          Admit One
        </div>
        <QrcodeSvg class="size-10" :value="url" background="transparent" :foreground="content" />
      </div>
    </template>
    <template #right>
      <UForm class="size-full flex flex-col pr-2 pb-2" @submit="submitted">
        <UFormField label="Enter your Letterboxd Username" :ui="{ label: 'text-background uppercase font-mono', error: 'select-none italic text-xs mt-0! font-light' }" name="name" :error="error">
          <input v-model="name" class="border-b-2 border-dotted outline-0 ring-0 focus:border-dashed" :class="{ 'text-error border-b-black': !!error, 'pl-6': isFetching }" />
          <IconLoader v-if="isFetching" class="size-4 absolute top-0 animate-spin" />
        </UFormField>
        <div class="text-sm italic mt-2 text-slate-700 mb-auto">
          Don't have an account? That's ok, make one
          <ULink
            class="font-bold underline text-slate-700"
            href="https://letterboxd.com/?register=true"
            target="_blank">
            here
          </ULink>
        </div>
        <div>
          <UButton
            type="submit"
            color="neutral"
            class="px-6 uppercase text-xl font-mono tracking-tighter"
            :disabled="!name || !!error">
            Start my Blend
          </UButton>
          <span class="font-mono uppercase text-sm">
            Next — Add Friends
          </span>
        </div>
      </UForm>
      <div class="w-full border-b-3 border-b-background border-dotted mt-auto mb-2" />
      <div class="flex items-end justify-between font-mono text-sm font-semibold text-background">
        <span>No. {{ (count ?? 0) + 1 }}</span>
        <span>
          {{ CURRENT_DATE_STRING }}
        </span>
      </div>
    </template>
  </MovieTicket>
  <div class="flex flex-col justify-center">
    <h2 class="font-mono! uppercase font-bold text-center text-2xl mb-4 text-white">Coming Attractions</h2>
    <FilmReel
      :cells="[
    {
      title: 'Enter your username',
      icon: IconUserEdit,
      content: 'Enter your Letterboxd username to get started. We pull your ratings straight from Letterboxd. There is nothing to connect or authorize!'
    },
    {
      title: 'Add your friends',
      icon: IconUsersGroup,
      content: 'Enter your friends usernames. You can bring in up to four friends! Sadly, we cannot provide those for you— Strict BYOF policy.'
    },
    {
      title: 'Make your blend',
      icon: IconBlender,
      content: 'Set your parameters, and make your blend! It\'s never been easier to get started on movie night!'
    }
  ]" />
  </div>
</template>
