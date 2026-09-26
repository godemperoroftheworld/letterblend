<script setup lang="ts">
  import LetterboxdAvatar from '@/components/ui/LetterboxdAvatar.vue';
  import { IconPlus, IconTrash } from '@tabler/icons-vue';

  interface Props {
    items: string[];
    showAddButton?: boolean;
    showRemoveButton?: boolean;
    canAdd?: boolean;
    canRemove?: boolean;
    disabled?: boolean;
  }
  type Emits = {
    remove: [];
    add: [];
  }

  const { showAddButton = false, showRemoveButton = true, canAdd = true, canRemove = true, items } = defineProps<Props>();
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
      :disabled="disabled"
      :ui="{
        base: 'ml-1'
      }"
      leading>
      <template #leading>
        <letterboxd-avatar class="size-6" :name="model" />
      </template>
    </UInputMenu>
    <UButton v-if="showRemoveButton" color="error" :disabled="!canRemove" :icon="IconTrash" @click="emits('remove')" />
    <UButton v-if="showAddButton" color="primary" :disabled="!canAdd" :icon="IconPlus" @click="emits('add')" />
  </div>
</template>
