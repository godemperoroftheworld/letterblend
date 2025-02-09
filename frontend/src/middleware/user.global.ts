import useUser from '@/composables/user';
import { abortNavigation } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  const { isSet, refresh } = useUser();
  refresh();
  const excludePaths = ['/', '/auth'];
  if (!excludePaths.includes(to.path) && !isSet.value) {
    return navigateTo(`/auth?redirect=${to.path}`, {});
  }
  if (to.path === '/auth' && isSet.value) {
    return abortNavigation();
  }
});
