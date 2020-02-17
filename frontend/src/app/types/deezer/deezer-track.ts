import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface DeezerTrack {
  id: string;
  title: string;

  isrc?: string;
  release_date?: string;

  album: {
    id: string,
    title: string;
  };

  artist: {
    id: string;
    name: string;
  };
}
