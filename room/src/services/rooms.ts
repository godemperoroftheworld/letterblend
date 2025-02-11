import * as crypto from 'crypto';
import { Collection, Document } from 'mongodb';
import { database } from '@/mongo';

export interface Movie {
  id: number;
  name: string;
  users: string[];
}
interface Settings {
  top: number;
  threshold: number;
}
interface RoomStripped {
  code: string;
  owner: string;
  users: string[];
  movies: Movie[];
  settings: Settings;
  started: boolean;
  match?: number;
}
export interface Room extends Document, Omit<RoomStripped, 'users' | 'movies'> {
  users: Array<{
    user: string,
    swipes: Array<{
      id: number,
      liked: boolean
    }>
  }>;
  movies: Array<Movie & {
    likes: number;
    dislikes: number;
  }>;
  createdAt?: Date;
}

export default class RoomsService {

  private static _instance: RoomsService;
  public static get instance(): RoomsService {
    if (!this._instance) this._instance = new RoomsService();
    return this._instance;
  }

  private readonly rooms: Collection<Room>;
  private constructor() {
    this.rooms = database.collection<Room>('rooms');
  }

  hasRoom(code: string) {
    return !!this.rooms.find({ code }).limit(1).count();
  }

  async createRoom(partial: Omit<Room, 'code'>) {
    const code = this.generateCode();
    const room = { ...partial, code, createdAt: new Date() } as Room;
    await this.rooms.insertOne(room);
    return this.getRoomStripped(code);
  }

  async getRoom(code: string) {
    return this.rooms.findOne({ code });
  }

  async getRoomStripped(code: string) {
    const room = await this.getRoom(code);
    if (room) {
      return {
        code: room.code,
        users: room.users.map((u) => u.user),
        movies: room.movies.map((m) => {
          const { likes: _i1, dislikes: _i2, ...rest } = m;
          return rest;
        }),
        settings: room.settings,
        owner: room.owner,
        started: room.started,
        match: room.match
      } as RoomStripped;
    }
    return null;
  }

  async updateRoom(partial: Partial<Pick<RoomStripped, 'code' | 'settings' | 'movies' | 'started' | 'users'>>) {
    const { code, ...values } = partial;
    await this.rooms.updateOne({ code }, {
      $set: Object.entries(values)
        .filter(([key, val]) => !!val)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    });
  }

  async rateMovie(code: string, user: string, movie: number, liked: boolean) {
    // Update user info
    await this.rooms.updateOne({ code, "users.user": user }, {
      $push: {
        'users.$.swipes': { id: movie, liked },
      }
    });
    // Update movie info
    if (liked) {
      await this.rooms.updateOne({ code, 'movies.id': movie }, {
        $inc: { 'movies.$.likes': 1 }
      })
    } else {
      await this.rooms.updateOne({ code, 'movies.id': movie }, {
        $inc: { 'movies.$.dislikes': 1 }
      })
    }
    // Check for match
    const session = await this.getRoom(code) as Room;
    const maxCount = session.users.length;
    const movieInfo = session.movies.find((m) => m.id === movie);
    const isMatch = movieInfo?.likes === maxCount;
    if (isMatch) {
      await this.rooms.updateOne({ code }, { $set: { match: movieInfo?.id }})
    }
    return isMatch;
  }
  async getUserStack(code: string, username: string): Promise<number[]> {
    const room = await this.getRoom(code);
    if (room) {
      const user = room.users.find((u) => u.user === username);
      if (user) {
        const remaining = room.movies.filter((m) => !user.swipes.some((sm) => sm.id === m.id));
        return remaining.sort((a, b) => b.likes - a.likes).map((m) => m.id);
      }
    }
    return [];
  }

  async deleteRoom(code: string) {
    return this.rooms.deleteOne({ code });
  }

  private generateCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
      .slice(0, 8);
  }
}
