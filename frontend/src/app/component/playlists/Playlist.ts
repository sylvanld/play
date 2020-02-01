export class Playlist {
    public static fromJson(json: Object): Playlist {
        return new Playlist(
            json['picture'],
            json['title'],
            json['author'],
            new Date(json['creation'])
        );
    }

    constructor(public picture: string,
                public title: string,
                public author: string,
                public creation: Date) {
    }
}