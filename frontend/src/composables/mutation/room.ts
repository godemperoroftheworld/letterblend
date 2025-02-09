import type { DefaultError, MutationFunction } from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import type { BlendSettings } from '@/components/blend/BlendSettings.vue';
import LetterblendApi from '@/api';
import type { Room } from '@/types/room';
import { queryClient } from '@/plugins/query';
import useLoader from '@/composables/load';

interface AddRoomVars {
  users: string[];
  settings: BlendSettings;
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
