import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { PlayerState } from '~types/player';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements OnInit, OnDestroy {

  private playState: PlayerState = undefined;

  private updateInterval;
  private currentTime: number;
  private duration: number;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.stateObs.subscribe((val: PlayerState) => { this.playState = val; });

    // refresh times
    this.updateInterval = setInterval(() => {
      if (this.playState !== PlayerState.UNSTARTED) {
        this.currentTime = this.player.provider.currentTime();
        this.duration = this.player.provider.durationTime();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.currentTime);
  }

  newValue({ value }) {
    this.player.provider.seekTo(value, true);
    this.player.provider.play();
  }
  onMove({ value }) {
    this.player.provider.seekTo(value, false);
    this.player.provider.pause();
  }
}
