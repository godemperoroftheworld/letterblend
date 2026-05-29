import { RequestHandler } from "express";
import { getData } from "@/utils/data";
import Scraper from "@/services/scraper";
import {getPoster} from "@/services/rpdb";

const getPosterHandler: RequestHandler = async (req, res) => {
    const { id } = getData<{ id: number }>(req);
    const poster = await getPoster(id);
    res.set('Content-Type', 'image/jpeg');
    res.send(poster);
}

export { getPosterHandler };
