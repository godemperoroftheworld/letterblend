const useUser = createSharedComposable(() => {
  const user = useCookie<string>('user', {
    watch: true,
    sameSite: true,
    default: () => '',
  });
  const exists = computed(() => !!user.value.length);
  return { user, exists };
});

export default useUser;
