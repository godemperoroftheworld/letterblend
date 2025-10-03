import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomsService from "@/services/rooms";
import getBlendedList from "@/utils/blend";
import {Settings} from "@/types/room";
import {HttpStatusCode} from "axios";
import {uniq} from "lodash";
import {RouteError} from "@/types";
import {HttpStatusCodes} from "@/constants/http";

type RoomParams = { id: string };
interface CreateRoomParams extends Settings {
  users: string[]
}
const createRoomHandler: RequestHandler = async (req, res) => {
  const { users, ...settings } = getData<CreateRoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  // Perform blend
  const movies = await getBlendedList({
    ...settings,
    names: uniq([...users, user]),
  });
  // Create Room
  const room = await RoomsService.instance.createRoom({
      movies,
      settings,
      users: users.map((u) => ({ user: u })),
      owner: user
  });
  res.status(200).send(room);
};

const getRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const result = await RoomsService.instance.getRoom(id);
  res.status(HttpStatusCode.Ok).send(result);
};

const deleteRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  await RoomsService.instance.deleteRoom(id);
  res.sendStatus(HttpStatusCode.NoContent);
};

interface SettingsParams extends RoomParams {
  settings: Settings;
}
const updateSettingsHandler: RequestHandler = async (req, res) => {
  const { id , ...settings } = getData<SettingsParams>(req);
  const room = await RoomsService.instance.getRoom(id);
  if (!room) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'No room with id: ' + id);
  const newSettings = { ...room.settings, ...settings };
  const newMovies = await getBlendedList({ names: room.users.flatMap((u) => u.user), ...newSettings });
  const newRoom = await RoomsService.instance.updateRoom({ code: id, settings: newSettings, movies: newMovies });
  res.status(HttpStatusCode.Ok).send(newRoom);
}

interface UserParams extends RoomParams {
  users: string[];
}
const updateUsersHandler: RequestHandler = async (req, res) => {
  const { id, users } = getData<UserParams>(req);
  const headerUser = req.header("X-Letterboxd-User") as string;
  const room = await RoomsService.instance.getRoom(id);
  if (!room) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'No room with id: ' + id);
  const newUsers = uniq([headerUser, ...users]);
  const newMovies = await getBlendedList({ names: newUsers, ...room.settings });
  const newRoom = await RoomsService.instance.updateRoom({ code: id, users: newUsers, movies: newMovies });
  res.status(HttpStatusCode.Ok).send(newRoom);
}

export default {
  createRoomHandler,
  getRoomHandler,
  deleteRoomHandler,
  updateSettingsHandler,
  updateUsersHandler
};
