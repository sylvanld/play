import { Track, Album, Artist } from './play';

export interface SearchResult {
  tracks: Array<Track>;
  albums: Array<Album>;
  artists: Array<Artist>;
}
