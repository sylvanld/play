import { Component, OnInit, Input } from '@angular/core';
import { Track } from '~types/track';
import { ViewItem } from '~types/view-item';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { PlayerService } from '~player/player.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Playlist } from '~types/playlist';
import { Observable } from 'rxjs';

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
    private player: PlayerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.playlist.subscribe((playlist: Playlist) => {
      this.lastPlaylist = playlist;
      this.display(playlist.tracks);
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
  clickedItem(id: string) {
    // launch with the player
    const selectedTrack = this.playlistService.getTrackAt(this.lastPlaylist.id, +id);
    this.player.loadTracks(selectedTrack);
  }

  movedItem(event: {oldIndex: number, newIndex: number}) {
    this.playlistService.swapTracks(this.lastPlaylist.id, event.oldIndex, event.newIndex);
  }

  deletedItem(id: string) {
    let canceled = false;
    const snackBarRef = this.snackBar.open('track deletion', 'undo', {
      duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => {
      canceled = true;
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!canceled) { this.playlistService.delTrack(this.lastPlaylist.id, +id); }
    });
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
