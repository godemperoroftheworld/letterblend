import type { Room } from '@/types/room';
import type { DefaultError } from '@tanstack/vue-query';
import type { DataQueryOptions } from '@/utils/query';

export function useRoom(code: MaybeRef<string>, options: DataQueryOptions<Room>) {
  return useDataQuery<Room, DefaultError, Room>(['room', code], () => `/room/${unref(code)}`, {
    options,
  });
}

export function useRoomCount() {
  return useDataQuery<{ count: number }, DefaultError, number>(['roomCount'], () => `/room/count`, {
    transform: (data) => data?.count ?? 0,
  });
}