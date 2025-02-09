import { Socket } from 'socket.io';
import RoomsService from '@/services/rooms';

async function onRoomJoin(socket: Socket) {
  const { user, id } = socket.data;
  const movies = await RoomsService.instance.getUserStack(id, user);
  socket.emit('stack', movies);
}

interface VoteRoomParams {
  movie: number;
  vote: boolean;
}
async function onRoomRate({ movie, vote }: VoteRoomParams, socket: Socket) {
  const { user, id } = socket.data;
  if (!movie || !vote) {
    return socket.emit('errors', ['Missing args. Must include movie ID and vote']);
  }
  await RoomsService.instance.rateMovie(id, user, movie, vote);
  const room = await RoomsService.instance.getRoom(id);
  if (room!.match) {
    socket.to(id).emit('match', room!.match);
  }
}

export default { onRoomJoin, onRoomRate };
