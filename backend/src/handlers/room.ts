import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomService from "@/services/room";
import getBlendedList from "@/utils/blend";
import {Settings} from "@/types/room";
import {HttpStatusCode} from "axios";
import {uniq} from "lodash";
import {fixGenreFilter} from "@/utils/filter";

type RoomParams = { id: string };
interface CreateRoomParams extends Settings {
  users: string[]
}
const createRoomHandler: RequestHandler = async (req, res) => {
  const { users, genre, ...settings } = getData<CreateRoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  // Fixup genre to be OR instead of AND
  const fixedGenre = genre != null ? fixGenreFilter(genre) : genre;
  // Perform blend
  const movies = await getBlendedList({
    ...settings,
    genre: fixedGenre,
    names: uniq([...users, user]),
  });
  // Create Room
  const service = new RoomService(user);
  const result = await service.createRoom(users, movies, settings);
  res.status(200).send(result);
};

const getRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const result = await service.getRoom(id);
  res.status(HttpStatusCode.Ok).send(result);
};

const deleteRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  await service.deleteRoom(id);
  res.sendStatus(HttpStatusCode.NoContent);
};

const startRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  await service.startRoom(id);
};

interface SettingsParams extends RoomParams {
  settings: Settings;
}
const updateSettingsHandler: RequestHandler = async (req, res) => {
  const { id , ...settings } = getData<SettingsParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const room = await service.getRoom(id);
  const newSettings = { ...room.settings, ...settings };
  const newMovies = await getBlendedList({ names: room.users, ...newSettings });
  const newRoom = await service.updateRoom(id, { settings: newSettings, movies: newMovies });
  res.status(HttpStatusCode.Ok).send(newRoom);
}

interface UserParams extends RoomParams {
  users: string[];
}
const updateUsersHandler: RequestHandler = async (req, res) => {
  const { id, users } = getData<UserParams>(req);
  const headerUser = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(headerUser);
  const room = await service.getRoom(id);
  const newUsers = uniq([headerUser, ...users]);
  const newMovies = await getBlendedList({ names: newUsers, ...room.settings });
  const newRoom = await service.updateRoom(id, { users: newUsers, movies: newMovies });
  res.status(HttpStatusCode.Ok).send(newRoom);
}

export default {
  createRoomHandler,
  getRoomHandler,
  deleteRoomHandler,
  startRoomHandler,
  updateSettingsHandler,
  updateUsersHandler
};
