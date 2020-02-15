
/**
 * Simplified object.
 * @link https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-full
 */
export interface SpotifyTrack {
  artists: { name: string; }[];
  album: {
    name: string;
    release_date: string;
  };
  external_ids: { irsc: string; };
  id: string;
  name: string;
}
