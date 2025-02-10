<script setup lang="ts">
  import ContentView from '@/components/ui/ContentView.vue';
  import CardView from '@/components/ui/CardView.vue';

  interface Props {
    show: boolean;
    title?: string;
  }
  defineProps<Props>();
  const emits = defineEmits(['close']);

  const contentRef = ref();
</script>

<template>
  <teleport to="#teleports">
    <div>
      <transition name="fade">
        <div
          v-if="show"
          class="fixed top-0 left-0 z-10 h-dvh w-dvw bg-slate-500/50"
          @click="emits('close')" />
      </transition>
      <transition name="scale">
        <content-view
          v-show="show"
          ref="contentRef"
          class="absolute-center z-10 h-fit w-full max-w-lg p-2">
          <card-view :title="title">
            <slot v-bind="{ close: () => emits('close') }" />
          </card-view>
        </content-view>
      </transition>
    </div>
  </teleport>
</template>
