import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { ViewType } from 'src/app/types/view-type';
import { ViewItem } from 'src/app/types/view-item';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { SpotifyUserService } from 'src/app/service/spotify-user.service';
import { DeezerUserService } from 'src/app/service/deezer-user.service';

import { Playlist, Track } from '~types/index';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class RemovalExportComponent implements OnInit {
  playlistsF: ViewItem[] = [];
  switchMode: ViewType = ViewType.Card;  // 0: list ; 1: card
  locked = false;
  selectionPlaylist = new SelectionModel<Playlist>(true, []);
  selectionPlateform = new SelectionModel<string>(true, []);
  plateforms: string[] = [];
  songsF: ViewItem[] = [];

  constructor(
    private playlistService: PlaylistsService,
    private route: ActivatedRoute,
    private router: Router,
    private spotifyUserService: SpotifyUserService,
    private deezerUserService: DeezerUserService) { }

  ngOnInit() {
    // route params
    this.route.queryParams.subscribe(params => {
      const view: ViewType = params.view;
      if (view != null) {
        this.switchMode = view;
      }
    });

    // playlists data
    this.playlistService.playlists.subscribe(data => {
      this.playlistsF.splice(0, this.playlistsF.length);
      for (const p of data) {
        const vItem: ViewItem = {
          id: p.id,
          picture: p.cover,
          mainContent: p.title,
          secondaryContent: p.author,
          ro_diasabled: (p.tracks.length === 0)
        };
        this.playlistsF.push(vItem);

      }
      if (this.playlistsF.length === 0) {
        this.switchMode = ViewType.List;
      }
    });

    // platforms
    this.plateforms = ['Spotify', 'Deezer'];
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
    console.log(this.songsF);

    // tslint:disable-next-line: forin
    for (const index in playlists) {
      const playList = playlists[index];
      let resultSpotify: any;
      let resultDeezer: any;
      let resultYoutube: any;
      let dataSpotify: any;
      let dataDeezer: any;
      let dataYoutube: any;

      const playlistId = playList.id;

      const playlist = this.playlistService.playlists.pipe(
        map(pList => pList.find(p => p.id === playlistId))
      );

      // load playlist data
      playlist.subscribe(
        p => {
          for (const i in plateforms) {
            if (plateforms[i] === 'Spotify') {
              console.log('plateform', plateforms[index]);
              resultSpotify = this.spotifyUserService.createPlaylist(p);
            } else if (plateforms[i] === 'Deezer') {
              //resultDeezer = this.deezerUserService.createPlaylist(p);
            } else if (plateforms[i] === 'Youtube') {
              // resultYoutube = this.youtubeUserService.createPlaylist(p);
            }
          }
          this.songsF.splice(0, this.songsF.length);
          if (p != null) {
            // let titleEdition = p.title;
            for (let t = 0; t < p.tracks.length; t++) {
              const vItem: ViewItem = {
                id: t + '',
                picture: null,
                mainContent: p.tracks[t].title,
                identifier: p.tracks[t].external_ids,
                secondaryContent: p.tracks[t].artist + ' - ' + p.tracks[t].album
              };
              this.songsF.push(vItem);
            }
          }
        }
      );
      for (const j in plateforms) {
        if (plateforms[j] === 'Spotify') {
          dataSpotify = resultSpotify.subscribe(
            data => data
          );
          console.log('dataSpotify', dataSpotify);
          // {
          //   console.log('sortie', data.id);
          //   //this.spotifyUserService.addTrack(data.id, song);
          // }
        } else if (plateforms[j] === 'Deezer') {
          dataDeezer = resultDeezer.subscribe(
            data => data
          );
          // {
          //   console.log('sortie', data.id);
          //   // this.deezerUserService.addTrack(data.id, song);
          // }
        } else if (plateforms[j] === 'Youtube') {
          dataYoutube = resultYoutube.subscribe(
            data => data
          );
          // {
          //   console.log('sortie', data.id);
          //   // this.youtubeService.createPlaylist();
          // }
        }
      }
      for (const song of this.songsF) {
        // 
      }
    }
  }
}
