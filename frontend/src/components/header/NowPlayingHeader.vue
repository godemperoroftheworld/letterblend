<script setup lang="ts">
  import BulbRow from '~/components/header/BulbRow.vue';
  import LetterboxdIcon from '~/components/ui/icons/LetterboxdIcon.vue';
</script>

<template>
  <div class="bg-dark w-full flex flex-col justify-between py-2">
    <BulbRow class="mb-4" />
    <div class="flex flex-col grow items-center justify-between bg-linear-to-b from-paper/25 from-[1px] via-dark via-[1px] to-dark  bg-size-[100%_20px] ">
      <span class="uppercase text-bulb drop-shadow-round drop-shadow-bulb/50 font-extra font-medium -mt-0.5">Now Screening</span>
      <ULink to="/" as="div" class="flex flex-col items-center justify-center">
        <LetterboxdIcon class="h-10" shadow />
        <h1 class="text-4xl text-white drop-shadow-round-lg drop-shadow-white/50 font-bold">Letterblend</h1>
      </ULink>
      <span class="mb-2.5 italic text-white/70">
        Bringing stress-free movie nights to living rooms near you !
      </span>
    </div>
    <BulbRow />
  </div>
</template>