import { Injectable, Inject } from '@angular/core';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Playlist } from '../types/playlist';
import { BehaviorSubject } from 'rxjs';
import { PlaylistsMock } from '../classes/playlists.mock';
import { StorageService } from './storage.service';
import { Track } from '~types/track';
import { AccountsService } from './accounts.service';

interface PlaylistDataStore {
	playlistIds: string[];
	playlistsData: Playlist[];
}

@Injectable({
	providedIn: 'root'
})
export class PlaylistsService {
	private PLAYLISTS_KEY = 'playlists';
	private author = 'Unknown';
	private dataStore: PlaylistDataStore = { playlistIds: [], playlistsData: [] };
	private _playlists = new BehaviorSubject<Playlist[]>([]);
	readonly playlists = this._playlists.asObservable();

	constructor(private storage: StorageService, private accountsService: AccountsService) {
		this.accountsService.myAccounts().subscribe((accounts: any[]) => {
      if (accounts && accounts.length !== 0) {
        this.author = accounts[0].name;
      }
		});
	}

	flushData() {
		this.storage.clear();
	}

	loadAll() {
		// loads ID list
		this.dataStore.playlistIds = JSON.parse(JSON.parse((localStorage.getItem(this.PLAYLISTS_KEY)))) || [];

		// load data
		this.dataStore.playlistsData.splice(0, this.dataStore.playlistsData.length);
		const playlistIds = this.dataStore.playlistIds;
		for (let i = 0; i < playlistIds.length; i++) {
			const playlistJson = JSON.parse(JSON.parse(localStorage.getItem(playlistIds[i])));
			if (playlistJson) {
				this.dataStore.playlistsData.push(playlistJson);
				// push a new copy of our list to all Subscribers
				this._playlists.next(Object.assign({}, this.dataStore).playlistsData);
			} else {
				playlistIds[i] = null;
			}
		}

		// remove invalid indexes
		this.dataStore.playlistIds = playlistIds.filter((el) => el != null);
	}

	load(id: string) {
		const existantPlaylistIndex = this.dataStore.playlistsData.findIndex(p => {
			return p.id === id;
		});

		const playlist = JSON.parse(JSON.parse(localStorage.getItem(id)));
		if (playlist) {
			if (existantPlaylistIndex !== -1) {
				this.dataStore.playlistsData[existantPlaylistIndex] = playlist;
			} else {
				this.dataStore.playlistIds.push(playlist.id);
				this.dataStore.playlistsData.push(playlist);
			}
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);
		}
	}

	create(playlist: Playlist) {
		this.dataStore.playlistIds.push(playlist.id);
		this.dataStore.playlistsData.push(playlist);
		this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

		// update localstorage
		this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
		this.storage.set(playlist.id, JSON.stringify(playlist));
	}

	update(playlist: Playlist) {
		const playlistIndex = this.dataStore.playlistsData.findIndex(p => {
			return p.id === playlist.id;
		});
		if (playlistIndex !== -1) {
			this.dataStore.playlistsData[playlistIndex] = playlist;
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

			// update localstorage
			this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
			this.storage.set(playlist.id, JSON.stringify(playlist));
		} else {
			this.create(playlist);
		}
	}

	remove(id: string) {
		const playlistIndex = this.dataStore.playlistsData.findIndex(p => {
			return p.id === id;
		});
		if (playlistIndex !== -1) {
			this.dataStore.playlistIds.splice(playlistIndex, 1);
			this.dataStore.playlistsData.splice(playlistIndex, 1);
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

			// update localstorage
			this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
			this.storage.del(id);
		}
	}

	playlistGen(title: string= null): string {
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
			author: this.author,
			tracks: []
		};
		this.create(newPlaylist);
		return id;
	}

	swapPlaylists(oldIndex: number, newIndex: number) {
		if (oldIndex !== newIndex) {
			moveItemInArray(this.dataStore.playlistIds, oldIndex, newIndex);
			moveItemInArray(this.dataStore.playlistsData, oldIndex, newIndex);
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

			// update localstorage
			this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
		}
	}

	renamePlaylist(id: string, title: string) {
		if (title && title.length > 0) {
			const playlist = this.dataStore.playlistsData.find(p => {
				return p.id === id;
			});
			playlist.title = title;
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

			// update localstorage
			this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
			this.storage.set(id, JSON.stringify(playlist));
		}
	}

	getTrack(id: string, index: number): Track {
		const playlistIndex = this.dataStore.playlistsData.findIndex(p => {
			return p.id === id;
		});
		if (playlistIndex !== -1) {
			const tracks = this.dataStore.playlistsData[playlistIndex].tracks;
			const track = tracks[index];
			if (track) {
				return track;
			}
		}
		return null;
	}

	addTrack(id: string, track: Track) {
		const playlist = this.dataStore.playlistsData.find(p => {
			return p.id === id;
		});
		playlist.tracks.push(track);
		this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

		// update localstorage
		this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
		this.storage.set(id, JSON.stringify(playlist));
	}

	delTrack(id: string, index: number) {
		const playlistIndex = this.dataStore.playlistsData.findIndex(p => {
			return p.id === id;
		});
		if (playlistIndex !== -1) {
			const playlist = this.dataStore.playlistsData[playlistIndex];
			playlist.tracks.splice(index, 1);
			this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

			// update localstorage
			this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
			this.storage.set(id, JSON.stringify(playlist));
		}
	}

	swapTracks(id: string, oldIndex: number, newIndex: number) {
		const playlist = this.dataStore.playlistsData.find(p => {
			return p.id === id;
		});
		moveItemInArray(playlist.tracks, oldIndex, newIndex);
		this._playlists.next(Object.assign({}, this.dataStore).playlistsData);

		// update localstorage
		this.storage.set(this.PLAYLISTS_KEY, JSON.stringify(this.dataStore.playlistIds));
		this.storage.set(id, JSON.stringify(playlist));
	}
}
