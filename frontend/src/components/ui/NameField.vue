<script setup lang="ts">
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import { IconPlus, IconTrash } from '@tabler/icons-vue';

  interface Props {
    items: string[];
    showAddButton?: boolean;
    showRemoveButton?: boolean;
  }
  type Emits = {
    remove: [];
    add: [];
  }

  const { showAddButton = false, showRemoveButton = true, items } = defineProps<Props>();
  const model = defineModel<string>({ default: '' });
  const emits = defineEmits<Emits>();
</script>

<template>
  <div class="flex gap-2">
    <UInputMenu
      v-model="model"
      :items="items"
      :content="{ hideWhenEmpty: true }"
      mode="autocomplete"
      size="lg"
      class="box-border pl-10 md:pl-2">
      <template #leading>
        <letterboxd-avatar class="size-6" :name="model" />
      </template>
    </UInputMenu>
    <UButton v-if="showRemoveButton" color="error" :icon="IconTrash" @click="emits('remove')" />
    <UButton v-if="showAddButton" color="primary" :icon="IconPlus" @click="emits('add')" />
  </div>
</template>
