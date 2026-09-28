<script setup lang="ts">
  import LoadingIcon from '@/components/ui/icons/LoadingIcon.vue';
  import useLoader from '@/composables/load';

  const { loading } = useLoader();
</script>

<template>
  <client-only>
    <teleport to="#teleports">
      <div>
        <transition name="fade">
          <div
            v-show="loading"
            class="fixed top-0 left-0 z-20 h-dvh w-dvw bg-slate-500/50" />
        </transition>
        <transition name="scale">
          <loading-icon
            v-show="loading"
            class="text-background fixed top-1/2 left-1/2 z-20 size-24 -translate-x-1/2 -translate-y-1/2" />
        </transition>
      </div>
    </teleport>
  </client-only>
</template>
