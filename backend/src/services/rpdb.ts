import axios from "axios";
import {response} from "express";
import env from "@/constants/env";

export async function getPoster(id: number) {
    const { data } = await axios.get(`https://api.ratingposterdb.com/${env.PosterAPI}/tmdb/poster-default/${String(id)}.jpg`, {
        responseType: 'arraybuffer'
    });
    return data;
}