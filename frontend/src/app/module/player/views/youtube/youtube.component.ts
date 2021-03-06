import { Component, OnInit, OnDestroy } from '@angular/core';

import { mergeMap, map, flatMap, catchError, take } from 'rxjs/operators';

import { PlayService } from 'src/app/service/play.service';
import { PlayerService } from '../../player.service';
import { Track, PlayerState } from '~types/index';
import { Subscription } from 'rxjs';

declare global {
  interface Window {
    // @ts-ignore
    YT: typeof YT | undefined;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  // @ts-ignore
  private _youtube: YT.Player = undefined;
  get youtube() { return this._youtube; }

  isDisplayed = false;

  get currentTime(): number { return this.youtube ? Math.round(this.youtube.getCurrentTime()) : 0; }
  get duration(): number { return this.youtube ? this.youtube.getDuration() : 0; }
  get isMuted(): boolean { return this.youtube ? this.youtube.isMuted() : false; }
  get isReady(): boolean { return this.player.getState() !== PlayerState.UNSTARTED; }


  constructor(public player: PlayerService, private play: PlayService) { }

  ngOnInit() {

    // This code loads the YT IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {

      // Create the YT player
      // @ts-ignore
      const player = new YT.Player('youtube-iframe', {
        height: '200',
        width: '300',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1, // TODO: make the keymap for control the player
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: ({ target }) => { this._youtube = target; },
          onStateChange: ({ data }) => { this.onStateChange(data); }
        }
      });
    };

    this.subscription.add(this.player.currentTrack
      .subscribe((track: Track) => {
        this.subscription.add(
          this.play.completeExternalsIds(track, { youtube: true }).subscribe((completedTrack: Track) => {
            console.log(`${completedTrack.title} is played with ${completedTrack.external_ids.youtube}`);
            this.youtube.loadVideoById(completedTrack.external_ids.youtube, 0);
          }));
      }));
  }

  onStateChange(data) {
    if (data === -1) {
      // video is loading
      this.player.setState(PlayerState.LOADING);

    } else if (data === 2) {
      this.player.setState(PlayerState.PAUSED);

    } else if (data === 1 || data === 3) {
      this.player.setState(PlayerState.PLAYING);

    } else if (data === 5) {
      // video is ready to play
      this.youtube.playVideo();

    } else if (data === 0) {
      // video is finished, so go to the next!
      this.player.nextTrack();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.youtube.stopVideo();
    this.youtube.destroy();
    this._youtube = undefined;
  }

  setVolume({ value }) {
    this.youtube.setVolume(value);
  }
  seekTo({ value, reload }) {
    this.youtube.seekTo(value, reload);
  }

}
