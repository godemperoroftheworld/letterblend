<script setup lang="ts">
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';
  import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';

  interface Props {
    name?: string;
    icon?: string | Component;
  }
  const { name = '', icon = AvatarIcon } = defineProps<Props>();

  const avatarName = useDebounce(
    computed(() => name),
    250,
  );
  const shouldFetchExists = computed(() => !!avatarName.value.length);
  const { data: nameExists, isFetching: isFetchingName } = useExists(avatarName, {
    enabled: shouldFetchExists,
  });
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar, isFetching } = useAvatar(avatarName, { enabled: shouldFetchAvatar });

  const isLoading = computed(() => isFetching.value || isFetchingName.value);
</script>

<template>
  <UTooltip
    :text="avatarName"
    as="div">
    <UAvatar
      :alt="avatarName"
      :src="name ? avatar : undefined"
      :class="{ 'animate-pulse': isLoading }"
      class="aspect-square overflow-clip bg-slate-700"
      loading="lazy"
      size="unbound"
      :icon="icon"
      :ui="{ icon: 'text-white!' }" />
  </UTooltip>
</template>
