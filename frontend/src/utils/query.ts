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
import useLoader from '@/utils/load';
import { queryClient } from '@/plugins/query';

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
  showLoader?: boolean;
}

function buildQueryFn<T, E = DefaultError, R = T>(
  url,
  config: AxiosRequestConfig<T>,
  showLoader?: boolean,
): QueryFunction<T, Array<unknown>> {
  return async () => {
    if (showLoader) {
      const scope = effectScope();
      scope.run(() => {
        const { emit } = useLoader();
        emit(true);
      });
      scope.stop();
    }
    const result = await LetterblendAPI.instance.request<T>({
      ...unrefDeep(config),
      url: toValue(url),
    });
    if (showLoader) {
      const scope = effectScope();
      scope.run(() => {
        const { emit } = useLoader();
        emit(false);
      });
      scope.stop();
    }
    return result;
  };
}

function buildOptions<T, E = DefaultError>(
  key: Array<unknown>,
  queryFn: QueryFunction<T, Array<unknown>>,
  options: DataQueryOptions<T, E>,
): UseQueryOptions<T, E, T, T> {
  return {
    ...unref(options),
    queryKey: [...key],
    queryFn,
  };
}

export async function fetchDataQuery<T, E = DefaultError, R = T>(
  key: MaybeDeepRef<Array<unknown>>,
  url: MaybeRefOrGetter<string>,
  params: UseDataQueryParams<T, E, R>,
) {
  const state = queryClient.getQueryState(key);
  if (state == null) {
    const queryFn = buildQueryFn(url, params);
    await queryClient.fetchQuery(buildOptions(key, queryFn, params.options));
  } else if (state.status !== 'success') {
    await waitUntil(() => {
      const { status } = queryClient.getQueryState(key);
      return status === 'success';
    });
  }
  const result = queryClient.getQueryData(key);

  if (result != null) {
    return params.transform ? params.transform(result) : (result as unknown as R);
  }
  return undefined;
}

export function useDataQuery<T, E = DefaultError, R = T>(
  key: MaybeDeepRef<Array<unknown>>,
  url: MaybeRefOrGetter<string>,
  { options, config, transform, showLoader }: UseDataQueryParams<T, E, R>,
): DataQueryReturnType<T, E, R> {
  const queryFn = buildQueryFn(url, config);

  const queryOptions = computed(() => buildOptions(key, queryFn, options));

  const { data, error, ...rest } = useQuery(queryOptions.value, queryClient);
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
