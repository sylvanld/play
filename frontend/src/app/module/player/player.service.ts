import { Injectable, InjectionToken, Inject } from '@angular/core';

import { Player, PlayerConfig, PlayerState, PlayerVolumeState } from '~types/player';
import { Playlist } from '~types/playlist';
import { Track } from '~types/track';
import { BehaviorSubject, Subject } from 'rxjs';
import { YoutubeService } from 'src/app/service/youtube.service';

// tslint:disable-next-line: variable-name
export const PlayerConfigService = new InjectionToken<PlayerConfig>('PlayerConfig');

@Injectable()
export class PlayerService implements Player {

  // handle the current provider where tracks are played
  private _provider = new BehaviorSubject<YT.Player>(undefined);
  get provider(): YT.Player { return this._provider.getValue(); }
  set provider(provider: YT.Player) { this._provider.next(provider); }

  private _playerState = PlayerState.UNSTARTED;
  get playerState(): PlayerState { return this._playerState; }
  set playerState(state: PlayerState) { this._playerState = state; }

  private _volumeState = PlayerVolumeState.HIGH;
  get volumeState(): PlayerVolumeState { return this._volumeState; }
  set volumeState(state: PlayerVolumeState) { this._volumeState = state; }

  get volume(): number { return this.getVolume(); }
  set volume(volume: number) {
    this.setVolume(volume);

    if (volume === PlayerVolumeState.MUTED) {
      this.volumeState = volume;
      this.volume = volume;
    } else if (volume === PlayerVolumeState.OFF) {
      this.volumeState = PlayerVolumeState.OFF;
    } else if (volume <= PlayerVolumeState.LOW) {
      this.volumeState = PlayerVolumeState.LOW;
    } else {
      this.volumeState = PlayerVolumeState.HIGH;
    }
  }

  private _showVideo = false;
  get showVideo(): boolean { return this._showVideo; }
  set showVideo(val: boolean) { this._showVideo = val; }

  get canVideo(): boolean {
    return this.config.selection === 'youtube' ? true : false;
  }

  private _time = 0;
  private timeInterval; // defined where player States are handled
  get duration(): number { return this.getDuration(); }
  get time(): number { return this._time; }
  set time(val: number) { this.seekTo(val, true); }

  private _tracks: Track[] = [];
  private _currentTrack = new Subject<Track>();
  public position = 0;

  constructor(
    @Inject(PlayerConfigService) public config: PlayerConfig,
    private youtube: YoutubeService
  ) {
    // Do something to initialize my values when it start
    this._provider.asObservable().subscribe((value) => {
      if (this.provider && this.config.selection === 'youtube') {

        // add the handler to have sync state.
        this.provider.addEventListener('onStateChange', ({ data }: YT.OnStateChangeEvent) => {
          switch (data) {
            case YT.PlayerState.PLAYING:
              this.timeInterval = setInterval(() => {
                this._time = this.getCurrentTime();
              }, 500);
              this.playerState = PlayerState.PLAYING;
              break;
            case YT.PlayerState.BUFFERING:
              this.timeInterval = setInterval(() => {
                this._time = this.getCurrentTime();
              }, 500);
              this.playerState = PlayerState.PLAYING;
              break;
            case YT.PlayerState.PAUSED:
              clearInterval(this.timeInterval);
              this.playerState = PlayerState.PAUSED;
              break;
            case YT.PlayerState.ENDED:
              clearInterval(this.timeInterval);
              this.playerState = PlayerState.ENDED;
              break;
            case YT.PlayerState.UNSTARTED:
              clearInterval(this.timeInterval);
              this.playerState = PlayerState.LOADING;
              break;
            default:
              clearInterval(this.timeInterval);
              console.log('case ' + data + ' for the YT player state is not handled');
          }
        });
      }
    });

    this._currentTrack.asObservable().subscribe((track: Track) => {
      if (this.provider && this.config.selection === 'youtube') {
        this.youtube.completeId(track).subscribe((track: Track) => {
          this.provider.loadPlaylist(track.external_ids.youtube);
        });
      }
    });

  }

  toggleState(): void {
    switch (this.playerState) {
      case PlayerState.PAUSED:
        this.playTrack();
        break;
      case PlayerState.PLAYING:
        this.pauseTrack();
        break;
      default:
        this.playTrack();
        break;
    }
  }
  toggleVolumeState(): void {
    switch (this.volumeState) {
      case PlayerVolumeState.MUTED:
        this.volume = this.volume;
        this.unMute();
        break;
      default:
        this.volumeState = PlayerVolumeState.MUTED;
        this.mute();
        break;
    }
  }
  toggleDisplayVideo(): void { this.showVideo = !this.showVideo; }

  nextTrack(): void {
    if (this.provider && this.config.selection === 'youtube') {
      // this.provider.nextVideo();
      this.position += 1;
      const pos = Math.abs(this.position % this._tracks.length);
      this._currentTrack.next(this._tracks[pos]);
    }
  }
  prevTrack(): void {
    if (this.provider && this.config.selection === 'youtube') {
      // this.provider.previousVideo();
      this.position -= 1;
      const pos = Math.abs(this.position % this._tracks.length);
      this._currentTrack.next(this._tracks[pos]);
    }
  }
  pauseTrack(): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.pauseVideo();
    }
  }
  playTrack(): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.playVideo();
    }
  }

  setVolume(volume: number): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.setVolume(volume);
    }
  }
  getVolume(): number {
    if (this.provider && this.config.selection === 'youtube') {
      return this.provider.getVolume();
    }
  }
  mute(): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.mute();
    }
  }
  unMute(): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.unMute();
    }
  }

  getDuration(): number {
    if (this.provider && this.config.selection === 'youtube') {
      return this.provider.getDuration();
    }
  }
  getCurrentTime(): number {
    if (this.provider && this.config.selection === 'youtube') {
      return this.provider.getCurrentTime();
    }
  }
  seekTo(time: number, reloadBuffer: boolean): void {
    if (this.provider && this.config.selection === 'youtube') {
      this.provider.seekTo(time, reloadBuffer);
    }
  }

  loadPlaylist(playlist: Playlist): void {
    this._tracks = playlist.tracks;
    this._currentTrack.next(this._tracks[0]);
  }
  queuePlaylist(playlist: Playlist): void {
    this._tracks = [...this._tracks, ...playlist.tracks];
  }
  loadTracks(...tracks: Track[]): void {
    this._tracks = tracks;
    this._currentTrack.next(this._tracks[0]);
  }
  queueTracks(...tracks: Track[]): void {
    this._tracks = [...this._tracks, ...tracks];
  }

}
