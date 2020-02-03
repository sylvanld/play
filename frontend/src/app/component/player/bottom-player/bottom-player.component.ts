import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/service/player.service';
import { YoutubeService } from 'src/app/service/youtube.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-bottom-player',
  templateUrl: './bottom-player.component.html',
  styleUrls: ['./bottom-player.component.scss']
})
export class BottomPlayerComponent implements OnInit, OnDestroy {
  isConnected = false;
  isDefined = false;
  isPlaying: YT.PlayerState = YT.PlayerState.UNSTARTED;
  isMuted = false;

  private updateInterval;
  currentTime: number;
  duration: number;

  constructor(public player: PlayerService, private auth: AuthenticationService) { }

  ngOnInit() {
    // subscribe to the state
    this.player.isDefined.subscribe(val => this.isDefined = val);
    this.player.isPlaying.subscribe(val => this.isPlaying = val);
    this.auth.connected.subscribe(val => this.isConnected = val);

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

  newValue({ value }) {
    this.player.seekTo(value, true);
    this.player.play();
  }
  onMove({ value }) {
    this.player.seekTo(value, false);
    this.player.pause();
  }

  ngOnDestroy(): void {
    this.player.destroy();
    clearInterval(this.currentTime);
  }

}
