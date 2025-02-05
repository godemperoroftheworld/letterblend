import type { MaybeDeepRef } from '@/utils/unref';

interface BlendParams {
  top: number; // int, min 1
  threshold: number; // float, min 0 max 1
  data: boolean; // populate with TMDB data
}
interface BlendEntry {
  id: string;
  slug: string;
  users: string[];
  poster: string;
}
export function useBlend(names: MaybeDeepRef<string[]>, params?: MaybeDeepRef<BlendParams>) {
  return useDataQuery<BlendEntry[]>(['blend', names, params], 'blend', {
    config: {
      method: 'POST',
      data: { names, ...unrefDeep(params) },
    },
  });
}
