import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from '@play/player.service';
import { YoutubeService } from '@youtube/youtube.service';

@Component({
  selector: 'app-bottom-player',
  templateUrl: './bottom-player.component.html',
  styleUrls: ['./bottom-player.component.scss']
})
export class BottomPlayerComponent implements OnInit, OnDestroy {

  private isDefined = false;
  private isPlaying: YT.PlayerState = YT.PlayerState.UNSTARTED;
  private isMuted = false;

  private updateInterval;
  private currentTime: number;
  private duration: number;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    // subscribe to the state
    this.player.isDefined.subscribe(val => this.isDefined = val);
    this.player.isPlaying.subscribe(val => this.isPlaying = val);

    // This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // refresh times
    this.updateInterval = setInterval(() => {
      if (this.isDefined === true) {
        this.currentTime = this.player.currentTime();
        this.duration = this.player.durationTime();
      }
    }, 500);
  }

  newValue({value}) {
    this.player.seekTo(value, true);
    this.player.play();
  }
  onMove({value}) {
    this.player.seekTo(value, false);
    this.player.pause();
  }

  ngOnDestroy(): void {
    this.player.destroy();
    clearInterval(this.currentTime);
  }

}
