import { Injectable, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PlayerConfig, PlayerExtends, PlayerState, VolumeState } from './player.types';
import PlayerFactory from './player.factory';

// tslint:disable-next-line: variable-name
export const PlayerConfigService = new InjectionToken<PlayerConfig>('PlayerConfig');

@Injectable()
export class PlayerService {

  // about show or not the YT video
  private _showVideo: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly showVideo: Observable<boolean> = this._showVideo.asObservable();

  // about the state of the player
  private _state: BehaviorSubject<PlayerState> = new BehaviorSubject(PlayerState.UNSTARTED);
  public readonly stateObs: Observable<PlayerState> = this._state.asObservable();
  get state() { return this._state.getValue(); }
  set state(val: PlayerState) { this._state.next(val); }

  // about the volume of the player
  private _volume: BehaviorSubject<VolumeState> = new BehaviorSubject(VolumeState.HIGH);
  public readonly volumeObs: Observable<VolumeState> = this._volume.asObservable();
  get volume() { return this.provider ? this.provider.getVolume() : 0; }
  set volume(vol: number) {
    if (this.provider) {
      this.provider.setVolume(vol);

      // handle the state of the volume
      if (vol !== this._volume.getValue()) {
        vol > VolumeState.OFF
        ? vol > VolumeState.LOW
        ? this._volume.next(VolumeState.HIGH)
        : this._volume.next(VolumeState.LOW)
        : this._volume.next(VolumeState.OFF);
      }
    }
  }

  public provider: PlayerExtends;
  constructor(@Inject(PlayerConfigService) public config) {}

  _setProvider(target: YT.Player) {
    this.provider = PlayerFactory.make_player(target);
  }

  ready($event) {
    const vm = this;
    if (this.config.default === 'youtube') {
      this._setProvider($event.target);

      this.provider.addEventListener('onStateChange', ({data}: YT.OnStateChangeEvent) => {
        // handle the state of the playing
        data === YT.PlayerState.ENDED
          ? vm._state.next(PlayerState.ENDED)
          : data === YT.PlayerState.PAUSED
            ? vm._state.next(PlayerState.PAUSED)
            : data === YT.PlayerState.UNSTARTED
              ? vm._state.next(PlayerState.UNSTARTED)
              : vm._state.next(PlayerState.PLAYING);
      });
    }
  }

  toggleState(): void {
    if (this.state === PlayerState.PLAYING) {
      this.provider.pause();
      this.state = PlayerState.PAUSED;
    } else {
      this.provider.play();
      this.state = PlayerState.PLAYING;
    }
  }
  toggleVolume(): void {
    if (this._volume.getValue() === VolumeState.HIGH || this._volume.getValue() === VolumeState.LOW) {
      this.provider.mute();
      this._volume.next(VolumeState.MUTED);
    } else {
      this.provider.unMute();
      this.volume = this.volume;
    }
  }

  toggleShowVideo(): void {
    this._showVideo.getValue() ? this._showVideo.next(false) : this._showVideo.next(true);
  }

}
