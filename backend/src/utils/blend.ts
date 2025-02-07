import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import {Responses} from "node-themoviedb";

export type BlendParams = {
  names: string[];
  top?: number; // int, min 1
  threshold?: number; // float, 0-1
  details?: boolean; // include details
};
interface BlendEntry { name: string, slug: string, users: string[], id: number, data: Responses.Movie.GetDetails }

async function getMovieID(entry: Pick<BlendEntry, 'name' | 'slug'>): Promise<number> {
  // Try TMDB search by name (faster than scraper, but sometimes innacurate)
  try {
    const { data: { results } } = await TMDB.search.movies({ query: { query: entry.name, page: 1 }});
    if (results.length) {
      const movie = results[0];
      if (movie.title === entry.name || movie.original_title === entry.name) {
        return movie.id;
      }
    }
  } catch (e) {}
  // Fallback to get TMDB ID from scraper
  return await Scraper.getInstance().id(entry.slug);
}

async function getBlendedList({
  names = [],
  top = 10,
  threshold = 0.5,
  details = false
}: BlendParams) {
  if (!names.length) return [];
  // Scrape watchlist entries from letterboxd and flatten
  const promises = names.map(async (name) => {
    const watchlist = await Scraper.getInstance().watchlist(name);
    return Object.values(watchlist.data).map((r) => ({ entry: r, user: name }));
  });
  const allScrapedWatchlistEntries = await Promise.all(promises).then((r) =>
    r.flat(),
  ).then();
  // Build map from slug to movie info
  // Build map of who watched what movies
  const movieMap: Record<string, Pick<BlendEntry, 'name' | 'slug'> & Partial<BlendEntry>> = {};
  allScrapedWatchlistEntries.forEach(({ entry, user }) => {
    if (!movieMap[entry.slug]) {
      movieMap[entry.slug] = { name: entry.name, slug: entry.slug, users: [user],  };
    } else {
    movieMap[entry.slug].users!.push(user);
    }
  });
    // Build sorted list from the map
  const minCount = Math.round(names.length * Number(threshold));
  const blendSlugs = Object.values(movieMap)
      .filter((v) => v.users!.length >= minCount)
      .sort((v1, v2) => v2.users!.length - v1.users!.length)
      .slice(0, top)
      .map((v) => v.slug!);
  // Populate with TMDB data and return
  return await Promise.all(blendSlugs.map((slug) =>
    new Promise<BlendEntry>((resolve, reject) => {
      const entry = movieMap[slug];
      getMovieID(entry).then((id) => {
        entry.id = id;
        if (details) {
          TMDB.movie.getDetails({ pathParameters: { movie_id: id }}).then(({ data }) => {
            entry.data = data;
            resolve(entry as BlendEntry);
          }).catch(reject)
        } else {
          resolve(entry as BlendEntry);
        }
      }).catch(reject);
    })
  ));
}

export default getBlendedList;
export { getBlendedList };
