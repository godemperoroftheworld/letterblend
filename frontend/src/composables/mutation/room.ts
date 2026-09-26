import type { DefaultError, MutationFunction } from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import type { Room, RoomSettings } from '@/types/room';
import LetterblendApi from '@/api';
import useLoader from '@/composables/load';
import { queryClient } from '@/plugins/query';

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

interface UpdateSettingsVars {
  id: string;
  settings: RoomSettings;
}
export function useUpdateSettings() {
  return useRoomMutation<UpdateSettingsVars>(['room', 'update-settings'], ({ id, settings }) =>
    LetterblendApi.instance.put<Room>(`/room/${id}/settings`, settings),
  );
}

interface UpdateUsersVars {
  id: string;
  users: string[];
}
export function useUpdateUsers() {
  return useRoomMutation<UpdateUsersVars>(['room', 'update-users'], ({ id, users }) =>
    LetterblendApi.instance.put<Room>(`/room/${id}/users`, { users }),
  );
}
