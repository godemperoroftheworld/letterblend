import useUser from '@/composables/user';

export default defineNuxtRouteMiddleware((to) => {
  const { isSet } = useUser();
  const excludePaths = ['/', '/auth'];
  if (!excludePaths.includes(to.path) && !isSet.value) {
    return navigateTo(`/auth?redirect=${to.path}`, {});
  }
});
