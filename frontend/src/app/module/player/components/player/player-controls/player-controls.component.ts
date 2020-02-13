import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from '../../../player.service';
import { PlayerState } from '~types/player';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements OnInit {

  constructor(private player: PlayerService) { }

  ngOnInit() { }
}
