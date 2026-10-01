import axios, { Axios } from "axios";
import env from "@/constants/env";
import List, { Users } from "@/types/scraper";
import intersection from "lodash/intersection";
import { Filters } from "@/types/room";

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

  async watchlist(user: string, filters: Filters = {}): Promise<List> {
    return this.service
      .post<List>(`/users/${user}/watchlist`, filters)
      .then((r) => r.data);
  }

  async followers(user: string): Promise<Users> {
    return this.service
      .get(`/users/${user}/followers`)
      .then((r) => r.data as Users);
  }

  async following(user: string): Promise<Users> {
    return this.service
      .get(`/users/${user}/following`)
      .then((r) => r.data as Users);
  }

  async friends(user: string): Promise<string[]> {
    const followers = await this.followers(user);
    const following = await this.following(user);
    return intersection(Object.keys(following), Object.keys(followers));
  }
}
