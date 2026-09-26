import useUser from '~/composables/user.ts';
import type { DefaultError } from '@tanstack/vue-query';

type FriendResult = Record<string, unknown>;

export default function useFriends(
  names: MaybeRefOrGetter<string[]>
) {
  const { user } = useUser();
  return useDataQuery<FriendResult, DefaultError, string[]>(['friends', user, names], () => `user/friends`, {
    config: {
      method: 'POST',
      data: { names },
    },
    options: {
      enabled: () => [user.value, ...toValue(names)].every((n) => !!n.length),
    },
    transform: (data) => Object.keys(data ?? {}),
  })
}