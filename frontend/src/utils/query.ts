import type { DefaultError, QueryKey, QueryOptions, UseQueryReturnType } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import type { MaybeRefOrGetter } from 'vue';
import { toValue, watch } from 'vue';
import LetterblendApi from '@/api';
import useLoader from '@/composables/load';
import { queryClient } from '@/plugins/query';
import { unrefDeep } from '@/utils/unref';
import { until } from '@vueuse/core';

export type DataQueryReturnType<TData, TError = DefaultError> = UseQueryReturnType<TData, TError>;

export type DataQueryOptions<TQueryFnData, TError = DefaultError, TData = TQueryFnData> = Omit<
  QueryOptions<TQueryFnData, TError, TData, TQueryFnData, QueryKey>,
  'queryKey' | 'queryFn' | 'initialData' | 'placeholderData'
>;

type RequestConfig<TQueryFnData> = Omit<AxiosRequestConfig<TQueryFnData>, 'url' | 'baseURL'>;

export interface UseDataQueryParams<TQueryFnData, TError = DefaultError, TData = TQueryFnData> {
  options?: DataQueryOptions<TQueryFnData, TError, TData>;
  config?: MaybeRefOrGetter<RequestConfig<TQueryFnData>>;
  select?: (data: TQueryFnData) => TData;
  showLoader?: boolean;
}

function buildQueryFn<TQueryFnData>(
  url: MaybeRefOrGetter<string>,
  config: MaybeRefOrGetter<RequestConfig<TQueryFnData>>,
  showLoader: boolean,
) {
  return async () => {
    const { emit } = useLoader();
    if (showLoader) emit(true);
    try {
      return await LetterblendApi.instance.request<TQueryFnData>({
        ...unrefDeep(toValue(config)),
        url: toValue(url),
      });
    } finally {
      if (showLoader) emit(false);
    }
  };
}

export function useDataQuery<TQueryFnData, TError = DefaultError, TData = TQueryFnData>(
  key: MaybeRefOrGetter<QueryKey>,
  url: MaybeRefOrGetter<string>,
  {
    options,
    config,
    select,
    showLoader = false,
  }: UseDataQueryParams<TQueryFnData, TError, TData> = {},
): DataQueryReturnType<TData, TError> {
  const { error: showError } = useNotify();
  const selectData = select && ((data: TQueryFnData) => select(data));

  const query = useQuery<TQueryFnData, TError, TData, QueryKey>(
    () => ({
      queryKey: toValue(key),
      queryFn: buildQueryFn<TQueryFnData>(url, config ?? {}, showLoader),
      select: selectData,
      ...options,
    }),
    queryClient,
  );
  const { error } = query;

  watch(error, (val) => {
    if (val instanceof AxiosError) {
      showError({ title: val.name, message: val.message });
    }
  });

  return query;
}

export async function fetchDataQuery<TQueryFnData>(
  key: MaybeRefOrGetter<QueryKey>,
  url: MaybeRefOrGetter<string>,
  config: MaybeRefOrGetter<RequestConfig<TQueryFnData>> = {},
): Promise<TQueryFnData | undefined> {
  const queryKey = toValue(key);
  const options = {
    queryKey,
    queryFn: buildQueryFn<TQueryFnData>(url, config, false),
  } satisfies QueryOptions<TQueryFnData, DefaultError, TQueryFnData, TQueryFnData, QueryKey>;

  const state = queryClient.getQueryState(queryKey);
  if (state == null) {
    await queryClient.query(options);
  } else if (state.status !== 'success') {
    await until(() => queryClient.getQueryState(queryKey)?.status === 'success').toBeTruthy();
  }

  return queryClient.getQueryData<TQueryFnData>(queryKey);
}
