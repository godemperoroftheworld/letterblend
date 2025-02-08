import { useEventBus } from '@vueuse/core';

const useLoader = createSharedComposable(() => {
  const loading = ref(false);
  const bus = useEventBus<boolean>('loader');
  bus.on((val) => (loading.value = val));

  return {
    loading,
    emit: bus.emit,
  };
});

export default useLoader;
