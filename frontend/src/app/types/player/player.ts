import { Track } from '~types/track';
import { Playlist } from '~types/playlist';

export interface Player {

}

/**
 * An helper for factorization.
 */
export interface PlayerProviderExtends {

  cuePlaylist(playlist: Playlist): void;
  cueTracks(...tracks: Track[]): void;
  currentTime(): number;
  durationTime(): number;
  getVolume(): number;
  loadPlaylist(playlist: Playlist): void;
  loadTracks(...tracks: Track[]): void;
  mute(): void;
  next(): void;
  pause(): void;

  /**Plays the tracks.
   * @param idx: Plays the track at the idx position.
   */
  play(idx?: number): void;
  prev(): void;
  seekTo(seconds: number, reload: boolean): void;
  setVolume(vol: number): void;
  unMute(): void;

  // tslint:disable-next-line: max-line-length
  addEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void);
  // tslint:disable-next-line: max-line-length
  delEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void);
}
