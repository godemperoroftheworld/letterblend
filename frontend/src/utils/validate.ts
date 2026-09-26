import type { ExistsResponse } from '@/composables/query/exists';
import { fetchDataQuery } from '@/utils/query';

export async function validateLetterboxdName(name: string): Promise<boolean> {
  if (!name.length) return false;
  const result = await fetchDataQuery<ExistsResponse>(['exists', name], `user/${name}/exists`);
  return result?.exists ?? false;
}
