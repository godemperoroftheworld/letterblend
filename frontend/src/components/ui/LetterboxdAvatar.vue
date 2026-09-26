<script setup lang="ts">
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';
  import useUser from '@/composables/user';
  import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';

  interface Props {
    name?: string;
    fallback?: boolean;
    icon?: string | Component;
  }
  const { name = '', fallback = true, icon = AvatarIcon } = defineProps<Props>();

  const { user: storageName } = useUser();
  const avatarName = useDebounce(computed(() => {
    if (name.length) return name;
    if (fallback) {
      return storageName.value;
    }
    return '';
  }), 250);
  const shouldFetchExists = computed(() => !!avatarName.value.length);
  const { data: nameExists, isFetching: isFetchingName } = useExists(avatarName, {
    enabled: shouldFetchExists,
  });
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar, isFetching } = useAvatar(avatarName, { enabled: shouldFetchAvatar });

  const isLoading = computed(() => isFetching.value || isFetchingName.value);
</script>

<template>
  <UTooltip :text="avatarName" as="div">
    <div class="relative aspect-square" :class="{ 'animate-pulse': isLoading }">
      <UAvatar :alt="avatarName" :src="name ? avatar : undefined" class="size-full bg-slate-700 overflow-clip" loading="lazy" size="unbound" :icon="icon" :ui="{ icon: 'text-white!' }" />
    </div>
  </UTooltip>
</template>
