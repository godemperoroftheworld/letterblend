import useUser from '@/composables/user';

export default defineNuxtRouteMiddleware((to) => {
  const { exists } = useUser();
  const router = useRouter();
  const excludePaths = ['/', '/auth'];
  if (import.meta.server) return;
  if (!excludePaths.includes(to.path) && !exists.value) {
    router.replace(`/auth?redirect=${to.path}`);
  }
});
