import {difference, xor} from "lodash";

export const GENRE_OPTIONS = [
    "action",
    "adventure",
    "animation",
    "comedy",
    "crime",
    "documentary",
    "drama",
    "family",
    "fantasy",
    "history",
    "horror",
    "music",
    "mystery",
    "romance",
    "science-fiction",
    "thriller",
    "tv-movie",
    "war",
    "western"
];
export const DECADE_OPTIONS = [
    "upcoming",
    "2020s",
    "2010s",
    "2000s",
    "1990s",
    "1980s",
    "1970s",
    "1960s",
    "1950s",
    "1940s",
    "1930s",
    "1920s",
    "1910s",
    "1900s",
    "1890s",
    "1880s",
    "1870s"
]

export function fixGenreFilter(filter: string | string[]) {
    if (Array.isArray(filter)) {
        const outside = difference(filter, GENRE_OPTIONS);
        return outside.map((s) => `-${s}`);
    }
    return filter;
}