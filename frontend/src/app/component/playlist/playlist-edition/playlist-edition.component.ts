import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistsService } from '../../../view/playtech/playlists.service';
import { Playlist } from '../../../classes/Playlist';
import { Song } from '../../../classes/Song';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { ViewItem } from 'src/app/classes/ViewItem';

@Component({
  selector: 'app-playlist-edition',
  templateUrl: './playlist-edition.component.html',
  styleUrls: ['./playlist-edition.component.scss']
})
export class PlaylistEditionComponent implements OnInit {
  @Input() playlistId: string;
  @Input() locked: boolean = true;
  @Output() lockedChange: EventEmitter<any> = new EventEmitter();

  titleEdition: string;
  playlist: Playlist;
  songsF: ViewItem[] = [];
  switchMode: number = 0;  // 0: list ; 1: card

  latOpts = [
    {
      icon: 'keyboard_arrow_up',
      label: null,
      bgColor: 'red',
      onClick: () => { this.goToTop() }
    }
  ];
  
  constructor(private data: PlaylistsService) { }

  ngOnInit() {
    if (this.playlistId != null) {
      this.playlist = this.data.getPlaylist(this.playlistId);
      of(this.playlist).subscribe(
        playlist => {
          this.titleEdition = this.playlist.title;
        }
      );
      //console.log('playlist-edition this.playlist:', this.playlist);
    }
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
    //console.log('add song');
    let mockSongId = this.songsF.length.toString();
    let mockSong: Song = new Song(mockSongId, '/assets/icons/default.svg', 'title'+mockSongId, ['artiste1'], new Date());
    this.playlist.songList.push(mockSong);
    this.songsF.push(Song.toViewFormat(mockSong));
    this.data.savePlaylist(this.playlist);
  }

  moveSong(event) {
    //console.log('move song: '+event.oldIndex+'->'+event.newIndex);
    moveItemInArray(this.playlist.songList, event.oldIndex, event.newIndex);
    moveItemInArray(this.songsF, event.oldIndex, event.newIndex);
    this.data.savePlaylist(this.playlist);
  }

  delSong(index) {
    //console.log('delete song: '+index);
    this.playlist.songList.splice(index, 1);
    this.songsF.splice(index, 1);
    this.data.savePlaylist(this.playlist);
  }

  onSwitchMode(mode) {
    this.switchMode = mode;
  }

  isListMode():boolean {
    return this.switchMode === 0
  }

  isCardMode():boolean {
    return this.switchMode === 1
  }

  clear() {
    this.playlist.songList.splice(0, this.playlist.songList.length);
    this.data.savePlaylist(this.playlist);
  }

  goToTop() {
    //document.body.animate({scrollTop:0}, {duration: 1000});
    window.scrollTo(0, 0);
  }
}
