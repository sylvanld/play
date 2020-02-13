import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { Playlist } from '../types/playlist';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Track } from '~types/track';

interface PlaylistDataStore {
  playlistIds: string[];
  playlistsData: Playlist[];
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private PLAYLISTS_BY_USER_KEY = 'playlists';
  // TODO: remove mock
  private currentUser = { id: 1, name: 'Jean Dupont' };

  // TODO: remove this
  private _playlists: { [key: string]: Playlist } = {};
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  readonly playlists = this.playlistsSubject.asObservable();

  constructor(private storage: StorageService) {
  }

  flushData() {
    this.storage.clear();
  }

  notifyPlaylistsChange() {
    /**
     * Sauvegarde des playlists dans le localStorage
     */
    // recupere les playlists de tous les utilisateurs
    const allUsersPlaylists = this.storage.get(this.PLAYLISTS_BY_USER_KEY) || {};
    // ecrase les playlists de l'utilisateur courant par la valeur en mémoire
    allUsersPlaylists[this.currentUser.id] = this._playlists;
    // sauvegarde tout ca dans le localstorage
    this.storage.set(this.PLAYLISTS_BY_USER_KEY, allUsersPlaylists);

    /**
     * Notifie les observeurs du changement.
     */
    this.playlistsSubject.next(
      Object.values(this._playlists)
    )
  }

  loadAll() {
    // recupere les playlists de tous les utilisateurs
    const allUsersPlaylists = this.storage.get(this.PLAYLISTS_BY_USER_KEY) || {};
    // recupere les playlists de l'utilisateur courant
    this._playlists = allUsersPlaylists[this.currentUser.id] || {};
    // averti les observeurs d'un changement des playlists
    this.notifyPlaylistsChange();
  }


  create(playlist: Playlist) {
    this._playlists[playlist.id] = playlist;
    this.notifyPlaylistsChange();
  }

  update(playlistId, updateData: { id?, title?, author?}) {
    // modifie un à un les champs de la playlist concernee
    Object.keys(updateData).map(
      key => {
        this._playlists[playlistId][key] = updateData[key];
      }
    )
    this.notifyPlaylistsChange();
  }

  removePlaylist(id: string) {
    delete this._playlists[id];
    this.notifyPlaylistsChange();
  }

  playlistGen(title: string = null): string {
    // TODO: Bonne idée, à personnaliser selon des préférences utilisateur
    const date = new Date();
    if (title == null) {
      const dateISO = date.toISOString();
      const formattedDate = moment(dateISO).format('DD/MM/YYYY HH:mm');
      title = 'New Playlist ' + formattedDate;
    }
    const id = 'playlist-' + uuid.v4();
    const newPlaylist: Playlist = {
      id,
      cover: '/assets/icons/default.svg',
      title,
      author: this.currentUser.name,
      tracks: []
    };
    this.create(newPlaylist);
    return id;
  }

  swapPlaylists(oldIndex: number, newIndex: number) {
    // TODO: remove or replace
  }

  /*
  About tracks
  */

  /**
   * Get nth track of a playlist
   */
  getTrackAt(playlistId: string, index: number): Track {
    const playlist = this._playlists[playlistId];
    const track = !!playlist && playlist.tracks[index];
    return track;
  }

  /**
   * Add a track to a playlist
   */
  addTrack(playlistId: string, track: Track) {
    this._playlists[playlistId].tracks.push(track);
    this.notifyPlaylistsChange();
  }

  /**
   * Remove a track by index in a playlist
   */
  delTrack(playlistId: string, index: number) {
    this._playlists[playlistId].tracks.splice(index, 1);
    this.notifyPlaylistsChange();
  }

  /**
   * Re-index a given track in a playlist
   */
  swapTracks(playlistId: string, oldIndex: number, newIndex: number) {
    // TODO: remove or replace
  }
}
