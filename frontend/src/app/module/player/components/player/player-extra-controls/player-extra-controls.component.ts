import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { PlayerVolumeState } from '~types/player';

@Component({
  selector: 'app-player-extra-controls',
  templateUrl: './player-extra-controls.component.html',
  styleUrls: ['./player-extra-controls.component.scss']
})
export class PlayerExtraControlsComponent implements OnInit {

  private muteState: PlayerVolumeState;
  private showVideo = false;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.volumeObs.subscribe((val: PlayerVolumeState) => { this.muteState = val; });
    this.player.showVideo.subscribe((val: boolean) => { this.showVideo = val; });
  }

}
