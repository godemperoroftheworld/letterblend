export interface Movie {
  id: number;
  name: string;
  users: string[];
}
export interface Settings {
  top: number;
  threshold: number;
}

export interface Room {
  code: string;
  owner: string;
  users: string[];
  movies: Movie[];
  settings: Settings;
  started: boolean;
  match?: number;
}
