import type { Movie } from '@/types/movie';
import z from 'zod';

export interface RoomSettings {
  top: number;
  threshold: number;
  genre?: string[];
  decade?: string[];
}
export interface RoomUsers {
  users: string[];
}
export interface Room extends RoomUsers {
  code: string;
  owner: string;
  movies: Movie[];
  settings: RoomSettings;
  started: boolean;
  match?: number;
}

export const MIN_USERS = 2;
export const MAX_USERS = 5;

export const settingsSchema = z.object({
  top: z.number().min(1).max(30),
  threshold: z.number().min(0).max(100),
  genre: z.array(z.string()).optional(),
});
export const usersSchema = z.object({
  users: z
    .array(z.string().nonempty('Name is required.'))
    .min(MIN_USERS, 'At least two users are required.')
    .max(MAX_USERS, 'Maximum of five users allowed.'),
});
