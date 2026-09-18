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
  const { data: nameExists } = useExists(avatarName, {
    enabled: shouldFetchExists,
  });
  const shouldFetchAvatar = computed(() => shouldFetchExists.value && !!nameExists.value);
  const { data: avatar } = useAvatar(avatarName, { enabled: shouldFetchAvatar });
</script>

<template>
  <UTooltip :text="avatarName">
    <UAvatar :alt="avatarName" :src="avatar" loading="lazy" />
  </UTooltip>
</template>
