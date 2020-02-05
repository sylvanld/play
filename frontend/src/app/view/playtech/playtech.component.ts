import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from '../../view/playtech/playlists.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Playlist } from 'src/app/classes/Playlist';
import { ViewItem } from 'src/app/classes/ViewItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playtech',
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss']
})

export class PlaytechComponent implements OnInit {
  playlists: Playlist[] = [];
  playlistsF: ViewItem[] = [];
  switchMode = 0;  // 0: list ; 1: card
  locked = false;

  constructor(private data: PlaylistsService, private router: Router) { }

  ngOnInit() {
    const { observable, currentData } = this.data.getObservablePlaylist();
    for (const p of currentData) {
      this.playlists.push(p);
      this.playlistsF.push(Playlist.toViewFormat(p));
    }
    observable.subscribe(event => {
      switch (event.action) {
        case 'flush':
          this.playlists.splice(0, this.playlists.length);
          this.playlistsF.splice(0, this.playlists.length);
          break;
        case 'push':
          this.playlists.push(event.data);
          this.playlistsF.push(Playlist.toViewFormat(event.data));
          break;
        case 'delete':
          this.playlists.splice(event.data, 1);
          this.playlistsF.splice(event.data, 1);
          break;
        case 'update':
          const index = Playlist.indexById(this.playlists, event.data.id);
          if (index !== -1) {
            this.playlists[index] = event.data;
            this.playlistsF[index] = Playlist.toViewFormat(event.data);
          }
          break;
        case 'swap':
          moveItemInArray(this.playlists, event.data.oldIndex, event.data.newIndex);
          moveItemInArray(this.playlistsF, event.data.oldIndex, event.data.newIndex);
          break;
        default:
          break;
      }
    });
  }

  addPlaylist() {
    this.router.navigateByUrl('/playlist/create');
  }

  editPlaylist(index) {
    const selectedPlaylistId = this.playlists[index].id;
    this.router.navigateByUrl('/playlist/edit/?id=' + selectedPlaylistId);
  }

  movePlaylist(event) {
    if (event.oldIndex !== event.newIndex) {
      this.data.reorderPlaylistList(event.oldIndex, event.newIndex);
    }
  }

  delPlaylist(index) {
    this.data.removePlaylist(index);
  }

  onSwitchMode(mode) {
    this.switchMode = mode;
  }

  isListMode(): boolean {
    return this.switchMode === 0;
  }

  isCardMode(): boolean {
    return this.switchMode === 1;
  }
}
