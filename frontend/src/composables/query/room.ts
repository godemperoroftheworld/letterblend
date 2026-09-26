import type { MaybeRefOrGetter } from 'vue';
import type { Room } from '@/types/room';
import type { DataQueryOptions } from '@/utils/query';
import { useDataQuery } from '@/utils/query';

export function useRoom(
  code: MaybeRefOrGetter<string>,
  options?: DataQueryOptions<Room, Error, Room>,
) {
  return useDataQuery<Room, Error, Room>(
    () => ['room', toValue(code)],
    () => `room/${toValue(code)}`,
    {
      options,
    },
  );
}

interface RoomCountResponse {
  count: number;
}
export function useRoomCount() {
  return useDataQuery<RoomCountResponse, Error, number>(() => ['roomCount'], 'room/count', {
    select: (data) => data.count,
  });
}
