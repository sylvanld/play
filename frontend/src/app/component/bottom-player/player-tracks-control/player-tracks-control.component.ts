import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/service/player.service';

@Component({
  selector: 'app-player-tracks-control',
  templateUrl: './player-tracks-control.component.html',
  styleUrls: ['./player-tracks-control.component.scss']
})
export class PlayerTracksControlComponent implements OnInit, OnDestroy {

  isDefined = false;
  isPlaying: YT.PlayerState = YT.PlayerState.UNSTARTED;

  private updateInterval;
  currentTime: number;
  duration: number;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.isDefined.subscribe(val => this.isDefined = val);
    this.player.isPlaying.subscribe(val => this.isPlaying = val);

    // refresh times
    this.updateInterval = setInterval(() => {
      if (this.isDefined === true) {
        this.currentTime = this.player.currentTime();
        this.duration = this.player.durationTime();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.currentTime);
  }

  newValue({ value }) {
    this.player.seekTo(value, true);
    this.player.play();
  }
  onMove({ value }) {
    this.player.seekTo(value, false);
    this.player.pause();
  }
}
