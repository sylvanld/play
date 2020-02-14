import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Playlist } from 'src/app/types/playlist';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Observable } from 'rxjs';
import { ViewType } from 'src/app/types/view-type';
import { ViewItem } from 'src/app/types/view-item';
import { SelectionModel } from '@angular/cdk/collections';
import { Track } from 'src/app/types/track';
import { map } from 'rxjs/operators';
import { SpotifyService } from 'src/app/service/spotify.service';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  playlists: Observable<Playlist[]>;
  playlistsF: ViewItem[] = [];
  switchMode: ViewType = ViewType.Card;  // 0: list ; 1: card
  locked = false;
  selectionPlaylist = new SelectionModel<Playlist>(true, []);
  selectionPlateform = new SelectionModel<string>(true, []);
  plateforms: string[] = [];
  songsF: ViewItem[] = [];
  playlist_ID: string;

  constructor(private playlistService: PlaylistsService,
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService) { }

  ngOnInit() {
    // route params
    this.route.queryParams.subscribe(params => {
      const view: ViewType = params.view;
      if (view != null) {
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

    // platforms
    this.plateforms = ["Spotify", "Deezer"];
  }

  onSelectedPlaylist(row) {
    this.selectionPlaylist.toggle(row);
    // console.log(row);
  }

  onSelectedPlatform(row) {
    this.selectionPlateform.toggle(row);
    // console.log(row);
  }

  exportPlaylists() {
    const playlists: Playlist[] = this.selectionPlaylist.selected;
    const plateforms: string[] = this.selectionPlateform.selected;
    console.log(playlists);
    console.log(plateforms);
    console.log(this.playlistsF);

    // tslint:disable-next-line: forin
    for (let index in playlists) {
      let playlist_ = playlists[index];
      let id = playlist_.id;
      console.log(id);

      for (let index in plateforms) {
        if (plateforms[index] === "Spotify") {
          // this.spotifyService.createPlaylist(playlist_);
        } else if (plateforms[index] === "Deezer") {
          // this.deezerService.createPlaylist(playlist_);
        } else if (plateforms[index] === "Youtube") {
          // this.youtubeService.createPlaylist(playlist_);
        }
      }

      let playlistId = id;

      let playlist = this.playlistService.playlists.pipe(
        map(pList => pList.find(p => p.id === playlistId))
      );

      // load playlist data
      playlist.subscribe(
        p => {
          this.songsF.splice(0, this.songsF.length);
          if (p != null) {
            //let titleEdition = p.title;
            for (let t = 0; t < p.tracks.length; t++) {
              const vItem: ViewItem = {
                id: t + '',
                picture: null,
                mainContent: p.tracks[t].title,
                secondaryContent: p.tracks[t].artist + ' - ' + p.tracks[t].album
              };
              this.songsF.push(vItem);
            }
          }
        }
      );
      for (let i in this.songsF) {
        // toto
      }
    }
  }
}
