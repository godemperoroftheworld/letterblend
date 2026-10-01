import Scraper from "@/services/scraper";
import TMDB from "@/services/tmdb";
import { Movie, Settings } from "@/types/room";
import { fromPairs, groupBy, isEmpty, shuffle, uniq, uniqBy } from "lodash";
import { debug } from "node:util";
import { ListEntry } from "@/types/scraper";

export type BlendParams = Settings & {
  names: string[];
  locked?: number[];
};

async function getList(
  name: string,
  { genre, decade }: Pick<Settings, "genre" | "decade">,
): Promise<ListEntry[]> {
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
  locked = [],
  top = 10,
  threshold = 0.6,
  genre,
  decade,
}: BlendParams): Promise<Movie[]> {
  if (!names.length) return [];

  // Scrape watchlist entries from letterboxd and flatten
  const watchlistPromises = names.map((name) =>
    getList(name, {
      genre: isEmpty(genre) ? undefined : genre,
      decade: decade ?? undefined,
    }),
  );
  const watchlistEntries = await Promise.all(watchlistPromises).then((r) =>
    r.flat(),
  );
  const lockedEntries = await Promise.all(
    locked.map(async (id) => await Scraper.getInstance().movie(id)),
  );
  const groupedEntries = groupBy(watchlistEntries, "slug");
  const lockedGroupEntries: [string, ListEntry[]][] = lockedEntries.map(
    (movie) => [movie.slug, groupedEntries[movie.slug] ?? [movie]],
  );

  const minCount = Math.ceil(names.length * Number(threshold));
  const sortedEntries = shuffle(Object.entries(groupedEntries))
    .filter(([, entries]) => entries.length >= minCount)
    .sort(([, a], [, b]) => a.length - b.length);
  const uniqueEntries = uniqBy(
    [...lockedGroupEntries, ...sortedEntries],
    ([key]) => key,
  );
  const pickedEntries = fromPairs(uniqueEntries.slice(0, top));

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
            users: uniq(entries.map((e) => e.user)).filter(Boolean),
          };
        });
    },
  );
  return await Promise.all(promises);
}

export default getBlendedList;
export { getBlendedList };
