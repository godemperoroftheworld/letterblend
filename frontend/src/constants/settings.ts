import type { RoomSettings } from '@/types/room';

const JUST_PICK_SETTINGS: RoomSettings = {
  top: 1,
  threshold: 1,
  genre: [],
  decade: undefined,
};
const SOME_OPTIONS_SETTINGS: RoomSettings = {
  top: 15,
  threshold: 0.5,
  genre: [],
  decade: undefined,
};
const SOMETHING_COMFORTING: RoomSettings = {
  top: 3,
  threshold: 0.75,
  genre: ['adventure', 'family'],
  decade: undefined,
};
const TOTALLY_EIGHTIES: RoomSettings = {
  top: 10,
  threshold: 0.6,
  genre: [],
  decade: '1980s',
};

export const DEFAULT_SETTINGS: RoomSettings = {
  top: 10,
  threshold: 0.6,
  genre: [],
  decade: undefined,
};

export type RoomSettingsKey = 'default' | 'justpick' | 'wideopen' | 'comfort' | 'eighties';

export interface RoomSettingPreset {
  label: string;
  id: RoomSettingsKey;
  settings: RoomSettings;
}

export const ROOM_SETTINGS: RoomSettingPreset[] = [
  { label: 'Default', id: 'default', settings: DEFAULT_SETTINGS },
  { label: 'Just Pick One', id: 'justpick', settings: JUST_PICK_SETTINGS },
  { label: 'Wide Open', id: 'wideopen', settings: SOME_OPTIONS_SETTINGS },
  { label: 'Family Adventure', id: 'comfort', settings: SOMETHING_COMFORTING },
  { label: 'Totally Eighties', id: 'eighties', settings: TOTALLY_EIGHTIES },
];

export const ROOM_SETTINGS_MAP: Record<RoomSettingsKey, RoomSettings> = Object.fromEntries(
  ROOM_SETTINGS.map((preset) => [preset.id, preset.settings]),
) as Record<RoomSettingsKey, RoomSettings>;
