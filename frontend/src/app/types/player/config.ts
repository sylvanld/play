
export interface PlayerConfig {
  selection: 'youtube' | 'deezer' | 'spotify';
  youtube?: YouTubeConfig;
  deezer?: DeezerConfig;
  spotify?: SpotifyConfig;
}

export interface YouTubeConfig {}
export interface DeezerConfig {}
export interface SpotifyConfig {}
