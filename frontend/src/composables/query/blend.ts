import type { MaybeDeepRef } from '@/utils/unref';
import type { Movie } from '@/types/movie';
import type { DefaultError } from '@tanstack/vue-query';

export interface BlendParams {
  top: number; // int, min 1
  threshold: number; // float, min 0 max 1
  details: boolean; // populate with TMDB data
}
export function useBlend(names: MaybeDeepRef<string[]>, params?: MaybeDeepRef<BlendParams>) {
  return useDataQuery<Movie[], DefaultError, Movie[]>(['blend', names, params], 'blend', {
    config: {
      method: 'POST',
      data: { names, ...unrefDeep(params) },
    },
  });
}
