import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// https://medium.com/angular-in-depth/the-new-angular-youtube-player-component-9ce52ecf3dee

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // about the player
  private _player: YT.Player;
  private _isDefined: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly isDefined: Observable<boolean> = this._isDefined.asObservable();

  // about the playing
  private _isPlaying: BehaviorSubject<YT.PlayerState> = new BehaviorSubject(YT.PlayerState.UNSTARTED);
  readonly isPlaying: Observable<YT.PlayerState> = this._isPlaying.asObservable();

  constructor() { }

  /** Initialise the player.
   * @param instance: the player instance.
   */
  ready({ target }) {
    this._isDefined.next(true);
    this._player = target;

    // adding handlers
    const vm: PlayerService = this;
    const onStateChangeHandler = ({ data }: YT.OnStateChangeEvent) => {
      vm._isPlaying.next(data);
    };

    this._player.addEventListener('onStateChange', onStateChangeHandler);
  }

  /** Destroy the current player. */
  destroy() {
    this._isDefined.next(false);
    if (this._player instanceof YT.Player) { this._player.destroy(); }

    this._player = undefined;
  }

  // public Player API //

  // Player controls //
  public readonly play = () => { this._player.playVideo(); };
  public readonly pause = () => { this._player.pauseVideo(); };
  public readonly toggleState = () => {
    this.currentState() in [YT.PlayerState.PLAYING, YT.PlayerState.BUFFERING] ? this.pause() : this.play();
  }
  public readonly next = () => { this._player.nextVideo(); };
  public readonly previous = () => { this._player.previousVideo(); };

  // Player extra controls //
  public readonly mute = () => { this._player.mute(); };
  public readonly unMute = () => { this._player.unMute(); };
  public readonly isMuted = () => this._player.isMuted();
  public readonly toggleVolume = () => { this.isMuted() ? this.unMute() : this.mute(); };
  public get volume() { return this._player.getVolume(); }
  public set volume(v: number) { this._player.setVolume(v); }

  // Player tracks //
  public readonly currentTime = () => this._player.getCurrentTime();
  public readonly seekTo = (seconds: number, reload = false) => this._player.seekTo(seconds, reload);

  public readonly durationTime = () => this._player.getDuration();
  public readonly currentState = () => this._player.getPlayerState();

  /** Play a track from the current playlist.
   * @param index: the positional id inside the playlist.
   */
  public playTrack(index: number) {
    this._player.playVideoAt(index);
  }

  /** Load tracks and start playing.
   * @param tracks: List or string of YT id's video.
   * @param index: The positional track played.
   */
  // tslint:disable-next-line: max-line-length
  public loadPlaylist(tracks: string[] | string, index: number) {
    this._player.loadPlaylist(tracks, index);
  }

  /** Cue tracks with the current playlist.
   * @param tracks: List or string of YT id's video.
   * @param index: The positional track played.
   */
  public cuePlaylist(tracks: Array<string> | string, index: number) {
    this._player.cuePlaylist(tracks, index);
  }

}
