<script setup lang="ts">
  import CardView from '@/components/ui/CardView.vue';
  import SlidesView from '@/components/ui/SlidesView.vue';
  import NameForm from '@/components/name/NameForm.vue';

  const router = useRouter();
</script>

<template>
  <div class="grid gap-4 max-lg:grid-rows-5 lg:grid-cols-5 lg:gap-8">
    <card-view
      title="Get Started"
      justify="center"
      class="max-lg:row-span-3 lg:col-span-3">
      <name-form @submitted="router.push({ name: 'create' })" />
    </card-view>
    <card-view
      title="How-To"
      class="max-lg:order-first max-lg:row-span-2 lg:col-span-2">
      <slides-view
        class="my-auto h-64 max-h-full w-full"
        :slides="[
          {
            title: 'Grab Some Friends',
            description: 'Friends are not provided...',
            image: '/img/friends.svg',
          },
          {
            title: `Use this app`,
            description: `You're already in the right place, might as well.`,
            image: '/img/app.svg',
          },
          {
            title: `Make a decision`,
            description: `It's easy now!`,
            image: '/img/decide.svg',
          },
          {
            title: 'Movie time!',
            description: 'Finally! That took forever...',
            image: '/img/movie.svg',
          },
        ]"
        :autoplay="5000" />
    </card-view>
  </div>
</template>
