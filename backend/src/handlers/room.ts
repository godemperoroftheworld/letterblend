import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomsService from "@/services/rooms";
import getBlendedList from "@/utils/blend";
import { Settings } from "@/types/room";
import { HttpStatusCode } from "axios";
import { isNil, isEmpty, omitBy, uniq } from "lodash";
import { RouteError } from "@/types";
import { HttpStatusCodes } from "@/constants/http";
import { debug } from "node:util";
import merge from "lodash/merge";

type RoomParams = { id: string };
interface CreateRoomParams extends Settings {
  users: string[];
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
    owner: user,
  });
  res.status(200).send(room);
};

const getRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const result = await RoomsService.instance.getRoomStripped(id);
  res.status(HttpStatusCode.Ok).send(result);
};

const getRoomCountHandler: RequestHandler = async (req, res) => {
  const count = await RoomsService.instance.getCount();
  res.status(HttpStatusCode.Ok).send({ count });
};

const deleteRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  await RoomsService.instance.deleteRoom(id);
  res.sendStatus(HttpStatusCode.NoContent);
};

interface SettingsParams extends RoomParams {
  settings: Settings;
  users?: string[];
}
const updateRoomHandler: RequestHandler = async (req, res) => {
  const { id, users, settings } = getData<SettingsParams>(req);
  const room = await RoomsService.instance.getRoom(id);
  if (!room) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "No room with id: " + id);
  }
  const newUsers = users ? users : room.users.map((u) => u.user);
  const mergedSettings: Settings = merge(room.settings, settings);
  const newMovies = await getBlendedList({
    names: newUsers,
    ...mergedSettings,
  });
  await RoomsService.instance.updateRoom({
    code: id,
    settings,
    movies: newMovies,
    users: newUsers,
  });
  const newRoom = await RoomsService.instance.getRoomStripped(id);
  res.status(HttpStatusCode.Ok).send(newRoom);
};
export default {
  createRoomHandler,
  getRoomHandler,
  getRoomCountHandler,
  deleteRoomHandler,
  updateRoomHandler,
};
