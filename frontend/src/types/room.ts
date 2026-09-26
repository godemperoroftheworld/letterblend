import type { Movie } from '@/types/movie';

export interface RoomSettings {
  top: number;
  threshold: number;
  genre?: string[];
  decade?: string[];
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
