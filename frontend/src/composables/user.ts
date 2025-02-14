const useUser = createSharedComposable(() => {
  const user = useCookie<string>('user', {
    watch: true,
  });
  const internalUser = computed({
    get: () => user.value ?? '',
    set(val) {
      user.value = val;
    },
  });
  const isSet = computed(() => !!user.value?.length);
  const refresh = () => refreshCookie('user');
  return { user: internalUser, isSet, refresh };
});

export default useUser;
