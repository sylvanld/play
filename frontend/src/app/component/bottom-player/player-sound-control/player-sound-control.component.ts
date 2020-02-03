import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/service/player.service';

@Component({
  selector: 'app-player-sound-control',
  templateUrl: './player-sound-control.component.html',
  styleUrls: ['./player-sound-control.component.scss']
})
export class PlayerSoundControlComponent implements OnInit {

  isMuted = false;

  constructor(private player: PlayerService) { }

  ngOnInit() {
  }

}
