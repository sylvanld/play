import { Component, OnInit, Input } from '@angular/core';
import { ViewItem } from '~types/view-item';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { PlayerService } from '~player/player.service';
import { Observable } from 'rxjs';
import { Playlist } from '~types/play/play-playlist';
import { Track } from '~types/play/play-track';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit {
  @Input() playlist: Observable<Playlist>;
  @Input() editMode = true;
  private items: ViewItem[] = [];
  private lastPlaylist: Playlist;

  constructor(
    private playlistService: PlaylistsService,
    private player: PlayerService
  ) { }

  ngOnInit() {
    this.playlist.subscribe((playlist: Playlist) => {
      if (playlist) {
        this.lastPlaylist = playlist;
        this.display(playlist.tracks);
        this.player.loadTracks(...playlist.tracks);
        console.log('refresh !!!')
      }
    });
  }

  // convert Playlists into displayable objects
  display(tracks: Track[]) {
    this.items.splice(0, this.items.length);
    if (tracks) {
      for (const t of tracks) {
        this.items.push({
          id: t.isrc,
          picture: '',
          mainContent: t.title,
          secondaryContent: t.artist
        });
      }
    }
  }

  // event responses
  clickedItem(index: number) {
    // launch with the player
    console.log('index:', index);
    const selectedTrack = this.lastPlaylist.tracks[index];
    console.log('selectedTrack:', selectedTrack);
    const indexPlayer = this.player.findTrackIndex(selectedTrack);
    console.log('indexPlayer:', indexPlayer);
    if (index !== -1) { this.player.nextTrack(indexPlayer); }
  }

  movedItem(event: {oldIndex: number, newIndex: number}) {
    this.playlistService.swapTracks(this.lastPlaylist.id, event.oldIndex, event.newIndex);
  }

  deletedItem(index: number) {
    this.playlistService.delTrack(this.lastPlaylist.id, index);
  }

  // filters
  filtered(tracks: Track[]) {
    if (tracks.length !== 0) {
      this.display(tracks);
    } else {
      this.display(this.lastPlaylist.tracks);
    }
  }
}
