import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Playlist } from '~types/play/play-playlist';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-playlist-bottomsheet',
  templateUrl: './playlist-bottomsheet.component.html',
  styleUrls: ['./playlist-bottomsheet.component.scss']
})
export class PlaylistBottomsheetComponent implements OnInit {
  playlists: Playlist[] = [];
  @Output() onSelection = new EventEmitter();

  constructor(
    private playlistsService: PlaylistsService,
    private elementRef: MatBottomSheetRef<PlaylistBottomsheetComponent>
  ) { }

  ngOnInit() {
    this.playlistsService.playlists.subscribe(
      (playlists: Playlist[]) => this.playlists = playlists
    );

    this.playlistsService.loadPlaylists();
  }

  selectPlaylist(playlist: Playlist) {
    this.onSelection.emit(playlist);
    this.elementRef.dismiss();
  }

}
