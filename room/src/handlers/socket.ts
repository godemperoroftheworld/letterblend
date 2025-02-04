import { Socket } from 'socket.io';
import RoomsService from '@/services/rooms';

const roomService = RoomsService.getInstance();

function onRoomJoin(socket: Socket) {
  const { user, id } = socket.data;
  const room = roomService.getRoom(id);
  room.addUser(user);
  socket.to(id).emit('join', user);
}

function onRoomLeave(socket: Socket) {
  const { user, id } = socket.data;
  const room = roomService.getRoom(id);
  room.removeUser(user);
  socket.leave(id);
  socket.to(id).emit('leave', user);
  if (room.empty) {
    roomService.deleteRoom(id);
  }
}

interface VoteRoomParams {
  movie: number;
  vote: boolean;
}
function onRoomRate(args: VoteRoomParams, socket: Socket) {
  const { user, id } = socket.data;
  const { movie, vote } = args;
  if (!movie || !vote) {
    return socket.emit('errors', ['Missing args. Must include movie ID and vote']);
  }
  const room = roomService.getRoom(id);
  room.voteForUser(user, movie, vote);
  const match = room.match;
  if (match) {
    socket.to(id).emit('match', match);
  }
  roomService.deleteRoom(id);
}

function onRoomStart(socket: Socket) {
  const { user, id } = socket.data;
  const room = roomService.getRoom(id);
  if (room.owner !== user) {
    return socket.emit('errors', ['User does not have permissions to start room']);
  }
  if (room.started) {
    return socket.emit('errors', ['Room already started']);
  }
  room.start();
  socket.to(id).emit('start');
}

export default { onRoomJoin, onRoomLeave, onRoomRate, onRoomStart };
