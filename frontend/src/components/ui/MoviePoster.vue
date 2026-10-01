<script setup lang="ts">
  import type { Movie } from '@/types/movie';
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import { IconLock, IconLockOff } from '@tabler/icons-vue';

  interface Props {
    data?: Movie | null;
    locked?: boolean;
  }
  type Emits = {
    locked: [boolean];
  };
  const { data = null, locked = false } = defineProps<Props>();
  const emits = defineEmits<Emits>();

  const loaded = ref(false);
</script>

<template>
  <div class="group relative pb-8">
    <UTooltip
      v-if="data"
      :text="data.name">
      <a
        class="bg-paper block overflow-hidden rounded-sm"
        :class="{ 'aspect-2/3 animate-pulse': !loaded }"
        :href="`https://letterboxd.com/tmdb/${data.id}`"
        target="_blank">
        <NuxtImg
          class="aspect-2/3"
          :src="`api/poster/${data.id}`"
          provider="raw"
          loading="lazy"
          :alt="loaded ? data.name : null"
          @load="loaded = true" />
        <div
          :data-locked="locked"
          class="transition-default absolute top-2 right-2 text-white group-hover:scale-110 hover:scale-125 hover:opacity-100! data-[locked=false]:opacity-10 data-[locked=false]:group-hover:opacity-50 data-[locked=true]:opacity-75 data-[locked=true]:group-hover:opacity-100">
          <component
            :is="locked ? IconLock : IconLockOff"
            v-if="loaded"
            class="size-6"
            @click.prevent="emits('locked', !locked)" />
        </div>
      </a>
    </UTooltip>
    <div
      v-else
      class="bg-paper aspect-2/3 w-full animate-pulse rounded-sm" />
    <UAvatarGroup class="absolute bottom-1 flex w-full justify-center">
      <LetterboxdAvatar
        v-for="idx in data?.users?.length ?? 2"
        :key="idx"
        :name="data?.users?.[idx - 1]"
        class="transition-default size-6 hover:scale-125" />
    </UAvatarGroup>
  </div>
</template>
