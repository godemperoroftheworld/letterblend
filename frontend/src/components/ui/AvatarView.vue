<script setup lang="ts">
  import { useLocalStorage } from '@vueuse/core';
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';

  interface Props {
    name?: string;
    fallback?: boolean;
  }
  const props = defineProps<Props>();

  const storageName = useLocalStorage('user', '');
  const eitherName = computed(() => props.name ?? (props.fallback ? storageName.value : ''));
  const shouldFetchExists = computed(() => !!eitherName.value?.length);
  const { data: nameExists, isLoading: isLoadingName } = useExists(eitherName);
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar, isLoading } = useAvatar(eitherName, { enabled: shouldFetchAvatar });

  watch(eitherName, (val) => console.log('avatar: ' + val), { immediate: true });
</script>

<template>
  <div
    class="bg-paper shadow-paper/50 relative aspect-square grow overflow-hidden rounded-full shadow-2xs"
    :class="{ 'animate-pulse': isLoadingName || isLoading }">
    <template v-if="avatar">
      <nuxt-img
        class="absolute bottom-0 h-full w-full"
        :src="avatar" />
    </template>
    <template v-else>
      <svg
        class="absolute bottom-0 h-full w-full text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path
          class="translate-y-[10%]"
          fill-rule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clip-rule="evenodd" />
      </svg>
    </template>
  </div>
</template>
