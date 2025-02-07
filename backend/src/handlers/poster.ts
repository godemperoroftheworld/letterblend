import { RequestHandler } from "express";
import { getData } from "@/utils/data";
import { BlendParams, getBlendedList } from "@/utils/blend";
import TMDB from "@/services/tmdb";
import Scraper from "@/services/scraper";
import {getPoster} from "@/services/rpdb";

const getSlugPosterHandler: RequestHandler = async (req, res) => {
    const { slug } = getData<{ slug: string }>(req);
    const id = await Scraper.getInstance().id(slug);
    const poster = await getPoster(id);
    res.set('Content-Type', 'image/jpeg');
    res.send(poster);
}

const getPosterHandler: RequestHandler = async (req, res) => {
    const { id } = getData<{ id: number }>(req);
    const poster = await getPoster(id);
    res.set('Content-Type', 'image/jpeg');
    res.send(poster);
}

export { getSlugPosterHandler, getPosterHandler };
