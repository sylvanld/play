import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { PlaylistsService } from '../../../view/playtech/playlists.service';
import { Playlist } from '../../../classes/Playlist';
import { Song } from '../../../classes/Song';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { ViewItem } from 'src/app/classes/ViewItem';
import { ActivatedRoute, Router } from '@angular/router';

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
  playlist: Playlist;
  songsF: ViewItem[] = [];
  // switchMode = 0;  // 0: list ; 1: card

  constructor(private data: PlaylistsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playlistId = params.id;
      this.playlist = this.data.getPlaylist(this.playlistId);
      if (this.playlist != null) {
        for (const s of this.playlist.songList) {
          this.songsF.push(Song.toViewFormat(s));
        }
      }
    });
    this.route.queryParams.subscribe(params => {
      this.viewMode = params.view;
    });
    of(this.playlist).subscribe(
      playlist => {
        if (this.playlist != null) {
          this.titleEdition = this.playlist.title;
        }
      }
    );
  }

  saveTitle() {
    this.playlist.title = this.titleEdition;
    this.data.savePlaylist(this.playlist);
  }

  lock() {
    this.locked = true;
    this.lockedChange.emit(this.locked);
  }

  unlock() {
    this.locked = false;
    this.lockedChange.emit(this.locked);
  }

  addSong() {
    const mockSongId = this.songsF.length.toString();
    const mockSong: Song = new Song(mockSongId, '/assets/icons/default.svg', 'title' + mockSongId, ['artiste1'], new Date());
    this.playlist.songList.push(mockSong);
    this.songsF.push(Song.toViewFormat(mockSong));
    this.data.savePlaylist(this.playlist);
  }

  moveSong(event) {
    moveItemInArray(this.playlist.songList, event.oldIndex, event.newIndex);
    moveItemInArray(this.songsF, event.oldIndex, event.newIndex);
    this.data.savePlaylist(this.playlist);
  }

  delSong(index) {
    this.playlist.songList.splice(index, 1);
    this.songsF.splice(index, 1);
    this.data.savePlaylist(this.playlist);
  }

  /*onSwitchMode(mode) {
    this.switchMode = mode;
  }

  isListMode(): boolean {
    return this.switchMode === 0;
  }

  isCardMode(): boolean {
    return this.switchMode === 1;
  }*/

  clear() {
    this.playlist.songList.splice(0, this.playlist.songList.length);
    this.data.savePlaylist(this.playlist);
  }

  goBack() {
    if (this.viewMode != null) {
      // this.router.navigateByUrl('/playtech', { queryParams: { view: this.viewMode } });
      this.router.navigate(['/playtech'], { queryParams: { view: this.viewMode } });
    } else {
      // this.router.navigateByUrl('/playtech');
      this.router.navigate(['/playtech']);
    }
  }
}
