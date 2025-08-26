from flask import Blueprint, jsonify, request
from letterboxdpy import user, movie
import re

users = Blueprint('user', __name__)

@users.route('/<name>/exists')
def get_exists(name):
    try:
        user.User(name)
        return jsonify({'exists': True})
    except Exception:
        return jsonify({'exists': False})


@users.route("/<name>/avatar")
def get_profile(name):
    user_instance = user.User(name)
    return user_instance.avatar


@users.post("/<name>/watchlist")
def get_watchlist(name):
    filters = request.json
    user_instance = user.User(name)
    watchlist = user_instance.get_watchlist(filters)
    return watchlist

@users.route("/<name>/watched")
def get_rated(name):
    user_instance = user.User(name)
    rated = user_instance.get_films()
    return rated


@users.route("/<name>/followers")
def get_followers(name):
    user_instance = user.User(name)
    followers = user_instance.get_followers()
    return followers


@users.route("/<name>/following")
def get_following(name):
    user_instance = user.User(name)
    following = user_instance.get_following()
    return following
