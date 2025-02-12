import type { Movie } from '@/types/movie';

export interface RoomSettings {
  top: number;
  threshold: number;
  genre: string | string[];
  decade: string | string[];
}
export interface Room {
  code: string;
  owner: string;
  users: string[];
  movies: Movie[];
  settings: RoomSettings;
  started: boolean;
  match?: number;
}
