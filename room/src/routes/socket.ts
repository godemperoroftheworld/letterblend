import { Socket } from 'socket.io';
import socketHandlers from '@/handlers/socket';

export default function handleRoutes(socket: Socket) {
  socketHandlers.onRoomJoin(socket);
  socket.on('vote', (args) => socketHandlers.onRoomRate(args, socket));
  socket.on('disconnect', () => socketHandlers.onRoomLeave(socket));
  socket.on('start', socketHandlers.onRoomStart);
}
