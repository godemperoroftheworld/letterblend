import asyncio
import logging
import random
from itertools import count

from curl_cffi.requests import AsyncSession, RetryStrategy
from letterboxdpy.core.scraper import Scraper
from letterboxdpy.pages.user_watchlist import UserWatchlist
from letterboxdpy.utils.movies_extractor import extract_movies_from_vertical_list
from letterboxdpy.utils.utils_url import get_page_url

log = logging.getLogger(__name__)

FILMS_PER_PAGE = UserWatchlist.FILMS_PER_PAGE
CONCURRENCY = 8
FORBIDDEN_ATTEMPTS = 3


def _build_url(username: str, filters: dict | None) -> str:
    url = f"{UserWatchlist(username).url}/"
    for key, values in (filters or {}).items():
        values = values if isinstance(values, list) else [values]
        url += f"{key}/{'+'.join(map(str, values))}/"
    return url


async def _get_with_backoff(session: AsyncSession, url: str):
    # GET a URL, backing off and retrying while the server answers 403.
    for attempt in range(1, FORBIDDEN_ATTEMPTS + 1):
        response = await session.get(url, timeout=Scraper.timeout)
        if response.status_code != 403:
            break
        log.warning("403 on %s, retrying (attempt %d)", url, attempt)
        await asyncio.sleep(2 * attempt + random.random())
    return response


async def _fetch_page(session: AsyncSession, url: str) -> dict:
    response = await _get_with_backoff(session, url)
    Scraper._check_for_errors(url, response)
    return extract_movies_from_vertical_list(Scraper._parse_html(response))


def _merge(pages: list[tuple[int, dict]], filters: dict | None) -> dict:
    data: dict[str, dict] = {}
    for number, movies in pages:
        for movie_id, movie in movies.items():
            data[movie_id] = movie | {"page": number}

    # Number entries newest-first: the first movie fetched gets the highest number.
    total = len(data)
    for no, movie in zip(range(total, 0, -1), data.values()):
        movie["no"] = no

    return {
        "available": total > 0,
        "count": total,
        "last_page": pages[-1][0],
        "filters": filters,
        "data": data,
    }


async def fetch_watchlist(username: str, filters: dict | None = None) -> dict:
    base_url = _build_url(username, filters)
    pages: list[tuple[int, dict]] = []

    async with AsyncSession(
        max_clients=CONCURRENCY,
        headers=Scraper.headers,
        impersonate="chrome",
        retry=RetryStrategy(count=2, delay=1.0, jitter=0.5),
    ) as session:
        for start in count(1, CONCURRENCY):
            wave = range(start, start + CONCURRENCY)
            results = await asyncio.gather(
                *(_fetch_page(session, get_page_url(base_url, n)) for n in wave)
            )

            for number, movies in zip(wave, results):
                pages.append((number, movies))
                if len(movies) < FILMS_PER_PAGE:  # short page means we've hit the end
                    return _merge(pages, filters)