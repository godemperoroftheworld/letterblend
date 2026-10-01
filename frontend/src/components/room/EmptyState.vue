<script setup lang="ts">
  import {
    IconCalendar,
    IconCategory2,
    IconDeviceTv,
    IconMetronome,
    IconTicketOff,
  } from '@tabler/icons-vue';

  enum ChangeSuggestion {
    DECADE = 'DECADE',
    GENRE = 'GENRE',
    THRESHOLD = 'THRESHOLD',
    WATCHLIST = 'WATCHLIST',
  }
  interface Suggestion {
    text: string;
    icon: Component;
  }

  const SUGGESTION_ITEMS: Record<ChangeSuggestion, Suggestion> = {
    [ChangeSuggestion.DECADE]: { text: 'Pick a different decade', icon: IconCalendar },
    [ChangeSuggestion.GENRE]: { text: 'Pick different genres', icon: IconCategory2 },
    [ChangeSuggestion.THRESHOLD]: { text: 'Set a lower threshold', icon: IconMetronome },
    [ChangeSuggestion.WATCHLIST]: { text: 'Watchlist more movies', icon: IconDeviceTv },
  };

  interface Props {
    withDecade: boolean;
    withGenre: boolean;
    zeroThreshold: boolean;
  }
  const { withDecade, withGenre, zeroThreshold } = defineProps<Props>();

  const suggestions = computed(() => {
    const suggestionKeys: Set<ChangeSuggestion> = new Set();
    if (withDecade) {
      suggestionKeys.add(ChangeSuggestion.DECADE);
    }
    if (withGenre) {
      suggestionKeys.add(ChangeSuggestion.GENRE);
    }
    if (!zeroThreshold) {
      suggestionKeys.add(ChangeSuggestion.THRESHOLD);
    }
    suggestionKeys.add(ChangeSuggestion.WATCHLIST);

    return Object.entries(SUGGESTION_ITEMS)
      .filter(([key]) => suggestionKeys.has(ChangeSuggestion[key as keyof typeof ChangeSuggestion]))
      .map(([key, value]) => ({ key, ...value }));
  });
</script>
<template>
  <UEmpty
    variant="naked"
    title="">
    <template #leading>
      <IconTicketOff class="size-24 text-slate-200" />
    </template>
    <template #title>
      <div class="text-slate-50">
        No results for your blend <span class="text-lg font-black">( . ‸ .)</span>
      </div>
    </template>
    <template #description>
      <div class="mt-3 text-slate-300">
        <template
          v-for="(suggestion, idx) in suggestions"
          :key="suggestion.key">
          <div class="flex items-center gap-2">
            <component
              :is="suggestion.icon"
              class="size-8" />
            {{ suggestion.text }}
          </div>
          <div
            v-if="idx < suggestions.length - 1"
            class="mx-auto flex w-fit flex-col items-center justify-center">
            <div class="h-1 w-px bg-slate-400" />
            <span class="py-0.5 font-mono text-xs leading-none font-medium text-slate-400">OR</span>
            <div class="h-1 w-px bg-slate-400" />
          </div>
        </template>
      </div>
    </template>
  </UEmpty>
</template>
