import { DeezerTrack } from './deezer-track';

export interface DeezerPlaylist {
  id: string;
  title: string;

  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;

  creator: {
    id: string;
    name: string;
  };
}
