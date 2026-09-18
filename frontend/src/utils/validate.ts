import { string } from 'yup';
import type { GenericValidateFunction } from 'vee-validate';
import type { ExistsResponse } from '@/composables/query/exists';
import { fetchDataQuery } from '@/utils/query';
import type { DefaultError } from '@tanstack/vue-query';

export const validateLetterboxdName: GenericValidateFunction<string> = async (value: string) => {
  try {
    await string().required().validate(value);
  } catch (e) {
    if (typeof e === 'object' && e != null && 'errors' in e) {
      return e.errors as string[];
    }
    return [];
  }

  const exists = await fetchDataQuery<ExistsResponse, DefaultError, boolean>(
    ['exists', value],
    `user/${value}/exists`,
    {
      transform: (result) => !!result?.exists,
    },
  );
  if (exists) return true;
  return 'No such letterboxd user found';
};
