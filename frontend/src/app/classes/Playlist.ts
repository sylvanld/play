import { Song } from './Song';
import { ViewItem } from './ViewItem';

export class Playlist {
    public static fromJson(json: Object): Playlist {
        let songs:Song[] = []; 
        for (let s of json['songList']) {
            songs.push(Song.fromJson(s));
        }
        return new Playlist(
            json['id'],
            json['picture'],
            json['title'],
            json['author'],
            new Date(json['creation']),
            songs
        );
    }

    public static toJson(playlist: Playlist): any {
        let songList = [];
        for (let s of playlist.songList) {
            songList.push(Song.toJson(s));
        }
        return {
            id: playlist.id,
            picture: playlist.picture,
            title: playlist.title,
            author: playlist.author,
            creation: playlist.creation,
            songList: songList
        };
    }

    public static toViewFormat(playlist: Playlist): ViewItem {
        return new ViewItem(
            playlist.id, 
            playlist.picture, 
            playlist.title, 
            playlist.author
        );
    }

    public static indexById(playlists: Playlist[], playlistId: string) {
        for(let i=0; i<playlists.length; i++) {
            if(playlists[i].id === playlistId) {
                return i;
            }
        }
        return -1;
    }

    constructor(public id: string,
                public picture: string,
                public title: string,
                public author: string,
                public creation: Date,
                public songList: Song[]) {
    }
}