import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-player-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  constructor(private player: PlayerService) { }

  ngOnInit() {
    // This code loads the YT IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  onYTReady({ target }: YT.PlayerEvent) {
    this.player.provider = target;
  }
}
