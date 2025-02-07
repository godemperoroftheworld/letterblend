import type { Ref } from 'vue';

export function computedDeep<T>(getter: () => T) {
  const value: Ref<T> = ref<T>();
  watch(
    getter,
    (val) => {
      value.value = val;
    },
    { immediate: true, deep: true },
  );
  return value;
}
