<script setup lang="ts">
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';
  import { breakpointsTailwind } from '@vueuse/core';
  import { useRoom } from '@/composables/query/room';
  import { useUpdateSettings, useUpdateUsers } from '@/composables/mutation/room';
  import type { RoomSettings } from '@/types/room';
  import GenericButton from '@/components/ui/button/GenericButton.vue';
  import { IconShare, IconEdit } from '@tabler/icons-vue';
  import { Tippy } from 'vue-tippy';
  import useUser from '@/composables/user';
  import AvatarView from '@/components/ui/AvatarView.vue';
  import DialogView from '@/components/ui/DialogView.vue';

  // Room info
  const route = useRoute();
  const { isSet: hasName } = useUser();
  const code = computed(() => route.params.code as string);
  const { data: room, isFetching } = useRoom(code, {
    enabled: hasName,
  });
  const results = computed(() => room.value?.movies);

  // State
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');
  const showEditUsers = ref(false);
  watch(showEditUsers, (val) => {
    console.log(val);
  });

  // Settings Update
  const { mutateAsync: updateSettings } = useUpdateSettings();
  async function settingsSubmitted(settings: RoomSettings) {
    await updateSettings({ id: room.value!.code, settings });
  }

  // Users update
  const { mutateAsync: updateUsers } = useUpdateUsers();
  async function usersSubmitted(users: string[]) {
    await updateUsers({ id: room.value!.code, users });
    showEditUsers.value = false;
  }

  // Share
  function share() {
    const data: ShareData = {
      title: 'Check out my Letterblend!',
      text: "It's really awesome.",
      url: window.location.href,
    };
    if ('canShare' in navigator && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }
</script>

<template>
  <div class="relative flex items-stretch gap-4 max-md:flex-col lg:gap-8">
    <card-view
      class="basis-2/3"
      title="Results">
      <carousel-view
        class="mx-auto"
        :entries="results"
        :loading="isFetching">
        <template #placeholder>
          <movie-poster class="w-full" />
        </template>
        <template #default="data: Movie">
          <movie-poster
            class="w-full"
            :data="data" />
        </template>
      </carousel-view>
      <template v-if="isSmall">
        <generic-button
          class="mx-auto w-64"
          button-style="info"
          @click="share">
          <icon-share />
          Share
        </generic-button>
      </template>
      <template v-else>
        <tippy
          class="mx-auto block w-fit"
          content="Copied to clipboard."
          trigger="click">
          <generic-button
            class="w-64"
            button-style="info"
            @click="share">
            <icon-share />
            Share
          </generic-button>
        </tippy>
      </template>
    </card-view>
    <div class="flex basis-1/3 flex-col gap-4">
      <card-view title="Users">
        <div class="relative mx-auto flex w-fit flex-col items-center gap-2">
          <template v-if="room">
            <div
              v-for="user in room?.users"
              :key="user"
              class="flex w-full gap-2">
              <avatar-view
                class="h-6 w-6 grow-0"
                :name="user" />
              <span class="text-info">{{ user }}</span>
            </div>
          </template>
          <template v-else>
            <div
              v-for="idx in 2"
              :key="idx"
              class="flex w-full gap-2">
              <avatar-view class="h-6 w-6" />
              <span class="bg-paper h-6 w-32 animate-pulse rounded" />
            </div>
          </template>
        </div>
        <div class="absolute top-3.5 right-4">
          <generic-button
            class="!min-w-0 !p-1 !px-2 !text-sm"
            button-style="hollow"
            @click="showEditUsers = true">
            <icon-edit class="h-5 w-5" />
            <span class="max-sm:hidden">Edit</span>
          </generic-button>
        </div>
      </card-view>
      <card-view
        :collapsable="isSmall"
        title="Settings">
        <blend-settings
          :submitted="settingsSubmitted"
          :loading="isFetching"
          :values="room?.settings"
          submit-button-text="Update"
          :show-submit-button="true" />
      </card-view>
    </div>
    <dialog-view
      v-if="room"
      title="Edit Users"
      :show="showEditUsers"
      @close="showEditUsers = false">
      <blend-users
        :loading="isFetching"
        :values="room.users"
        :submitted="usersSubmitted" />
    </dialog-view>
  </div>
</template>
