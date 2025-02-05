import type {
  DefaultError,
  QueryFunction,
  QueryObserverOptions,
  UseQueryOptions,
  UseQueryReturnType,
} from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import LetterblendAPI from '@/api';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, unref, watch } from 'vue';
import type { MaybeDeepRef } from '@/utils/unref';
import type { MaybeRef } from '@vueuse/core';
import Notifier from '@/utils/notification';

export type DataQueryReturnType<T, E = DefaultError, R = T> = Omit<
  UseQueryReturnType<T, E>,
  'data'
> & {
  data: Ref<R | undefined>;
  count: Ref<number | undefined>;
};

export type DataQueryOptions<T, E = DefaultError> = MaybeRef<{
  [Property in keyof Omit<
    QueryObserverOptions<T, E, T, T, Array<unknown>>,
    'queryFn' | 'queryKey'
  >]: Property extends 'enabled'
    ? MaybeRefOrGetter<QueryObserverOptions<T, E, T, T, Array<unknown>>[Property]>
    : MaybeDeepRef<QueryObserverOptions<T, E, T, T, Array<unknown>>[Property]>;
}>;
export interface UseDataQueryParams<T, E = DefaultError, R = T> {
  options?: DataQueryOptions<T, E>;
  config?: Omit<AxiosRequestConfig<T>, 'url' | 'baseURL'>;
  transform?: (data: T | undefined) => R | undefined;
}

export function useDataQuery<T, E = DefaultError, R = T>(
  key: MaybeDeepRef<Array<unknown>>,
  url: MaybeRefOrGetter<string>,
  { options, config, transform }: UseDataQueryParams<T, E, R>,
): DataQueryReturnType<T, E, R> {
  const queryFn: QueryFunction<T, Array<unknown>> = async () => {
    return await LetterblendAPI.instance.request<T>({
      ...unrefDeep(config),
      url: toValue(url),
    });
  };

  const queryKey = computed<Array<unknown>>(() => {
    const originalKey = key as Array<unknown>;
    return [...originalKey];
  });

  const queryOptions = computed(() => {
    return {
      ...unref(options),
      queryKey,
      queryFn,
    } as UseQueryOptions<T, E, T, T, Array<unknown>>;
  });

  const { data, error, ...rest } = useQuery(queryOptions.value);
  const newData = computed(() => {
    if (data.value) {
      return transform ? transform(data.value) : (data.value as unknown as R);
    }
    return undefined;
  });

  watch(error, (val) => {
    if (val instanceof AxiosError) {
      Notifier.instance().error({ title: val.name, message: val.message });
    }
  });
  return { data: newData, ...rest } as unknown as DataQueryReturnType<T, E, R>;
}
