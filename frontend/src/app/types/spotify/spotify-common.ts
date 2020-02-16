import { SpotifyTrack } from './spotify-track';

export interface PagingObject {
  href: string;
  items: any[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface SpotifyTrackResult {
  added_at: string;
  added_by: {};
  is_local: boolean;
  primary_color: string;
  track: SpotifyTrack;
  video_thumbnail: {
    url: string;
  };
}
