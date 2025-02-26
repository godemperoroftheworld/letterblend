<script setup lang="ts">
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';
  import useUser from '@/composables/user';

  interface Props {
    name?: string;
    fallback?: boolean;
  }
  const props = defineProps<Props>();

  const { user: storageName } = useUser();
  const avatarName = computed(() => {
    if (props.name) return props.name;
    if (props.fallback) {
      return storageName.value;
    }
    return '';
  });
  const shouldFetchExists = computed(() => !!avatarName.value.length);
  const { data: nameExists, isLoading: isLoadingName } = useExists(avatarName, {
    enabled: shouldFetchExists,
  });
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar, isLoading } = useAvatar(avatarName, { enabled: shouldFetchAvatar });
</script>

<template>
  <div
    class="bg-paper shadow-paper/50 relative aspect-square grow overflow-hidden rounded-full shadow-2xs"
    :class="{ 'animate-pulse': !avatarName || isLoadingName || isLoading }">
    <template v-if="avatar">
      <nuxt-img
        class="h-full w-full"
        alt="User Avatar"
        :src="avatar" />
    </template>
    <template v-else>
      <svg
        class="h-full w-full text-white"
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
