import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Playlist } from 'src/app/classes/Playlist';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { PlaylistTypeEnum } from 'src/app/classes/PlaylistType';
import { PlaylistsMock } from './playlists.mock';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private STORAGE_KEY = 'local_playlists';
  private caching:Playlist[];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {  }

  private loadData(): Observable<Playlist[]> {
    this.caching = [];
    //for (let i of this.storage.get(this.STORAGE_KEY) || []) {
    for (let i of PlaylistsMock.playlists) {
      this.caching.push(
        Playlist.fromJson(i)
      )
    }
    return of(this.caching);
  }

  
  public getMyPlaylists(): Observable<Playlist[]> {
    return this.loadData();
    /*return this.http.get('http://localhost:3000/playlists/').pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Playlist.fromJson(jsonItem))
      )
    );*/
  }

  public getPlaylist(id: string): Playlist {
    return this.caching[id];
  }

  public createPlaylist(type: PlaylistTypeEnum): string {
    let date = new Date();
    let dateISO = date.toISOString();
    let formattedDate = moment(dateISO).format('DD/MM/YYYY HH:mm');
    let title = "New Playlist "+formattedDate;
    let id = 'playlist-' + uuid.v4();
    let newPlaylist = new Playlist(id, type, null, title, PlaylistsMock.currentUserMock, date, []);
    this.caching.push(newPlaylist);
    //this.storage.set(this.STORAGE_KEY, this.caching); //maybe need toJson
    return id;
  }


  savePlaylist(playlists: Playlist) {
    //TODO ...
  }

  removePlaylist(playlistId: string) {
    //TODO ...
  }
}
