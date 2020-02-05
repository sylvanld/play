import { Track } from './track';


export interface Playlist {
  id: string;
  title: string;
  author: string;
  tracks: Track[];
}
