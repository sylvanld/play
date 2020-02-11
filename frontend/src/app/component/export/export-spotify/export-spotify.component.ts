import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '../../../service/playlists.service';
import { Observable } from 'rxjs';
import { Track } from 'src/app/types/track';
import { map } from 'rxjs/operators';
import { ViewItem } from 'src/app/types/view-item';
import { Playlist } from 'src/app/types/playlist';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-export-spotify',
    templateUrl: './export-spotify.component.html',
    styleUrls: ['./export-spotify.component.scss'],
})
export class ExportSpotifyComponent implements OnInit {
    playlistId: string = null;
    titleEdition: string;
    playlist: Observable<Playlist>;
    songsF: ViewItem[] = [];
    selection = new SelectionModel<Track>(true, []);

    constructor(private playlistService: PlaylistsService) { }

    ngOnInit() {


    }

    export(params) {
        this.playlistId = params.id;

        this.playlist = this.playlistService.playlists.pipe(
            map(pList => pList.find(p => p.id === this.playlistId))
        );

        // load playlist data
        this.playlist.subscribe(
            p => {
                this.songsF.splice(0, this.songsF.length);
                if (p != null) {
                    this.titleEdition = p.title;
                    for (let t = 0; t < p.tracks.length; t++) {
                        const vItem: ViewItem = {
                            id: t + '',
                            picture: null,
                            mainContent: p.tracks[t].title,
                            secondaryContent: p.tracks[t].artist + ' - ' + p.tracks[t].album
                        };
                        this.songsF.push(vItem);
                    }
                }
            }
        );

        console.log(this.songsF);
    }

    // addSong() {
    //     const mockSongId = this.songsF.length + '';
    //     const mockSong: Track = {
    //         isrc: '',
    //         title: `title${mockSongId}`,
    //         artist: `artist${mockSongId}`,
    //         album: 'album-id',
    //         release: '2020',
    //         external_ids: { spotify: 'spotify-id' }
    //     };
    //     this.playlistService.addTrack(this.playlistId, mockSong);
    // }

    // moveSong(event) {
    //     this.playlistService.swapTracks(this.playlistId, event.oldIndex, event.newIndex);
    // }

    // delSong(id: string) {
    //     this.playlistService.delTrack(this.playlistId, +id);
    // }

    // onSelected(row) {
    //     this.selection.toggle(row);
    // }

    // selectionToPlaylist() {
    //     const tracks: Track[] = this.selection.selected;
    //     for (const t of tracks) {
    //         this.playlistService.addTrack(this.playlistId, t);
    //     }
    // }
}
