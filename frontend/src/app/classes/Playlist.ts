import { Song } from './Song';
import { PlaylistTypeEnum } from './PlaylistType';

export class Playlist {
    public static fromJson(json: Object): Playlist {
        let songs:Array<Song> = []; 
        for (let s of json['songList']) {
            songs.push(Song.fromJson(s))
        }
        return new Playlist(
            json['id'],
            json['origin'],
            json['picture'],
            json['title'],
            json['author'],
            new Date(json['creation']),
            songs
        );
    }

    constructor(public id: string,
                public origin: PlaylistTypeEnum,
                public picture: string,
                public title: string,
                public author: string,
                public creation: Date,
                public songList: Array<Song>) {
    }
}