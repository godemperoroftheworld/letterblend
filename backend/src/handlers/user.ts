import { RequestHandler } from "express";
import getData from "@/utils/data";
import Scraper from "@/services/scraper";
import { HttpStatusCodes } from "@/constants/http";
import merge from 'lodash/merge';
import {Users} from "@/types/scraper";

type UserParams = { name: string };
const getUserHandler: RequestHandler = async (req, res) => {
  const { name } = getData<UserParams>(req);
  const {
    data: { exists },
  } = await Scraper.getInstance().exists(name);
  if (!exists) {
    return res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
  const followers = await Scraper.getInstance().followers(name);
  const following = await Scraper.getInstance().following(name);
  const { url } = await Scraper.getInstance().avatar(name);
  res
    .status(HttpStatusCodes.OK)
    .send({ followers, following, avatar: url, name });
};

const getAvatarHandler: RequestHandler = async (req, res) => {
  const { name } = getData<UserParams>(req);
  const {
    data: { exists },
  } = await Scraper.getInstance().exists(name);
  if (!exists) {
    return res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
  const data = await Scraper.getInstance().avatar(name);
  res.status(HttpStatusCodes.OK).send(data);
};

const checkUserHandler: RequestHandler = async (req, res) => {
  const { name } = getData<UserParams>(req);
  const { data } = await Scraper.getInstance().exists(name);
  res.status(HttpStatusCodes.OK).send(data);
};

interface FollowerParams {
  names: string[];
}
const getFriendsHandler: RequestHandler = async (req, res) => {
  const { names } = getData<FollowerParams>(req);

  // Filter to existing
  const existingNames = await Promise.all(names.map((name) => {
    return new Promise<{ name: string, exists: boolean }>((resolve) => {
      Scraper.getInstance().exists(name).then(({ data: { exists } }) => {
        resolve({ name, exists });
      });
    });
  })).then((r) => r.filter((v) => v.exists).map((v) => v.name));
  // Friends
  const friends = await Promise.all(existingNames.map((name) => Scraper.getInstance().friends(name)));
  const friendsMerged: Users = merge({}, ...friends);
  res.status(HttpStatusCodes.OK).send(friendsMerged);
};

export default {
  getUserHandler,
  getAvatarHandler,
  checkUserHandler,
  getFriendsHandler,
};
