import { string } from 'yup';
import type { GenericValidateFunction } from 'vee-validate';
import type { ExistsResponse } from '@/composables/query/exists';
import { queryClient } from '@/plugins/query';
import LetterblendApi from '@/api';

export const validateLetterboxdName: GenericValidateFunction<string> = async (value: string) => {
  try {
    await string().required().validate(value);
  } catch (e: any) {
    return e.errors as string[];
  }
  let exists = queryClient.getQueryData(['exists', value]);
  if (exists == null) {
    const data = await LetterblendApi.instance.get<ExistsResponse>(`user/${value}/exists`);
    exists = data.exists;
    queryClient.setQueryData(['exists', value], exists);
  }
  if (exists) return true;
  return 'No such letterboxd user found';
};
