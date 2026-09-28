import type { MaybeRefOrGetter } from 'vue';
import type { DataQueryOptions } from '@/utils/query';
import { useDataQuery } from '@/utils/query';

export interface ExistsResponse {
  exists: boolean;
}
export default function useExists(
  user: MaybeRefOrGetter<string>,
  options?: DataQueryOptions<ExistsResponse, Error, boolean>,
) {
  return useDataQuery<ExistsResponse, Error, boolean>(
    ['exists', user],
    () => `user/${toValue(user)}/exists`,
    {
      options,
      select: (data) => data.exists,
    },
  );
}
