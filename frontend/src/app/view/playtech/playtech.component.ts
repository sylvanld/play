import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Playlist } from 'src/app/types/playlist';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Observable } from 'rxjs';
import { ViewType } from 'src/app/types/view-type';
import { ViewItem } from 'src/app/types/view-item';

@Component({
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss']
})
export class PlaytechComponent implements OnInit {
  playlists: Observable<Playlist[]>;
  playlistsF: ViewItem[] = [];
  switchMode: ViewType = ViewType.Card;  // 0: list ; 1: card
  locked = false;

  constructor(private playlistService: PlaylistsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // route params
    this.route.queryParams.subscribe(params => {
      const view: ViewType = params.view;
      if(view != null) {
        this.switchMode = view;
      }
    });

    // playlists data
    this.playlists = this.playlistService.playlists;
    this.playlistService.loadAll();
    this.playlists.subscribe(data => {
      this.playlistsF.splice(0, this.playlistsF.length);
      for (const p of data) {
        const vItem: ViewItem = {
          id: p.id,
          picture: p.cover,
          mainContent: p.title,
          secondaryContent: p.author,
          ro_diasabled: (p.tracks.length == 0)
        };
        this.playlistsF.push(vItem);
      }
      if (this.playlistsF.length == 0) {
        this.switchMode = ViewType.List;
      }
    });
  }

  addPlaylist() {
    this.router.navigate(['/playlist/create'], { queryParams: { view: this.switchMode } });
  }

  editPlaylist(index) {
    const id = this.playlistsF[index].id;
    const lock = this.locked || this.isReadOnly();
    this.router.navigate([`/playlist/edit/${id}`], { queryParams: { view: this.switchMode, locked: lock } });
  }

  movePlaylist(event) {
    this.playlistService.swapPlaylists(event.oldIndex, event.newIndex);
  }

  delPlaylist(id: string) {
    this.playlistService.remove(id);
  }

  isReadOnly(): boolean {
    return this.switchMode == ViewType.Card;
  }

  noPlaylist() {
    return (this.playlistsF.length === 0);
  }

}
