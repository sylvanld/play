interface SpotifySimpleArtist {
    id: string;
    name: string;
}

interface SpotifyAlbumCover {
    height: number;
    url: string;
    width: number;
}

export interface SpotifyAlbum {
    id: string;
    artists: SpotifySimpleArtist[];
    available_markets: string[];
    images: SpotifyAlbumCover[];
    name: string;
    release_date: string;
    release_date_precision: 'day'; // to complete
}