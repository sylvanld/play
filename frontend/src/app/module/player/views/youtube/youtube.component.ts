import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player.service';
import { PlayerState } from '~types/player';
import { Track } from '~types/track';
import { YoutubeService } from 'src/app/service/youtube.service';
import { map, tap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
export class YoutubeComponent implements OnInit {

  // @ts-ignore
  private _youtube: YT.Player = undefined;
  private get youtube() { return this._youtube; }

  private isDisplayed = false;

  private get currentTime(): number { return this.youtube ? Math.round(this.youtube.getCurrentTime()) : 0; }
  private get duration(): number { return this.youtube ? this.youtube.getDuration() : 0; }
  private get isMuted(): boolean { return this.youtube ? this.youtube.isMuted() : false; }
  private get isReady(): boolean { return this.player.getState() !== PlayerState.UNSTARTED; }


  constructor(private player: PlayerService, private youtubeS: YoutubeService) { }

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

    this.player.currentTrack.pipe(
      // retrieve the YT id, only in the YT player
      mergeMap((track: Track) => this.youtubeS.completeId(track))
    )
      .subscribe((track: Track) => {
        // actualise the current played video.
        this.youtube.cueVideoById(track.external_ids.youtube, 0);
      });
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

  setVolume({ value }) {
    this.youtube.setVolume(value);
  }
  seekTo({ value, reload }) {
    this.youtube.seekTo(value, reload);
  }

}
