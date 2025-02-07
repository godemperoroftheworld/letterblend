export function computedDeep<T>(getter: () => T) {
  const value = ref<T>();
  watch(
    getter,
    (val) => {
      value.value = val;
    },
    { immediate: true, deep: true },
  );
  return value;
}
