<script setup lang="ts">
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import { useRoom } from '@/composables/query/room';
  import type { RoomSettings } from '@/types/room';
  import { IconInfoCircle } from '@tabler/icons-vue';
  import useUser from '@/composables/user';
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
  import BlendUsersModal from '@/components/blend/BlendUsersModal.vue';
  import ShareButton from '~/components/ShareButton.vue';
  import cloneDeep from 'lodash/cloneDeep';
  import { useUpdateRoom } from '~/composables/mutation/room.ts';
  import EmptyState from '~/components/room/EmptyState.vue';
  import { DEFAULT_SETTINGS } from '~/constants/settings.ts';

  const SKELETONS = Array.from({ length: 6 }).map(() => null);

  // Room info
  const route = useRoute();
  const router = useRouter();
  const { exists: hasName } = useUser();
  const code = computed(() => route.params.code as string);
  const {
    data: room,
    error,
    isFetched,
  } = useRoom(code, {
    enabled: hasName,
    retry: false,
  });
  const { success, error: showError } = useNotify();

  const results = computed(() => room.value?.movies);
  const count = computed(() => results.value?.length ?? 0);

  // State
  const showEditUsers = ref(false);
  const showConfirmDialog = ref(false);
  const settingsValue = ref<RoomSettings>(DEFAULT_SETTINGS);
  const usersValue = ref<string[]>([]);
  const lockedMovies = reactive<Set<number>>(new Set());

  // Settings Update
  const { mutateAsync: updateRoom } = useUpdateRoom();
  function settingsClicked(settings: RoomSettings) {
    settingsValue.value = settings;
    showConfirmDialog.value = true;
  }
  async function updateSubmitted() {
    try {
      await updateRoom({
        id: room.value!.code,
        settings: settingsValue.value,
        users: usersValue.value,
        locked: Array.from(lockedMovies.values()),
      });
      success({
        title: 'Updated Room',
        message: 'Room updated successfully.',
      });
    } catch {
      showError({
        title: 'Error Updating Room',
        message: 'Failed to update room.',
      });
    } finally {
      showEditUsers.value = false;
    }
  }

  // Error
  watch(error, (val) => {
    if (val) {
      showError({
        title: 'Room Error',
        message: 'Failed to find room. Did it expire?',
      });
      router.replace('/');
    }
  });
  whenever(
    room,
    (roomValue) => {
      settingsValue.value = cloneDeep(roomValue.settings);
      usersValue.value = [...roomValue.users];
    },
    { immediate: true },
  );
</script>

<template>
  <div class="flex items-stretch gap-4 max-md:flex-col">
    <UCard
      class="md:basis-2/3"
      title="Results">
      <div
        v-if="!isFetched || count"
        class="flex h-full flex-col items-center justify-around gap-2 overflow-hidden">
        <UCarousel
          v-slot="{ item }"
          class="w-full"
          :ui="{
            item: 'basis-1/3 md:basis-1/4 min-w-40',
            container: count < 2 ? 'justify-center' : null,
          }"
          wheel-gestures
          skip-snaps
          :items="results ?? SKELETONS">
          <MoviePoster
            :data="item"
            :locked="!!item && lockedMovies.has(item.id)"
            @locked="
              (l) => {
                if (l) lockedMovies.add(item!.id);
                else lockedMovies.delete(item!.id);
              }
            " />
        </UCarousel>
        <ShareButton class="top-1 right-4 max-md:absolute max-md:-translate-y-full" />
      </div>
      <EmptyState
        v-else
        :with-decade="!!settingsValue.decade"
        :with-genre="!!settingsValue.genre?.length"
        :zero-threshold="(settingsValue.threshold ?? 1) < 1 / usersValue.length" />
    </UCard>
    <div class="flex flex-col gap-4 md:basis-1/3">
      <UCard title="Users">
        <template #title>
          <div class="flex w-full justify-between">
            <span class="font-heading mr-auto text-xl font-bold">Users</span>
            <BlendUsersModal
              v-if="room"
              v-model:open="showEditUsers"
              v-model:users="usersValue"
              class="inline-flex"
              @submitted="updateSubmitted" />
          </div>
        </template>
        <template #default>
          <div class="relative mx-auto flex w-fit flex-col items-center gap-2">
            <template v-if="room">
              <div
                v-for="user in room?.users"
                :key="user"
                class="flex w-full gap-2">
                <LetterboxdAvatar
                  class="size-6 grow-0"
                  :name="user" />
                <span class="text-info">{{ user }}</span>
              </div>
            </template>
            <template v-else>
              <div
                v-for="idx in 2"
                :key="idx"
                class="flex w-full gap-2">
                <LetterboxdAvatar class="size-6" />
                <span class="bg-paper h-6 w-32 animate-pulse rounded-sm" />
              </div>
            </template>
          </div>
        </template>
      </UCard>
      <UCard title="Settings">
        <BlendSettings
          v-model="settingsValue"
          :presets="false"
          submit-button-text="Update"
          @submitted="settingsClicked" />
      </UCard>
    </div>
    <ConfirmDialog
      v-model:open="showConfirmDialog"
      @confirm="updateSubmitted">
      <UAlert
        class="mx-auto mb-2"
        color="info"
        :icon="IconInfoCircle"
        variant="subtle"
        title="Updating the blend settings will re-compute the blend. This action is irreversible." />
      <div class="text-secondary mx-auto w-fit italic">
        Are you sure you want to update this blend?
      </div>
    </ConfirmDialog>
  </div>
</template>
