const useParticles = createSharedComposable(() => {
  const enabled = useLocalStorage('particles', true, { initOnMounted: true });
  return { enabled };
});

export default useParticles;
