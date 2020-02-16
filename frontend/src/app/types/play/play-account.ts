export interface Account {
  id: number;
  name: string;
  lang: 'FR' | 'EN';
  email: string;
  provider: 'SPOTIFY' | 'DEEZER';
}
