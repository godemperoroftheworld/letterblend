import axios from "axios";
import env from "@/constants/env";

export async function getPoster(id: number) {
  try {
    const { data } = await axios.get(
      `https://api.ratingposterdb.com/${env.PosterAPI}/tmdb/poster-default/movie-${String(id)}.jpg`,
      {
        responseType: "arraybuffer",
      },
    );
    return data;
  } catch {
    const { data } = await axios.get(
      `https://api.ratingposterdb.com/${env.PosterAPI}/tmdb/poster-default/series-${String(id)}.jpg`,
      {
        responseType: "arraybuffer",
      },
    );
    return data;
  }
}
