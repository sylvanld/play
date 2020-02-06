import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistsService } from '../../../service/playlists.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { of, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerService } from 'src/app/module/player/services/player.service';
import { YoutubeService } from 'src/app/service/youtube.service';
import { Track } from 'src/app/types/track';
import { map } from 'rxjs/operators';
import { ViewItem } from 'src/app/types/view-item';
import { Playlist } from 'src/app/types/playlist';
import { Artist } from '~types/artist';
import { Album } from '~types/album';

@Component({
  selector: 'app-playlist-edition',
  templateUrl: './playlist-edition.component.html',
  styleUrls: ['./playlist-edition.component.scss']
})
export class PlaylistEditionComponent implements OnInit {
  @Input() locked = false;
  @Output() lockedChange: EventEmitter<any> = new EventEmitter();
  playlistId: string = null;
  viewMode: string = null;

  titleEdition: string;
  playlist: Observable<Playlist>;
  songsF: ViewItem[] = [];
  // switchMode = 0;  // 0: list ; 1: card

  constructor(private playlistService: PlaylistsService,
              private route: ActivatedRoute,
              private router: Router,
              private player: PlayerService,
              private youtube: YoutubeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    // router params
    this.route.queryParams.subscribe(params => {
      this.viewMode = params.view;
      this.locked = params.locked === 'true';
    });
    this.route.params.subscribe(params => {
      this.playlistId = params.id;

      this.playlist = this.playlistService.playlists.pipe(
        map(pList => pList.find(p => p.id === this.playlistId))
      );

      // load playlist data
      this.playlist.subscribe(
        p => {
          this.songsF.splice(0, this.songsF.length);
          if (p != null) {
            this.titleEdition = p.title;
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
    });
  }

  saveTitle() {
    // this.playlist.title = this.titleEdition;
    this.playlistService.renamePlaylist(this.playlistId, this.titleEdition);
  }

  addSong() {
    const mockSongId = this.songsF.length + '';
    const mockSong: Track = {
      isrc: '',
      title: `title${mockSongId}`,
      artist: `artist${mockSongId}`,
      album: 'album-id',
      release: '2020',
      external_ids: { spotify: 'spotify-id' }
    };
    /*const vItem: ViewItem = {
      id: mockSongId,
      picture: '',
      mainContent: mockSong.title,
      secondaryContent: mockSong.artist + ' - ' + mockSong.album
    }
    this.songsF.push(vItem);*/
    this.playlistService.addTrack(this.playlistId, mockSong);
  }

  moveSong(event) {
    this.playlistService.swapTracks(this.playlistId, event.oldIndex, event.newIndex);
    /*moveItemInArray(this.playlist.songList, event.oldIndex, event.newIndex);
    moveItemInArray(this.songsF, event.oldIndex, event.newIndex);
    this.data.savePlaylist(this.playlist);*/
  }

  delSong(id: string) {
    this.playlistService.delTrack(this.playlistId, +id);
    /*this.playlist.songList.splice(index, 1);
    this.songsF.splice(index, 1);
    this.data.savePlaylist(this.playlist);*/
  }

  /*clear() {
    this.playlist.songList.splice(0, this.playlist.songList.length);
    this.data.savePlaylist(this.playlist);
  }*/

  goBack() {
    if (this.viewMode != null) {
      // this.router.navigateByUrl('/playtech', { queryParams: { view: this.viewMode } });
      this.router.navigate(['/playtech'], { queryParams: { view: this.viewMode } });
    } else {
      // this.router.navigateByUrl('/playtech');
      this.router.navigate(['/playtech']);
    }
  }

  openTrack(id: string) {
    const selectedTrack = this.playlistService.getTrack(this.playlistId, +id);
    console.log('launch song:', selectedTrack);
    const query = selectedTrack.title + ' - ' + selectedTrack.artist;
    this.youtube.searchTrack(query)
            .subscribe((object: any) => {
              if (object.length > 0) {
                const idV: string = object.items[0].id.videoId;
                const track: Track = {
                  isrc: 'n',
                  title: 'n',
                  artist: 'n',
                  album: 'n',
                  release: null,
                  external_ids: { spotify: 'n', youtube: id }
                };
                this.player.provider.loadTracks(track);
              } else {
                this.snackBar.open('Aucun résultat pour ce titre.', null, { duration: 1500 });
              }
            });
  }
}
