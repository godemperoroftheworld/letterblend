import type { DefaultError, MutationFunction } from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import type { Room, RoomSettings } from '@/types/room';
import LetterblendApi from '@/api';
import useLoader from '@/composables/load';
import { queryClient } from '@/plugins/query';
import { isNil, omitBy } from 'lodash';

function useRoomMutation<TVariables>(
  mutationKey: string[],
  mutationFn: MutationFunction<Room, TVariables>,
) {
  const { emit } = useLoader();
  return useMutation<Room, DefaultError, TVariables>({
    mutationKey,
    mutationFn,
    onMutate() {
      emit(true);
    },
    onSettled() {
      emit(false);
    },
    onSuccess(room) {
      queryClient.setQueryData(['room', room.code], room);
    },
  });
}

interface AddRoomVars {
  users: string[];
  settings: RoomSettings;
}
export function useAddRoom() {
  return useRoomMutation<AddRoomVars>(['room', 'add'], ({ users, settings }) =>
    LetterblendApi.instance.post<Room>('/room', { users, ...settings }),
  );
}

interface UpdateRoomVars {
  id: string;
  users: string[];
  settings: RoomSettings;
}
export function useUpdateRoom() {
  return useRoomMutation<UpdateRoomVars>(['room', 'update'], ({ id, users, settings }) =>
    LetterblendApi.instance.put<Room>(`/room/${id}`, { users, ...settings }),
  );
}
