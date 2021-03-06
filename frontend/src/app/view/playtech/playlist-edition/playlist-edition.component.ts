import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '../../../service/playlists.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SearchResult } from '~types/search-result';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationService } from 'src/app/service/notification.service';
import { Playlist } from '~types/play/play-playlist';
import { Track } from '~types/play/play-track';
import { PlayerService } from '~player/player.service';

@Component({
  selector: 'app-playlist-edition',
  templateUrl: './playlist-edition.component.html',
  styleUrls: ['./playlist-edition.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        query('.vertical-align', [
          style({ opacity: 0, transform: 'translateX(-500px)' }),
          stagger(30, [
            animate('3s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class PlaylistEditionComponent implements OnInit {
  private playlistId: string;
  playlist: Observable<Playlist>;
  lastPlaylist: Playlist;
  titleEdition: string;
  editMode = false;
  results: SearchResult = { tracks: [], artists: [], albums: [] };
  private resetSelectionSubject = new BehaviorSubject<boolean>(false);
  readonly resetSelection = this.resetSelectionSubject.asObservable();
  selection: Track[] = [];

  constructor(
    private playlistService: PlaylistsService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private player: PlayerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playlistId = params['id'];

      if (!this.playlistId) {
        // initialize a new playlist
        this.playlistId = this.playlistService.playlistGen();
        this.router.navigate([`/playlist/edit/${this.playlistId}`]);
      }

      this.playlist = this.playlistService.playlists.pipe(
        map(pList => pList.find(p => p.id === this.playlistId))
      );
      this.playlist.subscribe((playlist: Playlist) => {
        // console.log('playlist.subscribe:', playlist);
        if (playlist) {
          this.lastPlaylist = playlist;
          this.titleEdition = playlist.title;
          this.editMode = (playlist.tracks.length === 0) ? true : this.editMode;
        }
      });
    });
  }

  swapEditMode() {
    this.editMode = !this.editMode;
  }

  saveTitle() {
    if (this.titleEdition && this.titleEdition.length > 0) {
      this.playlistService.update(this.playlistId, { title: this.titleEdition });
      this.notify.info('playlist renomm??e');
    }
  }

  // navigation
  goBack() {
    this.router.navigate(['/playtech']);
  }

  playAll() {
    if (this.lastPlaylist && this.lastPlaylist.tracks) {
      this.player.loadTracks(0, ...this.lastPlaylist.tracks);
    }
  }

  // search part
  onResultsChange(results: SearchResult) {
    this.resetSelectionSubject.next(true);
    this.results = results;
  }

  /*closeSearch() {
    this.results = { tracks: [], artists: [], albums: [] };
  }*/

  onSelected(tracks: Track[]) {
    this.selection = tracks;
  }

  selectionToPlaylist() {
    for (const t of this.selection) {
      this.playlistService.addTrack(this.playlistId, t);
    }
    this.resetSelectionSubject.next(true);
    this.notify.info('track(s) added');
  }
}
