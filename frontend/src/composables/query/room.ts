import type { MaybeRef } from '@vueuse/core';
import type { Room } from '@/types/room';
import type { DefaultError } from '@tanstack/vue-query';

export function useRoom(code: MaybeRef<string>) {
  return useDataQuery<Room, DefaultError, Room>(['room', code], () => `/room/${unref(code)}`, {});
}
