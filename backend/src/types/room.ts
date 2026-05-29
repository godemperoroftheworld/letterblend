export interface Movie {
  id: number;
  name: string;
  users: string[];
}
export interface Settings {
  top: number;
  threshold: number;
  decade?: string | string[];
  genre?: string | string[];
}
export type Filters = Omit<Settings, 'top' | 'threshold'>;
