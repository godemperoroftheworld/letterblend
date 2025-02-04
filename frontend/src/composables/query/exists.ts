import type { MaybeRefOrGetter } from 'vue';
import type { DataQueryOptions } from '@/utils/query';

export interface ExistsResponse {
  exists: boolean;
}
export default function useExists(
  user: MaybeRefOrGetter<string>,
  options?: DataQueryOptions<ExistsResponse, unknown>,
) {
  return useDataQuery<ExistsResponse, unknown, boolean>(
    ['exists', user],
    () => `user/${toValue(user)}/exists`,
    {
      options,
      transform(data) {
        return data !== undefined ? data.exists : data;
      },
    },
  );
}
