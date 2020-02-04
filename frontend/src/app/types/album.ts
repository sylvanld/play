import { Track } from './track';

export interface Album {

  id: string;
  name: string;
  tracks: Track[];
  date: Date;
}
