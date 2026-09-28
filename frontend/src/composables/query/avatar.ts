import type { MaybeRefOrGetter } from 'vue';
import type { DataQueryOptions } from '@/utils/query';
import { useDataQuery } from '@/utils/query';

interface AvatarResponse {
  exists: boolean;
  url: string;
}
export default function useAvatar(
  user: MaybeRefOrGetter<string>,
  options?: DataQueryOptions<AvatarResponse, Error, string | undefined>,
) {
  return useDataQuery<AvatarResponse, Error, string | undefined>(
    ['avatar', user],
    () => `user/${toValue(user)}/avatar`,
    {
      options,
      select: (data) => (data.exists && data.url ? data.url : undefined),
    },
  );
}
