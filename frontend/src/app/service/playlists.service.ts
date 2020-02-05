import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Playlist } from 'src/app/classes/Playlist';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { PlaylistsMock } from '../classes/playlists.mock';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private PLAYLISTS_KEY = 'playlists';

  private playlistIdList: string[];
  private playlists: Playlist[] = [];
  private observablePlaylist = new Subject<any>();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    // this.flushLocalstorage();
    this.loadData();
  }

  private loadData() {
    // load data from localstorage
    this.playlists = [];
    this.observablePlaylist.next({ action: 'flush', data: null });
    this.playlistIdList = JSON.parse(JSON.parse((localStorage.getItem(this.PLAYLISTS_KEY)))) || [];
    for (const playlistId of this.playlistIdList) {
      const playlistJson = JSON.parse(JSON.parse(localStorage.getItem(playlistId)));
      if (playlistJson != null) {
        const playlist = Playlist.fromJson(playlistJson);
        this.playlists.push(playlist);
        this.observablePlaylist.next({ action: 'push', data: playlist });
      }
    }
  }

  public getObservablePlaylist(): any {
    return { observable: this.observablePlaylist, currentData: this.playlists };
  }

  public getPlaylist(playlistId: string): Playlist {
    for (const p of this.playlists) {
      if (p.id === playlistId) {
        return p;
      }
    }
    return null;
  }

  public createPlaylist(title: string= null): Playlist {
    const date = new Date();
    if (title == null) {
      const dateISO = date.toISOString();
      const formattedDate = moment(dateISO).format('DD/MM/YYYY HH:mm');
      title = 'New Playlist ' + formattedDate;
    }
    const id = 'playlist-' + uuid.v4();
    const newPlaylist = new Playlist(id, '/assets/icons/default.svg', title, PlaylistsMock.currentUserMock, date, []);
    this.savePlaylist(newPlaylist);
    return newPlaylist;
  }


  public savePlaylist(playlist: Playlist) {
    // update caching
    const index = Playlist.indexById(this.playlists, playlist.id);
    if (index === -1) {
      this.playlists.push(playlist);
      this.playlistIdList.push(playlist.id);
      this.observablePlaylist.next({ action: 'push', data: playlist });
    } else {
      this.playlists[index] = playlist;
      this.observablePlaylist.next({ action: 'update', data: playlist });
    }

    // update localstorage
    this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
    this.storage.set(playlist.id, JSON.stringify(Playlist.toJson(playlist)));
  }

  public removePlaylist(playlistId: string) { // playlistId: string) {
    const index = Playlist.indexById(this.playlists, playlistId);
    if (index !== -1) {
      // update caching
      this.playlists.splice(index, 1);
      this.playlistIdList.splice(index, 1);
      this.observablePlaylist.next({ action: 'delete', data: index });

      // update localstorage
      this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
      this.storage.remove(playlistId);
    }
  }

  public reorderPlaylistList(oldIndex: number, newIndex: number) {
    if (oldIndex !== newIndex) {
      // update caching
      moveItemInArray(this.playlistIdList, oldIndex, newIndex);
      this.observablePlaylist.next({ action: 'swap', data: { oldIndex, newIndex } });

      // update localstorage
      this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
    }
  }

  private flushLocalstorage() {
    this.storage.clear();
  }
}
