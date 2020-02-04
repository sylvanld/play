import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Playlist } from 'src/app/classes/Playlist';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { PlaylistsMock } from './playlists.mock';
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
    //this.flushLocalstorage();
    this.loadData();
  }

  private loadData() {
    // load data from localstorage
    this.playlists = [];
    this.observablePlaylist.next({ action: "flush", data: null })
    this.playlistIdList = JSON.parse(JSON.parse((localStorage.getItem(this.PLAYLISTS_KEY)))) || [];
    for (let playlistId of this.playlistIdList) {
      let playlistJson = JSON.parse(JSON.parse(localStorage.getItem(playlistId)));
      if (playlistJson != null) {
        let playlist = Playlist.fromJson(playlistJson);
        this.playlists.push(playlist);
        this.observablePlaylist.next({ action: "push", data: playlist })
      }
    }

    //console.log('service->loadData');
    //console.log('service->playlist up-to-date:', this.playlists);
  }

  public getObservablePlaylist(): any {
    return { observable: this.observablePlaylist, currentData: this.playlists };
  }

  public getPlaylist(playlistId: string): Playlist {
    for(let i=0; i<this.playlists.length; i++) {
      if(this.playlists[i].id === playlistId) {
        return this.playlists[i];
      }
    }
    return null;
  }

  public createPlaylist(title: string=null): Playlist {
    let date = new Date();
    if (title == null) {
      let dateISO = date.toISOString();
      let formattedDate = moment(dateISO).format('DD/MM/YYYY HH:mm');
      title = "New Playlist "+formattedDate;
    }
    let id = 'playlist-' + uuid.v4();
    let newPlaylist = new Playlist(id, '/assets/icons/default.svg', title, PlaylistsMock.currentUserMock, date, []);
    this.savePlaylist(newPlaylist);
    return newPlaylist;
  }


  public savePlaylist(playlist: Playlist) {
    // update caching
    let index = Playlist.indexById(this.playlists, playlist.id)
    if (index == -1) {
      this.playlists.push(playlist);
      this.playlistIdList.push(playlist.id);
      this.observablePlaylist.next({ action: "push", data: playlist });
    } else {
      this.playlists[index] = playlist;
      this.observablePlaylist.next({ action: "update", data: playlist });
    }

    // update localstorage
    this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
    this.storage.set(playlist.id, JSON.stringify(Playlist.toJson(playlist)));

    //console.log('service->savePlaylist:', playlist);
    //console.log('service->playlist up-to-date:', this.playlists);
  }

  public removePlaylist(playlistId: string) { //playlistId: string) {
    let index = Playlist.indexById(this.playlists, playlistId);
    if (index != -1) {
      // update caching
      this.playlists.splice(index, 1);
      this.playlistIdList.splice(index, 1);
      this.observablePlaylist.next({ action: "delete", data: index });

      // update localstorage
      this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
      this.storage.remove(playlistId);

      //console.log('service->removePlaylist:', playlistId);
      //console.log('service->playlist up-to-date:', this.playlists);
    }
  }

  public reorderPlaylistList(oldIndex: number, newIndex: number) {
    if (oldIndex != newIndex) {
      // update caching
      moveItemInArray(this.playlistIdList, oldIndex, newIndex);
      this.observablePlaylist.next({ action: "swap", data: { oldIndex, newIndex } });

      // update localstorage
      this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.playlistIdList));
    }
  }

  private flushLocalstorage() {
    this.storage.clear();
  }
}
