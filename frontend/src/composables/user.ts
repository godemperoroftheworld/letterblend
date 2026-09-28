const useUser = createSharedComposable(() => {
  const user = useLocalStorage<string>('user', '', { initOnMounted: true });
  const exists = computed(() => !!user.value.length);
  return { user, exists };
});

export default useUser;
