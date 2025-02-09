<script setup lang="ts">
  import MoviePoster from '@/components/ui/MoviePoster.vue';
  import CardView from '@/components/ui/CardView.vue';
  import CarouselView from '@/components/ui/CarouselView.vue';
  import type { Movie } from '@/types/movie';
  import { breakpointsTailwind } from '@vueuse/core';
  import { useRoom } from '@/composables/query/room';
  import { useUpdateSettings } from '@/composables/mutation/room';
  import type { RoomSettings } from '@/types/room';
  import GenericButton from '@/components/ui/button/GenericButton.vue';
  import { IconShare } from '@tabler/icons-vue';
  import { Tippy, useTippy, useTippyComponent } from 'vue-tippy';
  import useUser from '@/composables/user';

  // Data
  const route = useRoute();
  const { isSet: hasName } = useUser();
  const code = computed(() => route.params.code as string);
  const { data: room, isFetching } = useRoom(code, {
    enabled: hasName,
  });
  const results = computed(() => room.value?.movies);

  // Visual
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isSmall = breakpoints.smaller('md');

  // Settings Update
  const { mutateAsync: updateSettings } = useUpdateSettings();
  async function settingsSubmitted(settings: RoomSettings) {
    await updateSettings({ id: room.value!.code, settings });
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
  <div class="gap-2 max-md:flex max-md:flex-col md:grid md:grid-cols-5 md:gap-4 lg:gap-8">
    <card-view
      title="Results"
      class="h-fit shrink-0 md:col-span-3">
      <carousel-view
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
          ref="tippyRef"
          class="w-40"
          button-style="info"
          @click="share">
          <icon-share />
          Share
        </generic-button>
      </template>
      <template v-else>
        <tippy
          content="Copied to clipboard."
          trigger="click">
          <generic-button
            ref="tippyRef"
            class="w-40"
            button-style="info"
            @click="share">
            <icon-share />
            Share
          </generic-button>
        </tippy>
      </template>
    </card-view>
    <card-view
      class="h-fit md:col-span-2"
      :collapsable="isSmall"
      title="Settings">
      <blend-settings
        :submitted="settingsSubmitted"
        :loading="isFetching"
        submit-button-text="Update"
        :show-submit-button="true" />
    </card-view>
  </div>
</template>
