import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface DeezerTrack {
  id: string;
  title: string;

  album: {
    id: string,
    title: string;
  };

  artist: {
    id: string;
    name: string;
  };
}
