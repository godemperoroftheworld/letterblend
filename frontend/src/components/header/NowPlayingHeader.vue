<script setup lang="ts">
  import BulbRow from '~/components/header/BulbRow.vue';
  import LetterboxdIcon from '~/components/ui/icons/LetterboxdIcon.vue';
</script>

<template>
  <div
    class="bg-dark drop-shadow-dark/50 sticky top-0 z-2 flex h-56 w-full flex-col py-2 drop-shadow sm:max-md:h-40">
    <BulbRow class="mb-4" />
    <div
      class="from-paper/25 via-dark to-dark flex grow flex-col items-center justify-between bg-linear-to-b from-[1px] via-[1px] bg-size-[100%_20px]">
      <span
        class="text-bulb drop-shadow-round drop-shadow-bulb/50 font-extra -mt-0.75 text-lg font-medium uppercase">
        Now Screening
      </span>
      <ULink
        to="/"
        as="div"
        class="flex grow flex-col items-center justify-center">
        <LetterboxdIcon
          class="h-6 md:h-10"
          shadow />
        <h1
          class="drop-shadow-round-lg text-3xl font-bold text-white drop-shadow-white/50 md:text-4xl">
          Letterblend
        </h1>
      </ULink>
      <span class="mb-4.5 sm:hidden"> Blend together your Letterboxd watchlists! </span>
    </div>
    <div class="absolute top-10 left-4">
      <slot name="left" />
    </div>
    <div class="absolute top-10 right-4">
      <slot name="right" />
    </div>
    <BulbRow class="mt-2" />
  </div>
</template>
