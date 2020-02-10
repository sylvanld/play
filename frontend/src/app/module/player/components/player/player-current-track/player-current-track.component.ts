import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../player.service';
import { Track } from '~types/track';

@Component({
  selector: 'app-player-current-track',
  templateUrl: './player-current-track.component.html',
  styleUrls: ['./player-current-track.component.scss']
})
export class PlayerCurrentTrackComponent implements OnInit {

  private title = '';

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.player.currentTrack.subscribe((track: Track) => {
      this.title = track.title;
    });
  }

}
