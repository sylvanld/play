import { Component, OnInit, Input, Inject } from '@angular/core';
import { ViewItem } from '~types/view-item';
import { Router } from '@angular/router';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Playlist } from '~types/play/play-playlist';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit {
  @Input() playlists: Observable<Playlist[]>;
  private items: ViewItem[] = [];
  private lastPlaylists: Playlist[];

  constructor(
    private playlistService: PlaylistsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.playlists.subscribe(
      (playlists: Playlist[]) => {
        this.lastPlaylists = playlists;
        this.display(playlists);
      }
    );
  }

  // convert Playlists into displayable objects
  display(playlists: Playlist[]) {
    this.items.splice(0, this.items.length);
    for (const p of playlists) {
      this.items.push({
        id: p.id,
        picture: '',
        mainContent: p.title,
        secondaryContent: p.author
      });
    }
  }

  // event responses
  clickedItem(id: string) {
    this.router.navigate([`/playlist/edit/${id}`]);
  }

  deletedItem(id: string) {
    let canceled = false;
    const snackBarRef = this.snackBar.open('playlist deletion', 'undo', {
      duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => {
      canceled = true;
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!canceled) { this.playlistService.removePlaylist(id); }
    });
  }

  // filters
  filtered(playlists: Playlist[]) {
    if (playlists.length !== 0) {
      this.display(playlists);
    } else {
      this.display(this.lastPlaylists);
    }
  }
}
