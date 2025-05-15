export interface AuthorSummary {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  image: string;
}

export interface ArtistSummary {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Playlist {
  id: number;
  author: AuthorSummary;
  title: string;
  image: string;
  color: string;
  featured: boolean;
  updated: string;
  created: string;
  hide: boolean;
}

export type PlaylistsType = Playlist[];

export interface Track {
  id: number;
  artists: ArtistSummary[];
  genres: string[];
  title: string;
  image: string;
  audio: string;
  video: string;
  duration: number;
  listen_count: number;
  liked: boolean;
  updated: string;
  created: string;
}

export type TracksType = Track[];

export interface PlaylistDetail {
  id: number;
  author?: AuthorSummary;
  title: string;
  image?: string;
  color?: string;
  featured?: boolean;
  updated?: string;
  created?: string;
  hide?: boolean;
  tracks: TracksType;
  liked?: boolean;
}

export interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  verified: boolean;
}

export type ArtistsType = Artist[];

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string;
  birth_date: string;
  gender: string;
  liked_tracks: TracksType;
  followed_artists: ArtistsType;
  playlists: PlaylistsType;
  user_id: number;
}

export interface AuthInfo {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  birth_date: string;
  gender: string;
  token: string;
  remember_me?: boolean;
}

export interface GenreSummary {
  id: number;
  title: string;
  color: string;
}

export type GenreSummriesType = GenreSummary[];

export interface GenreDetail {
  id: number;
  title: string;
  color: string;
  tracks: TracksType;
  created: string;
  updated: string;
}

export interface ArtistDetail {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  cover: string;
  verified: boolean;
  tracks: TracksType;
  is_following: boolean;
}
