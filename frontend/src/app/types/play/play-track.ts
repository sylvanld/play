export interface Identifiers {
  spotify: string;
  youtube?: string;
  deezer?: string;
}

export interface Track {
  isrc: string;
  title: string;
  artist: string;
  album: string;
  release: string;
  external_ids: Identifiers;
}
