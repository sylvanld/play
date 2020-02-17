import { Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { PlayerConfig, PlayerProviders, PlayerState } from '~types/player';
import { Track } from '~types/index';

// tslint:disable-next-line: variable-name
export const PlayerConfigService = new InjectionToken<PlayerConfig>('PlayerConfig');

export class PlayerService {

  private _provider = new BehaviorSubject<PlayerProviders>(this.config.current);
  public readonly provider = this._provider.asObservable();

  private _state = new BehaviorSubject<PlayerState>(PlayerState.UNSTARTED);
  public readonly state = this._state.asObservable();

  private _tracks: Track[] = [];
  private _index = 0;
  private _currentTrack = new Subject<Track>();
  public readonly currentTrack = this._currentTrack.asObservable();

  constructor(@Inject(PlayerConfigService) public config: PlayerConfig) {
    console.log('~[DEBUG]~ Player sevice is started with ' + config.current + ' player!');
  }

  getState(): PlayerState { return this._state.getValue(); }
  setState(state: PlayerState): void {
    this._state.next(state);
  }

  findTrackIndex(track: Track): number {
    return this._tracks.findIndex((t: Track) => t.isrc === track.isrc);
  }

  loadTracks(index: number, ...tracks: Track[]): void {
    this._tracks = tracks;
    this._index = index;
    this._currentTrack.next(this._tracks[this._index]);
  }
  queueTracks(...tracks: Track[]): void {
    this._tracks = [...this._tracks, ...tracks];
  }

  nextTrack() {
    this._index = Math.abs(this._index + 1) % this._tracks.length;
    this._currentTrack.next(this._tracks[this._index]);
  }
  prevTrack() {
    this._index = Math.abs(this._index - 1) % this._tracks.length;
    this._currentTrack.next(this._tracks[this._index]);
  }

}
