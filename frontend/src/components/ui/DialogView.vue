<script setup lang="ts">
  import ContentView from '@/components/ui/ContentView.vue';
  import CardView from '@/components/ui/CardView.vue';

  interface Props {
    show: boolean;
    title?: string;
    width?: 'sm' | 'md' | 'lg' | 'xl';
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['close']);

  const contentRef = ref();
  const maxWidth = computed(() => {
    switch (props.width) {
      case 'sm':
        return 'w-sm';
      case 'md':
        return 'w-md';
      case 'lg':
        return 'w-lg';
      case 'xl':
        return 'w-xl';
      default:
        return 'w-fit';
    }
  });
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
        <div
          v-show="show"
          ref="contentRef"
          class="absolute-center z-10 h-fit w-fit max-w-dvw p-4">
          <content-view
            :class="maxWidth"
            class="max-w-full p-2">
            <card-view :title="title">
              <slot v-bind="{ close: () => emits('close') }" />
            </card-view>
          </content-view>
        </div>
      </transition>
    </div>
  </teleport>
</template>
