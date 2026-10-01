from flask import Blueprint, jsonify
from letterboxdpy import movie

movies = Blueprint('movies', __name__)

@movies.get("/<id>")
def get_movie(id):
    film = movie.Movie(tmdb=id)
    return jsonify({
        "id": film.id,
        "name": film.title,
        "slug": film.slug,
        "year": film.year,
        "genres": film.genres,
    })

@movies.get("/<id>/slug")
def get_slug(id):
    film = movie.Movie(tmdb=id)
    return film.slug