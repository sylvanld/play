import { DeezerTrack } from './deezer-track';
import { DeezerAlbum } from './deezer-album';
import { DeezerArtist } from './deezer-artist';

export interface DeezerGlobalSearchResult {
  tracks: Array<DeezerTrack>;
  albums: Array<DeezerAlbum>;
  artists: Array<DeezerArtist>;
}
