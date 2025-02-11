<script setup lang="ts">
  import NameField from '@/components/ui/NameField.vue';
  import FormView from '@/components/ui/form/FormView.vue';
  import { useDataQuery } from '@/utils/query';
  import uniq from 'lodash/uniq';
  import { queryClient } from '@/plugins/query';
  import useUser from '@/composables/user';
  import Cookies from 'js-cookie';

  // Setup
  interface Props {
    submitted: (data: string[]) => Promise<void> | void;
    showSubmitButton?: boolean;
    loading?: boolean;
    values?: string[];
  }
  const { user: storageName } = useUser();
  const props = withDefaults(defineProps<Props>(), {
    values: () => [Cookies.get('user') as string, ''],
    showSubmitButton: true,
  });

  // Form data
  const userForm = ref();
  const userNames = computed<string[]>(() => userForm.value?.values?.name ?? []);
  const fixedNames = computed(() => {
    return uniq([
      storageName.value,
      ...userNames.value
        .filter((u) => !!u)
        .filter((u) => {
          const value = queryClient.getQueryData(['exists', u]);
          return value ? value.exists : false;
        }),
    ]);
  });

  // Autocomplete
  const { data: friends } = useDataQuery(['friends', storageName, fixedNames], '/user/friends', {
    config: {
      method: 'POST',
      data: { names: fixedNames },
    },
    transform: (data) => Object.keys(data),
  });

  // Update defaults when they change
  watch(
    () => props.values,
    (val) => {
      userForm.value?.update(val);
    },
  );

  // Expose
  defineExpose({
    data: userForm,
  });
</script>

<template>
  <form-view
    ref="userForm"
    name="userForm"
    :fields="{
      name: {
        as: NameField,
        rules: validateLetterboxdName,
        validateOnMount: true,
        props: {
          options: friends ?? [],
          debounceMs: 200,
        },
        array: true,
        length: { min: 2, max: 5 },
      },
    }"
    :loading="loading"
    :show-submit-button="showSubmitButton"
    :defaults="{ name: values }"
    :submitted="({ name }) => props.submitted({ name })">
  </form-view>
</template>
