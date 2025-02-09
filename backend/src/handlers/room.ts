import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomService from "@/services/room";
import getBlendedList from "@/utils/blend";
import TMDB from "@/services/tmdb";
import { RouteError } from "@/types";
import { HttpStatusCodes } from "@/constants/http";
import {Settings} from "@/types/room";
import {HttpStatusCode} from "axios";
import {uniq} from "lodash";

type RoomParams = { id: string };
const createRoomHandler: RequestHandler = async (req, res) => {
  const { users, ...settings } = getData<{ users: string[] } & Settings>(req);
  const user = req.header("X-Letterboxd-User") as string;
  // Perform blend
  const movies = await getBlendedList({
    names: uniq([...users, user]),
    ...settings,
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
  const { id , settings } = getData<SettingsParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const room = await service.getRoom(id);
  const newSettings = { ...room.settings, ...settings };
  return service.updateRoom(id, { settings: newSettings });
}

interface UserParams extends RoomParams {
  user: string;
}
const addUserHandler: RequestHandler = async (req, res) => {
  const { id, user } = getData<UserParams>(req);
  const headerUser = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(headerUser);
  const room = await service.getRoom(id);
  const newUsers = [...room.users, user];
  return service.updateRoomUsers(id, newUsers);
}
const removeUserHandler: RequestHandler = async (req, res) => {
  const { id, user } = getData<UserParams>(req);
  const headerUser = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(headerUser);
  const room = await service.getRoom(id);
  const userIdx = room.users.indexOf(user);
  const newUsers = room.users.splice(userIdx, 1);
  return service.updateRoomUsers(id, newUsers);
}

export default {
  createRoomHandler,
  getRoomHandler,
  deleteRoomHandler,
  startRoomHandler,
  updateSettingsHandler,
  addUserHandler,
  removeUserHandler
};
