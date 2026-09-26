import type { RoomSettings } from '@/types/room';

const JUST_PICK_SETTINGS: RoomSettings = {
  top: 1,
  threshold: 1,
  genre: [],
  decade: [],
};
const SOME_OPTIONS_SETTINGS: RoomSettings = {
  top: 15,
  threshold: 0.5,
  genre: [],
  decade: [],
};
const SOMETHING_COMFORTING: RoomSettings = {
  top: 3,
  threshold: 0.75,
  genre: ['adventure', 'family'],
  decade: [],
};

export const DEFAULT_SETTINGS: RoomSettings = {
  top: 10,
  threshold: 0.6,
  genre: [],
}

const ROOM_SETTINGS = [
  { label: 'Default', id: 'default', value: DEFAULT_SETTINGS },
  { label: 'Just Pick One', id: 'justpick', value: JUST_PICK_SETTINGS },
  { label: 'Wide Open', id: 'wideopen', value: SOME_OPTIONS_SETTINGS },
  { label: 'Family Adventure', id: 'comfort', value: SOMETHING_COMFORTING },
] as const;

export type RoomSettingsKey = typeof ROOM_SETTINGS[number]['id'];

const ROOM_SETTINGS_MAP = ROOM_SETTINGS.reduce((result, current) => {
  result[current.id] = current.value;
  return result;
}, {} as Record<RoomSettingsKey, RoomSettings>);

export {
  ROOM_SETTINGS,
  ROOM_SETTINGS_MAP
}
