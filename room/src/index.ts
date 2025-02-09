import logger from 'jet-logger';
import socketRoutes from '@/routes/socket';
import io from '@/socket';
import EnvVars from '@/constants/env';
import server from '@/server';
import RoomsService from '@/services/rooms';
import client, { connectToDatabase } from '@/mongo';

const SERVER_START_MSG = 'Socket.IO server started on port: ' + EnvVars.Port.toString();

function shutDown() {
  client.close(() => logger.info('Closing database connection.'));
  server.close(() => logger.info('Closing server.'));
}

// Database
connectToDatabase().then(() => {
  logger.info("Connected to database.");
}).catch((e) => logger.err(new Error('Failed to connect to database.')))

// Express
server.listen(EnvVars.Port, "::", () => {
  logger.info(SERVER_START_MSG);
});
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Socket
io.use(async (socket, next) => {
  const { user, id } = socket.handshake.query;
  if (!user || !id) {
    next(new Error('Missing socket information'));
  } else {
    const room = await RoomsService.instance.getRoom(id as string);
    if (!room) {
      next(new Error(`No room matches the code: ${id}`));
    } else if (!room.users.some((u) => u.user === user as string)) {
      next(new Error(`Room ${id} does not contain user ${user}`));
    } else next();
  }
});
io.on('connection', async (socket) => {
  logger.info('Socket.IO connection');
  const { user, id } = socket.handshake.query;
  socket.join(id as string);
  socket.data = { user, id };
  await socketRoutes(socket);
});
