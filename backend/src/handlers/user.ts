import { RequestHandler } from "express";
import getData from "@/utils/data";
import Scraper from "@/services/scraper";

type UserParams = { name: string };
const getUserHandler: RequestHandler = async (req, res) => {
  const { name } = getData<UserParams>(req);
  const followers = await Scraper.getInstance().followers(name);
  const following = await Scraper.getInstance().following(name);
  const { url } = await Scraper.getInstance().avatar(name);
  res.status(200).send({ followers, following, avatar: url, name });
};

const checkUserHandler: RequestHandler = async (req, res) => {
  const { name } = getData<UserParams>(req);
  const result = await Scraper.getInstance().exists(name);
  res.status(200).send({ exists: result });
};

export default { getUserHandler, checkUserHandler };
