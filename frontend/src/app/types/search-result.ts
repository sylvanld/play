import { Track } from './track';
import { Album } from './album';
import { Artist } from './artist';

export interface SearchResult {
  tracks: Array<Track>;
  albums: Array<Album>;
  artists: Array<Artist>;
}
