import { Track } from './track';


export interface Playlist {
  id?: string;
  cover?: string;
  title?: string;
  author?: string;
  tracks: Track[];
}
