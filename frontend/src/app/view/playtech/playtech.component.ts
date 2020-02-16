import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Observable } from 'rxjs';
import { Playlist } from '~types/play/play-playlist';

@Component({
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss']
})
export class PlaytechComponent implements OnInit {
  private playlists: Observable<Playlist[]>;

  constructor(private playlistService: PlaylistsService) { }

  ngOnInit() {
    // playlists data
    this.playlists = this.playlistService.playlists;
  }
}
