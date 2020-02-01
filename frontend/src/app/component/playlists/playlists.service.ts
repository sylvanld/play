import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Playlist } from './Playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private STORAGE_KEY = 'local_playlists';
  private caching:Playlist[];

  mock = [
    {
      picture: '/assets/icons/play.svg',
      title: 'title',
      author: 'author'
    }, 
    {
      picture: '/assets/icons/play.svg',
      title: 'title2',
      author: 'author2'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title3',
      author: 'author3'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title4',
      author: 'author4'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title4',
      author: 'author4'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title5',
      author: 'author5'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title6',
      author: 'author6'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title7',
      author: 'author7'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title8',
      author: 'author8'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title9',
      author: 'author9'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title10',
      author: 'author10'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title11',
      author: 'author11'
    },
    {
      picture: '/assets/icons/play.svg',
      title: 'title12',
      author: 'author12'
    }
  ];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {  }

  private loadData(): Observable<Playlist[]> {
    this.caching = [];
    for (let i of this.storage.get(this.STORAGE_KEY) || []) {
    //for (let i of this.mock) {
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

  public addPlaylist(playlist:Playlist) {
    this.caching.push(playlist);
    this.storage.set(this.STORAGE_KEY, this.caching); //maybe need toJson
  }



  /*delPlaylist(object) {
    this.playlists.filter(obj => {
      let match = true;
      for (let [key, value] of Object.entries(object)) {
        if (obj[key] != value) match = false
      }
      return !match;
    });
  }

  addPlaylist(object) {
    this.playlists.push(object);
  }

  clear() {
    this.playlists.splice(0, this.playlists.length)
  }*/
}
