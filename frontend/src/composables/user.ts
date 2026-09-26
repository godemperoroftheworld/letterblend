const useUser = createSharedComposable(() => {
  const user = useLocalStorage<string>('user', '');
  const exists = computed(() => !!user.value.length);
  return { user, exists };
});

export default useUser;
