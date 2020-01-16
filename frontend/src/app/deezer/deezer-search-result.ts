import { Url } from 'url';
import { DeezerTrack } from './deezer-track';
import { DeezerArtist } from './deezer-artist';
import { DeezerAlbum } from './deezer-album';

export interface DeezerSearchResult {
  data: Array<DeezerTrack | DeezerArtist | DeezerAlbum>;
  total: number;
  next: Url;
}
