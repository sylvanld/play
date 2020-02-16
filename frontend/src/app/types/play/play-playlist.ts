import { Track } from './play-track';

export interface Playlist {
  id?: string;
  cover?: string;
  title?: string;
  author?: string;
  tracks: Track[];
}
