import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private player: PlayerService) { }

  ngOnInit() { }

}
