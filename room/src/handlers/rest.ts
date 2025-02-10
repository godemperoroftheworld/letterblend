import { RequestHandler } from 'express';
import RoomsService, { Movie } from '@/services/rooms';
import io from '@/socket';
import { HttpStatusCode } from 'axios';
import uniq from 'lodash/uniq';
import { MongoServerError } from 'mongodb';

// TODO : Rooms use MongoDB, Rooms Primary way of interacting with the app
// FLOW: submit form with users, settings -> bff, gets blend from scraper, makes room here
// update PUT here to be able to add a user also. We expose this via bff to add a user.

const onGetRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const result = await RoomsService.instance.getRoomStripped(id);
  if (!result) {
    res.status(400).send({ errors: ['Room does not exist'] });
  }
  res.status(200).send(result);
};

const onPostRoom: RequestHandler = async (req, res) => {
  const user = req.header('X-Letterboxd-User') as string;
  const { settings, movies, users } = req.body;
  try {
    const room = await RoomsService.instance.createRoom({
      users: uniq([...users, user]).map((user: string) => ({ user, swipes: [] })),
      owner: user,
      started: false,
      movies: movies.map((movie: Movie) => ({ ...movie, likes: 0, dislikes: 0 })),
      settings,
    });
    res.status(HttpStatusCode.Ok).send(room);
  } catch (e) {
    const error = e as MongoServerError;
    res.status(HttpStatusCode.InternalServerError).send({ errors: error.errInfo?.details?.schemaRulesNotSatisfied ?? error.message });
  }
};

const onDeleteRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const hasRoom = RoomsService.instance.hasRoom(id);
  if (!hasRoom) {
    res.status(400).send({ errors: ['Room does not exist'] });
    return;
  }
  try {
    await RoomsService.instance.deleteRoom(id);
    res.sendStatus(HttpStatusCode.NoContent);
  } catch (e) {
    const error = e as MongoServerError;
    res.status(HttpStatusCode.InternalServerError).send({ errors: error.errInfo?.details?.schemaRulesNotSatisfied ?? error.message });
  }
};

const onPutRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { movies, settings, users } = req.body;
  const room = await RoomsService.instance.getRoom(id);
  if (!room) {
    res.status(400).send({ errors: ['Room does not exist'] });
    return;
  } else if (room!.started) {
    res.status(HttpStatusCode.BadRequest).send({ errors: ['Room is started, cannot update'] });
    return;
  }
  try {
    await RoomsService.instance.updateRoom({
      code: id,
      movies: movies?.map((movie: Movie) => ({ ...movie, likes: 0, dislikes: 0})),
      users: users?.map((user: string) => ({ user, swipes: [] })),
      settings
    })
    const room = await RoomsService.instance.getRoomStripped(id);
    res.status(200).send(room);
  } catch (e: any) {
    const error = e as MongoServerError;
    res.status(HttpStatusCode.InternalServerError).send({ errors: error.errInfo?.details?.schemaRulesNotSatisfied ?? error.message });
  }
};


const onStartRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = req.header('X-Letterboxd-User') as string;
  if (!RoomsService.instance.hasRoom(id)) {
    res.status(400).send({ errors: ['Room does not exist'] });
    return;
  }
  const room = await RoomsService.instance.getRoomStripped(id);
  if (!room) {
    res.status(HttpStatusCode.BadRequest).send({ errors: ['Room does ']})
  } else {
    if (room.owner !== user) {
      res.status(400).send({ errors: ['User does not have permissions to start room'] });
      return;
    }
    if (room.started) {
      res.status(400).send({ errors: ['Room already started'] });
      return;
    }
    if (!room.users.includes(user)) {
      res.status(400).send({ errors: ['Owner not in room'] });
      return;
    }
  }
  try {
    await RoomsService.instance.updateRoom({ code: id, started: true });
    io.to(id).emit('start');
    res.sendStatus(HttpStatusCode.NoContent);
  } catch (e) {
    const error = e as MongoServerError;
    res.status(HttpStatusCode.InternalServerError).send({ errors: error.errInfo?.details?.schemaRulesNotSatisfied ?? error.message })
  }
};

export default {
  onGetRoom,
  onPostRoom,
  onDeleteRoom,
  onPutRoom,
  onStartRoom,
}
