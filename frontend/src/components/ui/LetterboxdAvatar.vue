<script setup lang="ts">
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';
  import useUser from '@/composables/user';
  import AvatarIcon from '~/components/ui/icons/AvatarIcon.vue';

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
  const { data: nameExists, isFetching: isFetchingName } = useExists(avatarName, {
    enabled: shouldFetchExists,
  });
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar, isFetching } = useAvatar(avatarName, { enabled: shouldFetchAvatar });

  const isLoading = computed(() => isFetching.value || isFetchingName.value);
</script>

<template>
  <UTooltip :text="avatarName" as="div">
    <div class="relative aspect-square">
      <UAvatar v-if="avatar" :alt="avatarName" :src="avatar" loading="lazy" size="unbound" />
      <AvatarIcon v-else :class="{ 'animate-pulse': isLoading }" class="size-full bg-paper rounded-full" />
    </div>
  </UTooltip>
</template>
