import useUser from '~/composables/user.ts';
import type { DefaultError } from '@tanstack/vue-query';

type FriendResult = Record<string, unknown>;

export default function useFriends(
  names: MaybeRefOrGetter<string[]>
) {
  const { user } = useUser();
  const fullNames = useDebounce(computed(() => [user.value, ...toValue(names)].filter(Boolean)), 250);
  return useDataQuery<FriendResult, DefaultError, string[]>(['friends', fullNames], () => `user/friends`, {
    config: {
      method: 'POST',
      data: { names: fullNames },
    },
    transform: (data) => Object.keys(data ?? {}),
  })
}