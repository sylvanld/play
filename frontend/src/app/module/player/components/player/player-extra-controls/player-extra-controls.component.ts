import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerService } from '@player/services/player.service';
import { PlayerState, VolumeState } from '@player/services/player.types';

@Component({
  selector: 'app-player-extra-controls',
  templateUrl: './player-extra-controls.component.html',
  styleUrls: ['./player-extra-controls.component.scss']
})
export class PlayerExtraControlsComponent implements OnInit {

  private muteState: VolumeState;
  private showVideo = false;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.volumeObs.subscribe((val: VolumeState) => { this.muteState = val; });
    this.player.showVideo.subscribe((val: boolean) => { this.showVideo = val; });
  }

}
