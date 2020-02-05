import { Component, OnInit } from '@angular/core';
import { YoutubeService } from 'src/app/service/youtube.service';
import { PlayerService } from '~player/services/player.service';
import { Track } from '~types/track';

@Component({
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  query = '';

  constructor(private player: PlayerService, private youtube: YoutubeService) { }

  ngOnInit() { }

  onSubmit() {
    this.youtube.searchTrack(this.query)
      .subscribe((object: any) => {
        const id: string = object.items[0].id.videoId;
        const track: Track = { irsc: 'n', title: 'n', artist: 'n', album: 'n', external_ids: { spotify: 'n', youtube: id } };
        this.player.provider.loadTracks(track);
      });
  }

}
