import type { DefaultError, MutationFunction } from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import LetterblendApi from '@/api';
import type { Room, RoomSettings } from '@/types/room';
import { queryClient } from '@/plugins/query';
import useLoader from '@/composables/load';

interface AddRoomVars {
  users: string[];
  settings: RoomSettings;
}
export function useAddRoom() {
  const mutationFn: MutationFunction<Room, AddRoomVars> = async ({
    users,
    settings,
  }: AddRoomVars) => {
    return LetterblendApi.instance.post('/room', { users, ...settings });
  };

  const { emit } = useLoader();
  return useMutation<Room, DefaultError, AddRoomVars>({
    mutationKey: ['room', 'add'],
    mutationFn,
    onMutate() {
      emit(true);
    },
    onSettled() {
      emit(false);
    },
    onSuccess: async (room) => {
      queryClient.setQueryData(['room', room.code], room);
    },
  });
}

interface UpdateSettingsVars {
  id: string;
  settings: RoomSettings;
}
export function useUpdateSettings() {
  const mutationFn: MutationFunction<Room, UpdateSettingsVars> = async ({ id, settings }) => {
    return LetterblendApi.instance.put(`/room/${id}/settings`, settings);
  };
  const { emit } = useLoader();
  return useMutation<Room, DefaultError, UpdateSettingsVars>({
    mutationKey: ['room', 'update-settings'],
    mutationFn,
    onMutate() {
      emit(true);
    },
    onSettled() {
      emit(false);
    },
    onSuccess: async (room) => {
      queryClient.setQueryData(['room', room.code], room);
    },
  });
}

interface UpdateUsersVars {
  id: string;
  users: string[];
}
export function useUpdateUsers() {
  const mutationFn: MutationFunction<Room, UpdateUsersVars> = async ({ id, users }) => {
    return LetterblendApi.instance.put(`/room/${id}/users`, { users });
  };
  const { emit } = useLoader();
  return useMutation<Room, DefaultError, UpdateUsersVars>({
    mutationKey: ['room', 'update-users'],
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
