import type {
  DefaultError,
  QueryFunction,
  QueryObserverOptions,
  UseQueryReturnType,
  UseQueryOptions,
} from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type { Sort } from '@/types/sort';
import type { AxiosRequestConfig } from 'axios';
import LetterblendAPI from '@/api';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, unref, watch } from 'vue';
import type { MaybeDeepRef } from '@/utils/unref';
import { unrefDeep } from '@/utils/unref';
import type { MaybeRef } from '@vueuse/core';
import Notifier from '@/utils/notification';
import { AxiosError } from 'axios';

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
export type DataQueryProps = {
  page?: number;
  sort?: Sort[];
  filter?: string;
  count?: boolean;
};
export interface UseDataQueryParams<T, E = DefaultError, R = T> {
  options?: DataQueryOptions<T, E>;
  config?: Omit<AxiosRequestConfig<T>, 'url' | 'baseURL'>;
  props?: MaybeDeepRef<DataQueryProps>;
  transform?: (data: T | undefined) => R | undefined;
}

export const PAGE_SIZE = 15;

export function useDataQuery<T, E = DefaultError, R = T>(
  key: MaybeDeepRef<Array<unknown>>,
  url: MaybeRefOrGetter<string>,
  { options, config, props = {}, transform }: UseDataQueryParams<T, E, R>,
): DataQueryReturnType<T, E, R> {
  const queryConfig = computed(() => {
    const queryConfig = { ...config, params: { ...config?.params } };
    const { page, sort, filter, count } = unrefDeep(props);
    queryConfig.params['$filter'] = filter;
    queryConfig.params['$orderby'] = sort
      ?.map((s) => `${s.id} ${s.desc ? 'desc' : 'asc'}`)
      .join(' and ');
    if (page !== undefined) {
      queryConfig.params['$top'] = PAGE_SIZE;
      queryConfig.params['$skip'] = PAGE_SIZE * page;
    }
    if (count !== undefined) {
      queryConfig.params['$count'] = count;
    }
    return queryConfig;
  });

  const queryFn: QueryFunction<T, Array<unknown>> = async () => {
    return LetterblendAPI.instance.request<T>({ ...queryConfig.value, url: toValue(url) });
  };

  const queryKey = computed<Array<unknown>>(() => {
    const originalKey = key as Array<unknown>;
    const queryKey = [...originalKey];
    const { page, sort, filter } = unrefDeep(props);
    if (page) queryKey.push(page);
    if (sort) queryKey.push(sort);
    if (filter) queryKey.push(filter);
    return queryKey;
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
