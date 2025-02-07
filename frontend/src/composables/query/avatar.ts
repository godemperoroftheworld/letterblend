import type { MaybeRefOrGetter } from 'vue';
import type { DataQueryOptions } from '@/utils/query';
import { useDataQuery } from '@/utils/query';

interface AvatarResponse {
  exists: boolean;
  url: string;
}
export default function useAvatar(
  user: MaybeRefOrGetter<string>,
  options?: DataQueryOptions<AvatarResponse, unknown>,
) {
  return useDataQuery<AvatarResponse, unknown, string>(
    ['avatar', user],
    () => `user/${toValue(user)}/avatar`,
    {
      options,
      transform(data) {
        if (data?.exists && data?.url) {
          return data.url;
        }
        return undefined;
      },
    },
  );
}
