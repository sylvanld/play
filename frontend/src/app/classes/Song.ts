import { ViewItem } from './ViewItem';

export class Song {
    public static fromJson(json: any): Song {
        return new Song(
            json.id,
            json.cover,
            json.title,
            json.artists,
            new Date(json.release)
        );
    }

    public static toJson(song: Song): any {
        return {
            id: song.id,
            cover: song.cover,
            title: song.title,
            artists: song.artists,
            release: song.release
        };
    }

    public static toViewFormat(song: Song): ViewItem {
        return new ViewItem(
            song.id,
            song.cover,
            song.title,
            song.artists.join(', ')
        );
    }

    constructor(public id: string,
                public cover: string,
                public title: string,
                public artists: string[],
                public release: Date) {
    }
}