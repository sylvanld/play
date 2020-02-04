import { PlayerProviderExtends } from '~types/player';
import { Playlist } from '~types/playlist';
import { Track } from '~types/track';

export default {

  make_player(vm: YT.Player): PlayerProviderExtends {
    if (vm instanceof YT.Player) {
      return this._make_youtube(vm);
    }
  },

  /**
   * Factory to build @class:PlayerProviderExtends: linked to @class:YT.Player:
   * @param target: The current player.
   */
  _make_youtube(target: YT.Player): PlayerProviderExtends {
    return {
      // functions
      next(): void { target.nextVideo(); },
      pause(): void { target.pauseVideo(); },
      prev(): void { target.previousVideo(); },
      play(idx?: number): void {
        idx === undefined
          ? target.playVideo()
          : target.playVideoAt(idx);
      },

      seekTo(seconds: number, reload: boolean): void {
        target.seekTo(seconds, reload);
      },

      cueTracks(...tracks: Track[]): void {
        target.cuePlaylist(tracks.map(track => track.external_ids.youtube));
      },
      cuePlaylist({ tracks }: Playlist): void {
        target.cuePlaylist(tracks.map(track => track.external_ids.youtube));
      },
      loadTracks(...tracks: Track[]): void {
        target.loadPlaylist(tracks.map(track => track.external_ids.youtube));
      },
      loadPlaylist({ tracks }: Playlist): void {
        target.loadPlaylist(tracks.map(track => track.external_ids.youtube));
      },

      currentTime(): number {
        return target.getCurrentTime();
      },
      durationTime(): number {
        return target.getDuration();
      },

      mute(): void { target.mute(); },
      unMute(): void { target.unMute(); },

      getVolume(): number { return target.getVolume(); },
      setVolume(vol: number) { target.setVolume(vol); },

      // tslint:disable-next-line: max-line-length
      addEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void) { target.addEventListener(eventName, listener); },
      // tslint:disable-next-line: max-line-length
      delEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void) { target.removeEventListener(eventName, listener); },
    };
  },
};
