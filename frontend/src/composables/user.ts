const useUser = createSharedComposable(() => {
  const user = useCookie<string>('user', {
    watch: true,
  });
  const isSet = computed(() => !!user.value?.length);
  const refresh = () => refreshCookie('user');
  return { user, isSet, refresh };
});

export default useUser;
