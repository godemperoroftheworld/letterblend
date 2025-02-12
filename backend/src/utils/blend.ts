import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import {Movie, Settings} from "@/types/room";
import shuffle from "lodash/shuffle";

export type BlendParams = Settings & {
  names: string[];
};

async function getBlendedList({
  names = [],
  top = 10,
  threshold = 0.5,
  genre,
  decade
}: BlendParams): Promise<Movie[]> {
  if (!names.length) return [];
  // Scrape watchlist entries from letterboxd and flatten
  const promises = names.map(async (name) => {
    const watchlist = await Scraper.getInstance().watchlist(name, { genre, decade });
    return Object.values(watchlist.data).map((r) => ({ entry: r, user: name }));
  });
  const allScrapedWatchlistEntries = await Promise.all(promises).then((r) =>
    r.flat(),
  ).then();
  // Build map from slug to movie info
  // Build map of who watched what movies
  const movieMap: Record<string, Partial<Movie>> = {};
  allScrapedWatchlistEntries.forEach(({ entry, user }) => {
    if (!movieMap[entry.slug]) {
      movieMap[entry.slug] = { name: entry.name, users: [user] };
    } else {
      movieMap[entry.slug].users!.push(user);
    }
  });
  // Build sorted list from the map
  const minCount = Math.ceil(names.length * Number(threshold));
  const filteredValues = shuffle(Object.keys(movieMap).filter((k) => movieMap[k].users!.length >= minCount));
  const sortedValues = filteredValues.sort((k1, k2) => movieMap[k2].users!.length - movieMap[k1].users!.length);
  const blendSlugs = sortedValues.slice(0, top);
  // Populate with poster data and return
  return await Promise.all(blendSlugs.map((slug) =>
    new Promise<Movie>((resolve, reject) => {
      const entry = movieMap[slug];
      Scraper.getInstance().id(slug).then((id) => {
        entry.id = id;
        resolve(entry as Movie);
      }).catch(reject);
    })
  ));
}

export default getBlendedList;
export { getBlendedList };
