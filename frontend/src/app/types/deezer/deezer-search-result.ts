import { Url } from 'url';
import { DeezerTrack } from './deezer-track';
import { DeezerArtist } from './deezer-artist';
import { DeezerAlbum } from './deezer-album';
import { DeezerPlaylist } from './deezer-playlist';

export interface DeezerSearchResult {
  data: Array<DeezerTrack | DeezerPlaylist | DeezerArtist | DeezerAlbum>;
  total: number;
  next: Url;
}
