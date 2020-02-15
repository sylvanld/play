
export enum PlayerState {
  UNSTARTED = -1,
  LOADING = 0,
  PAUSED = 1,
  PLAYING = 2,

  // maybe
}

export type PlayerProviders = 'youtube' | 'deezer' | 'spotify';
export interface PlayerConfig {
  current: PlayerProviders;
  youtube?: YoutubeConfig;
  spotify?: SpotifyConfig;
  deezer?: DeezerConfig;
}

interface YoutubeConfig { }
interface SpotifyConfig { }
interface DeezerConfig { }
