export class Song {
    public static fromJson(json: Object): Song {
        return new Song(
            json['cover'],
            json['title'],
            json['artists'],
            new Date(json['release'])
        );
    }

    constructor(public cover: string,
                public title: string,
                public artists: Array<String>,
                public release: Date) {
    }
}