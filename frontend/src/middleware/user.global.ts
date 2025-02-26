import useUser from '@/composables/user';

export default defineNuxtRouteMiddleware((to) => {
  const { exists } = useUser();
  const excludePaths = ['/', '/auth'];
  if (!excludePaths.includes(to.path) && !exists.value) {
    return navigateTo(`/auth?redirect=${to.path}`);
  }
});
