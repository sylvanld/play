import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// https://medium.com/angular-in-depth/the-new-angular-youtube-player-component-9ce52ecf3dee

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private player: YT.Player;
  private _statePlay: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly statePlay: Observable<boolean> = this._statePlay.asObservable();

  private _isPlaying: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly isPlaying: Observable<boolean> = this._isPlaying.asObservable();

  // tslint:disable-next-line: max-line-length
  readonly searchUrl = (apiKey, query) => 'https://www.googleapis.com/youtube/v3/search?key=' + apiKey + '&type=video&part=snippet&order=relevance&maxResults=10&q=' + query;

  constructor(private http: HttpClient) { }

  searchTrack(query: string) {
    return this.http.get(this.searchUrl('AIzaSyB-t7E-THHu2fG8nOhW9nuWUIAwQhjljbQ', query));
  }

  /** Initialise the YT service when the YT player is ready.
   * @param target: the YT object
   */
  ready({ target }) {
    this.player = target;

    this._statePlay.next(true);
    console.log(this.player);
  }

  /** Destroy the player.
   */
  destroy() {
    this._statePlay.next(false);
    this.player.destroy();
    this.player = undefined;
  }

  // Youtube Player API
  public readonly getCurrentTime = () => this.player.getCurrentTime();
  public readonly getDuration = () => this.player.getDuration();

  public readonly play = () => { this.player.playVideo(); this._isPlaying.next(true); };
  public readonly pause = () => { this.player.pauseVideo(); this._isPlaying.next(false); };
  public readonly nextTrack = () => { this.player.nextVideo(); };
  public readonly previousTrack = () => { this.player.previousVideo(); };
  public readonly playTrackByIndex = (index: number) => { this.player.playVideoAt(index); };

  /** Cette fonction permet de charger la playlist spécifiée et de la lire.
   * @param tracks: List or string of YT id's video.
   * @param index: The positional track played.
   */
  // tslint:disable-next-line: max-line-length
  public readonly loadPlaylist = (tracks: Array<string> | string, index: number) => { this.player.loadPlaylist(tracks, index); this._isPlaying.next(true); };

  /** Cette fonction permet d'ajouter à la file d'attente la playlist spécifiée.
   * @param tracks: List or string of YT id's video.
   * @param index: The positional track played.
   */
  public readonly cuePlaylist = (tracks: Array<string> | string, index: number) => { this.player.cuePlaylist(tracks, index); };

}
