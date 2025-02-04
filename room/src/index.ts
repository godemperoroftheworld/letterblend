import logger from 'jet-logger';
import socketRoutes from '@/routes/socket';
import io from '@/socket';
import EnvVars from '@/constants/env';
import server from '@/server';
import RoomsService from '@/services/rooms';

const SERVER_START_MSG = 'Socket.IO server started on port: ' + EnvVars.Port.toString();
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});
io.use((socket, next) => {
  const { user, id } = socket.handshake.query;
  if (!user || !id) {
    next(new Error('Missing socket information'));
  } else if (!RoomsService.getInstance().hasRoom(id as string)) {
    next(new Error('Room does not exist'));
  } else {
    next();
  }
});
io.on('connection', (socket) => {
  logger.info('Socket.IO connection');
  const { user, id } = socket.handshake.query;
  socket.join(id as string);
  socket.data = { user, id };
  socketRoutes(socket);
});
