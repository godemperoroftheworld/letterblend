<script setup lang="ts">
  import CardView from '@/components/ui/CardView.vue';
  import SlidesView from '@/components/ui/SlidesView.vue';
  import NameForm from '@/components/name/NameForm.vue';

  const router = useRouter();
</script>

<template>
  <div class="relative flex items-stretch gap-4 max-md:flex-col lg:gap-8">
    <card-view
      title="Get Started"
      justify="center"
      class="basis-3/5">
      <name-form @submitted="router.push({ name: 'create' })" />
    </card-view>
    <card-view
      title="How-To"
      class="basis-2/5">
      <slides-view
        class="h-full"
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
        :autoplay="0" />
    </card-view>
  </div>
</template>
