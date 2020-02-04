import { Album } from './album';
import { Artist } from './artist';


export interface Identifier {
  spotify: string;
  youtube?: string;
  deezer?: string;
}


export interface Track {
  irsc: string;
  title: string;
  artist: Artist['id'];
  album: Album['id'];
  external_ids: Identifier;
}
