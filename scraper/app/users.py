from flask import Blueprint, jsonify, request
from letterboxdpy import user
from letterboxdpy.constants.project import DOMAIN
from letterboxdpy.core.scraper import Scraper
from .watchlist_fetch import fetch_watchlist

users = Blueprint('user', __name__)

@users.route('/<name>/exists')
def get_exists(name):
    try:
        response = Scraper.instance().head(
            f"{DOMAIN}/{name}",
            headers=Scraper.headers,
            timeout=Scraper.timeout,
            impersonate='chrome',
            allow_redirects=True,
        )
    except Exception:
        return jsonify({'exists': False})
    return jsonify({'exists': response.status_code == 200})


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
    user.user_instance.pages.network.get_following()
    user_instance = user.User(name)
    following = user_instance.get_following()
    return following
