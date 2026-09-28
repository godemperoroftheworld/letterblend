from flask import Blueprint, jsonify, request
from letterboxdpy import user
from .watchlist_fetch import fetch_watchlist

users = Blueprint('user', __name__)

@users.route('/<name>/exists')
def get_exists(name):
    try:
        user.user_profile.UserProfile(name)
        return jsonify({'exists': True})
    except Exception:
        return jsonify({'exists': False})


@users.route("/<name>/avatar")
def get_profile(name):
    user_profile = user.user_profile.UserProfile(name)
    return user_profile.get_avatar()


@users.post("/<name>/watchlist")
async def get_watchlist(name):
    filters = request.json
    watchlist = await fetch_watchlist(name, filters)
    return watchlist['data']

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
