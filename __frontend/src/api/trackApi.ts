import {
  GenreSummriesType,
  ArtistDetail,
  GenreDetail,
  PlaylistDetail,
  PlaylistsType,
  TracksType,
} from "../types";
import iaxios from "./iaxios";

export const getLikedPlaylists = () => {
  return iaxios.get<PlaylistsType>("/liked-playlists/");
};

export const getPlaylists = () => {
  return iaxios.get<PlaylistsType>("/playlists/");
};

export const getPlaylistDetail = (id: number) => {
  return iaxios.get<PlaylistDetail>(`/playlists/${id}/`);
};

export const likeTrack = (id: number) => {
  return iaxios.post(`/like-track/${id}/`);
};

export const unlikeTrack = (id: number) => {
  return iaxios.post(`/unlike-track/${id}/`);
};

export const likePlaylist = (id: number) => {
  return iaxios.post(`/like-playlist/${id}/`);
};

export const unlikePlaylist = (id: number) => {
  return iaxios.post(`/unlike-playlist/${id}/`);
};

export const getLikedTracks = () => {
  return iaxios.get<TracksType>("/liked-tracks/");
};

export const getGenreList = () => {
  return iaxios.get<GenreSummriesType>("/genres/");
};

export const getGenreDetail = (id: string) => {
  return iaxios.get<GenreDetail>(`/genres/${id}/`);
};

export const searchTracks = (query: string) => {
  return iaxios.get<TracksType>(`/tracks/?search=${query}`);
};

export const searchPlaylists = (query: string) => {
  return iaxios.get<PlaylistsType>(`/playlists/?search=${query}`);
};

export const getArtistDetail = (id: string) => {
  return iaxios.get<ArtistDetail>(`/artists/${id}/`);
};

export function createPlaylistFromSaved(title: string, file: File) {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('image', file)
  return iaxios.post('/playlist-from-saved/', formData)
}

export const deletePlaylist = (id: number) => {
  return iaxios.delete(`/playlist-to-del/${id}/`);
};
