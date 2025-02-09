import { Socket } from 'socket.io';
import socketHandlers from '@/handlers/socket';

export default async function handleRoutes(socket: Socket) {
  await socketHandlers.onRoomJoin(socket);
  socket.on('vote', (args) => socketHandlers.onRoomRate(args, socket));
}
