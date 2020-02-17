import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../module/player/player.service';
import { Track } from '~types/index';

@Component({
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  query = '';

  constructor(private player: PlayerService) { }

  ngOnInit() { }

  onSubmit() {
    const track2: Track = {
      isrc: 'n',
      title: 'boobs',
      artist: '',
      album: 'n',
      release: 'n',
      external_ids: { spotify: 'n' }
    };
    const track = { ...track2, title: this.query, external_ids: { spotify: 'n' } };
    this.player.loadTracks(0, ...[track, track2]);
  }
}
