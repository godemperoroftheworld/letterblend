import type { MaybeRefOrGetter } from 'vue';
import type { DataQueryOptions } from '@/utils/query';
import { useDataQuery } from '@/utils/query';

export type FriendsResponse = Record<string, unknown>;

export default function useFriends(
  names: MaybeRefOrGetter<string[]>,
  options?: DataQueryOptions<FriendsResponse, Error, string[]>,
) {
  const fullNames = computed(() => [...toValue(names)].filter(Boolean));
  return useDataQuery<FriendsResponse, Error, string[]>(['friends', fullNames], 'user/friends', {
    options,
    config: { method: 'POST', data: { names: fullNames } },
  });
}
