import axios, { Axios } from "axios";
import env from "@/constants/env";
import List, {Users} from "@/types/scraper";
import intersection from 'lodash/intersection';


export default class Scraper {
  private static instance: Scraper;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Scraper();
    }
    return this.instance;
  }

  private service: Axios;
  constructor() {
    this.service = axios.create({ baseURL: env.ScrapeServiceURL });
  }

  async exists(user: string) {
    return this.service.get(`/users/${user}/exists`);
  }

  async avatar(user: string) {
    return this.service.get(`/users/${user}/avatar`).then((r) => r.data);
  }

  async watchlist(user: string) {
    return this.service
      .get<any>(`/users/${user}/watchlist`)
      .then((r) => r.data as List);
  }

  async watched(user: string) {
    return this.service
      .get<any>(`/users/${user}/watched`)
      .then((r) => r.data as List);
  }

  async followers(user: string) {
    return this.service.get(`/users/${user}/followers`).then((r) => r.data as Users);
  }

  async following(user: string) {
    return this.service.get(`/users/${user}/following`).then((r) => r.data as Users);
  }

  async friends(user: string) {
    const followers = await this.followers(user);
    const following = await this.following(user);
    const friendKeys = intersection(Object.keys(following), Object.keys(followers));
    const result: Users = {};
    friendKeys.forEach((k) => {
      if (followers[k]) {
        result[k] = followers[k];
      } else {
        result[k] = following[k];
      }
    });
    return result;
  }

  async id(slug: string) {
    return this.service.get(`movies/${slug}/id`).then(((r) => r.data));
  }

  async ids(slugs: string[]) {
    return this.service
      .get(`/movies/id`, {
        params: {
          slugs: slugs.join(","),
        },
      })
      .then((r) => r.data as { slug: string; id: number }[]);
  }
}
