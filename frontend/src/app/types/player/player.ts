import { Track } from '~types/track';
import { Playlist } from '~types/playlist';
import { PlayerState, PlayerVolumeState } from './state';
import { PlayerConfig } from '.';

export interface Player {
  // parameters
  config: PlayerConfig;
  provider: YT.Player;

  playerState: PlayerState;
  volumeState: PlayerVolumeState;

  volume: number;

  showVideo: boolean;
  canVideo: boolean;

  time: number;
  duration: number;

  // functions API
  toggleState(): void;
  toggleVolumeState(): void;
  toggleDisplayVideo(): void;

  nextTrack(): void;
  prevTrack(): void;
  pauseTrack(): void;
  playTrack(id?: number): void;

  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;

  seekTo(time: number, reloadBuffer: boolean): void;

  loadTracks(...tracks: Track[]): void;
  queueTracks(...tracks: Track[]): void;
  loadPlaylist(playlist: Playlist): void;
  queuePlaylist(playlist: Playlist): void;
}
