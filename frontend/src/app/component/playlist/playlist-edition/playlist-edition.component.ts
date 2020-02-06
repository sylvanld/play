import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistsService } from '../../../service/playlists.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from 'src/app/types/track';
import { map } from 'rxjs/operators';
import { ViewItem } from 'src/app/types/view-item';
import { Playlist } from 'src/app/types/playlist';
import { PlayerService } from '~player/player.service';
import { SearchResult } from '~types/search-result';
import { Position } from '../view/listview/listview.component';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

enum SearchStep {
  Initial = 0,
  ShowBar = 1,
  ShowResults = 2
}

@Component({
  selector: 'app-playlist-edition',
  templateUrl: './playlist-edition.component.html',
  styleUrls: ['./playlist-edition.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        query('.vertical-align', [
          style({opacity: 0, transform: 'translateX(-500px)'}),
          stagger(30, [
            animate('3s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class PlaylistEditionComponent implements OnInit {
  @Input() locked = false;
  @Output() lockedChange: EventEmitter<any> = new EventEmitter();
  playlistId: string = null;
  titleEdition: string;
  playlist: Observable<Playlist>;
  songsF: ViewItem[] = [];
  searchStep = SearchStep.Initial;
  results: SearchResult = { tracks: [], artists: [], albums: [] };
  selection = new SelectionModel<Track>(true, []);

  constructor(private playlistService: PlaylistsService,
              private route: ActivatedRoute,
              private router: Router,
              private player: PlayerService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    // router params
    this.route.queryParams.subscribe(params => {
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
    if (this.titleEdition && this.titleEdition.length > 0) {
      this.playlistService.renamePlaylist(this.playlistId, this.titleEdition);
      this._snackBar.open('playlist renommée', null, {
        duration: 1000,
        verticalPosition: 'top'
      });
    }
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
    this.playlistService.addTrack(this.playlistId, mockSong);
  }

  moveSong(event) {
    this.playlistService.swapTracks(this.playlistId, event.oldIndex, event.newIndex);
  }

  delSong(id: string) {
    this.playlistService.delTrack(this.playlistId, +id);
  }

  goBack() {
    this.router.navigate(['/playtech'], { queryParamsHandling: 'preserve' });
  }

  openTrack(id: string) {
    const selectedTrack = this.playlistService.getTrack(this.playlistId, +id);
    this.player.loadTracks(selectedTrack);
  }

  onResultsChange(results: SearchResult) {
    this.results = results;
    this.searchStep = SearchStep.ShowResults;
  }

  openSearch() {
    this.searchStep = SearchStep.ShowBar;
  }

  closeSearch() {
    this.searchStep = SearchStep.Initial;
    this.results = { tracks: [], artists: [], albums: [] };
  }

  showAddBtn(): string {
    return (this.searchStep === SearchStep.Initial) ? Position.Start : Position.None;
  }

  showSearchBar(): boolean {
    return (this.searchStep === SearchStep.ShowBar || this.searchStep === SearchStep.ShowResults);
  }

  showSearchResults(): boolean {
    return (this.searchStep === SearchStep.ShowResults);
  }

  onSelected(row) {
    this.selection.toggle(row);
  }

  selectionToPlaylist() {
    const tracks: Track[] = this.selection.selected;
    for (const t of tracks) {
      this.playlistService.addTrack(this.playlistId, t);
    }
    this.selection.clear();
  }
}
