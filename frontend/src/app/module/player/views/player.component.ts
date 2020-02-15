import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { PlayerProviders } from '~types/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  private currentPlayer: PlayerProviders = undefined;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.provider.subscribe((val: PlayerProviders) => this.currentPlayer = val);
  }

}
