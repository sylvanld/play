import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/service/spotify.service';
import { Playlist, Track } from '~types/index';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  private playlists: Playlist[] = [];
  constructor(private spotify: SpotifyService) { }

  ngOnInit() {

    this.spotify.getPlaylists().subscribe((playlists: Playlist[]) => {
      this.playlists = playlists;

      this.spotify.getPlaylistTracks(playlists[0].id).subscribe((tracks: Track[]) => {
        console.log(tracks);
      });
    });
  }

}
