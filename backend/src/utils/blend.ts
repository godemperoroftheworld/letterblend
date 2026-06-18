import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import { Movie, Settings } from "@/types/room";
import { fromPairs, groupBy, uniq } from "lodash";

export type BlendParams = Settings & {
  names: string[];
};

async function getList(name: string, { genre, decade }: Settings) {
  const watchlist = await Scraper.getInstance().watchlist(name, {
    genre,
    decade,
  });
  const entries = Object.values(watchlist);
  return entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    year: entry.year,
    user: name,
  }));
}

async function getBlendedList({
  names = [],
  top = 10,
  threshold = 0.5,
  genre,
  decade,
}: BlendParams): Promise<Movie[]> {
  if (!names.length) return [];
  // Scrape watchlist entries from letterboxd and flatten
  const watchlistPromises = names.map((name) =>
    getList(name, { top, threshold, genre, decade }),
  );
  const watchlistEntries = await Promise.all(watchlistPromises).then((r) =>
    r.flat(),
  );
  const groupedEntries = groupBy(watchlistEntries, "slug");

  const minCount = Math.ceil(names.length * Number(threshold));
  const pickedEntries = fromPairs(Object.entries(groupedEntries)
    .filter(([, entries]) => entries.length >= minCount)
    .sort(([, a], [, b]) => a.length - b.length)
    .slice(0, top));

  // Get TMDB and group for users
  const promises: Promise<Movie>[] = Object.values(pickedEntries).map(
    async (entries) => {
      const [entry] = entries;
      return await TMDB.search
        .movies({
          query: {
            query: entry.name,
            year: entry.year,
          },
        })
        .then((r) => {
          return {
            id: r.data.results[0]?.id,
            name: entry.name,
            users: uniq(entries.map((e) => e.user)),
          };
        });
    },
  );
  return await Promise.all(promises);
}

export default getBlendedList;
export { getBlendedList };
