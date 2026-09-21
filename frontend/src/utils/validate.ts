import type { ExistsResponse } from '@/composables/query/exists';
import { fetchDataQuery } from '@/utils/query';
import type { DefaultError } from '@tanstack/vue-query';

export const validateLetterboxdName = async (value: string): Promise<boolean> => {
  return (
    (await fetchDataQuery<ExistsResponse, DefaultError, boolean>(
      ['exists', value],
      `user/${value}/exists`,
      {
        transform: (result) => !!result?.exists,
      },
    )) ?? false
  );
}
