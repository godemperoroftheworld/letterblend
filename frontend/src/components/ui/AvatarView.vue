<script setup lang="ts">
  import useAvatar from '@/composables/query/avatar';
  import useExists from '@/composables/query/exists';
  import useUser from '@/composables/user';
  import AvatarIcon from '@/components/ui/icons/AvatarIcon.vue';

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
        v-slot="{ src, isLoaded, imgAttrs }"
        class="h-full w-full text-[0px]"
        :src="avatar">
        <img
          v-if="isLoaded"
          alt="User Avatar"
          v-bind="imgAttrs"
          :src="src" />
        <avatar-icon v-else />
      </nuxt-img>
    </template>
    <avatar-icon v-else />
  </div>
</template>
