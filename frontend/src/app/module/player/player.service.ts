import { Inject, InjectionToken } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

import { PlayerConfig, PlayerProviders, PlayerState } from "~types/player";
import { Track } from "~types/index";

// tslint:disable-next-line: variable-name
export const PlayerConfigService = new InjectionToken<PlayerConfig>(
  "PlayerConfig"
);

export class PlayerService {
  private _provider = new BehaviorSubject<PlayerProviders>(this.config.current);
  public readonly provider = this._provider.asObservable();

  private _state = new BehaviorSubject<PlayerState>(PlayerState.UNSTARTED);
  public readonly state = this._state.asObservable();

  private _tracks: Track[] = [];
  private _tracksQueue = new Subject<Track[]>();
  public readonly tracksQueue = this._tracksQueue.asObservable();

  private _index = 0;
  private _currentTrack = new Subject<Track>();
  public readonly currentTrack = this._currentTrack.asObservable();

  constructor(@Inject(PlayerConfigService) public config: PlayerConfig) {
    console.log(
      "~[DEBUG]~ Player sevice is started with " + config.current + " player!"
    );
    this.bindKeysListener();
  }

  getState(): PlayerState {
    return this._state.getValue();
  }
  setState(state: PlayerState): void {
    this._state.next(state);
  }

  keysListener(evt) {
    console.log(evt.code);

    switch (evt.code) {
      case "ArrowRight":
        this.nextTrack();
        break;
      case "ArrowLeft":
        this.prevTrack();
        break;
    }
  }

  bindKeysListener() {
    window.addEventListener("keydown", evt => this.keysListener(evt));
  }

  findTrackIndex(track: Track): number {
    return this._tracks.findIndex((t: Track) => t.isrc === track.isrc);
  }

  setPosition(index: number) {
    this._index = Math.abs(index) % this._tracks.length;
    this._currentTrack.next(this._tracks[this._index]);
  }

  loadTracks(index: number, ...tracks: Track[]): void {
    this._tracks = tracks;
    this.setPosition(index);
    this._tracksQueue.next(this._tracks);
  }

  queueTracks(...tracks: Track[]): void {
    this._tracks = [...this._tracks, ...tracks];
    this._tracksQueue.next(this._tracks);
    console.log(this._tracks);
  }

  nextTrack() {
    if (this._tracks.length > 0) {
      this.setPosition(this._index + 1);
    }
  }

  prevTrack() {
    if (this._tracks.length > 0) {
      this.setPosition(this._index - 1);
    }
  }
}
