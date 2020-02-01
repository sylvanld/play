import { Component, OnInit, OnDestroy } from '@angular/core';
import { YoutubeService } from '@youtube/youtube.service';

@Component({
  selector: 'app-sticky-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class StickyPlayerComponent implements OnInit, OnDestroy {

  private showPlayer = false;
  private isPlaying = false;

  private updateInterval;
  private currentTime: number;
  private duration: number;

  constructor(private youtube: YoutubeService) { }

  ngOnInit() {
    // subscribe to the state
    this.youtube.statePlay.subscribe((val: boolean) => { this.showPlayer = val; });
    this.youtube.isPlaying.subscribe((val: boolean) => { this.isPlaying = val; });

    // This code loads the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.updateInterval = setInterval(() => {
      this.currentTime = this.youtube.getCurrentTime();
      this.duration = this.youtube.getDuration();
    }, 500);

  }

  ngOnDestroy(): void {
    this.youtube.destroy();
    clearInterval(this.currentTime);
  }

}
