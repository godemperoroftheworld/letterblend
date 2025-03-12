from flask import Blueprint, request
from letterboxdpy import movie
import re

movies = Blueprint('movies', __name__)

@movies.route('/<slug>/id')
def get_id(slug):
    film = movie.Movie(slug)
    if film.tmdb_link is not None:
        match = re.search(r'(movie|tv)/(\d+)', film.tmdb_link)
    else:
        dom = film.scraper.get_parsed_page(f'{film.DOMAIN}/film/{film.slug}')
        a = dom.find("a", {"data-track-action": ["TMDB"]})
        tmdb_link = a['href'] if a else ''
        match = re.search(r'(movie|tv)/(\d+)', tmdb_link)
    return match.group(2)

@movies.route('/id')
def get_ids():
    slugs = request.args.get('slugs').split(',')
    result = []
    for slug in slugs:
        film = movie.Movie(slug)
        tmdb_id = re.search(r'(movie|tv)/(\d+)', film.tmdb_link).group(2)
        result.append({ "slug": slug, "id": tmdb_id })
    return result