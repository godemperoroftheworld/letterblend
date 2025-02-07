import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import {Movie} from "@/types/tmdb";

export type BlendParams = {
  names: string[];
  top?: number; // int, min 1
  threshold?: number; // float, 0-1
};

interface BlendEntry { name: string, slug: string, users: string[], id: number, data: Movie }
async function getBlendedList({
  names = [],
  top = 10,
  threshold = 0.5,
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
  const movieMap: Record<string, Partial<BlendEntry>> = {};
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
      try {
        TMDB.search.movies({ query: { query: entry.name!, page: 1 } }).then(({ data }) => {
          const movie = data.results.length ? data.results[0] : undefined;
          if (movie) {
            entry.id = movie.id;
            entry.data = movie;
            resolve(entry as BlendEntry);
          } else reject();
        });
      } catch(e) {
        reject(e);
      }
    })
  ));
}

export default getBlendedList;
export { getBlendedList };
