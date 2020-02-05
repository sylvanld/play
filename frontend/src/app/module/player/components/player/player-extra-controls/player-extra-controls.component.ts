import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../player.service';
import { PlayerVolumeState } from '~types/player';

@Component({
  selector: 'app-player-extra-controls',
  templateUrl: './player-extra-controls.component.html',
  styleUrls: ['./player-extra-controls.component.scss']
})
export class PlayerExtraControlsComponent implements OnInit {

  constructor(private player: PlayerService) { }

  ngOnInit() { }

}
