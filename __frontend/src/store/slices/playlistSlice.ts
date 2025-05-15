import {
   createAsyncThunk,
   createSlice,
   PayloadAction,
} from "@reduxjs/toolkit";
import { getPlaylistDetail, likeTrack, unlikeTrack } from "../../api/trackApi";
import { PlaylistDetail, Track } from "../../types";
import { RootState } from "../store";
import { setAudioIsPlaying, setNewAudio, setPlayerTrackLikedStatus } from "./playerSlice";

// The currently playing playlist maganing from here

interface InitialState {
   currentTrackId: number;
   currentTrackIndex: number;
   playlist: PlaylistDetail;
}

const initialState: InitialState = {
   currentTrackId: -1,
   currentTrackIndex: -1,
   playlist: {
      id: 0,
      author: {
         id: 0,
         first_name: "",
         last_name: "",
         username: "",
         image: "",
      },
      title: "",
      image: "",
      color: "",
      featured: false,
      updated: "",
      created: "",
      hide: false,
      tracks: [],
      liked: false,
   },
};

export const playlistSlice = createSlice({
   name: "playlist",
   initialState,
   reducers: {
      setPlaylist(state, action: PayloadAction<PlaylistDetail>) {
         state.playlist = action.payload;
         state.currentTrackId = action.payload.tracks[0].id;
         state.currentTrackIndex = 0;
      },
      setSelectBefore(state, action) {
         const playlistTracks = state.playlist.tracks
         const currentTrackIndex = state.currentTrackIndex - 1;
         if (currentTrackIndex >= 0) {
            state.currentTrackIndex = currentTrackIndex;
            state.currentTrackId = playlistTracks[state.currentTrackIndex].id;
         }
      },
      setSelectNext(state, action) {
         const playlistTracks = state.playlist.tracks
         const currentTrackIndex = state.currentTrackIndex + 1;
         if (currentTrackIndex < playlistTracks.length) {
            state.currentTrackIndex = currentTrackIndex;
            state.currentTrackId = playlistTracks[state.currentTrackIndex].id;
         }
      },
      setSelectTrack(state, action: PayloadAction<Track>) {
         const track = action.payload;
         const index = state.playlist.tracks.findIndex(
            (s) => s.id === track.id
         );
         state.currentTrackIndex = index;
         state.currentTrackId = track.id;
      },
      setPlaylistLiked(state, action: PayloadAction<boolean>) {
         state.playlist.liked = action.payload;
      },
      setPlaylistTrackLike(
         state,
         action: PayloadAction<{ id: number; liked: boolean }>
      ) {
         const track = state.playlist.tracks.find(
            (track) => track.id === action.payload.id
         );
         if (track) {
            track.liked = action.payload.liked;
         }
      },
   },
});

export const {
   setPlaylist,
   setSelectBefore,
   setSelectNext,
   setPlaylistTrackLike,
   setSelectTrack,
   setPlaylistLiked,
} = playlistSlice.actions;

export default playlistSlice.reducer;

// Set playlist state to local storage
interface lastPlayingInfoType {
   lastTrackId: number;
   lastTrackIndex: number;
   lastPlaylistId: number;
}
const setStateToLocalStorage = async (state: RootState) => {
   const playlistState = state.playlist;
   const lastTrackId = playlistState.currentTrackId;
   const lastTrackIndex = playlistState.currentTrackIndex;
   const lastPlaylistId = playlistState.playlist.id;
   const lastPlayingInfo: lastPlayingInfoType = {
      lastTrackId, lastTrackIndex, lastPlaylistId
   }
   localStorage.setItem("lastPlayingInfo", JSON.stringify(lastPlayingInfo));
};

// Set playlist and play first track
export const setPlaylistAction = createAsyncThunk<void, { playlist: PlaylistDetail, setFirstTrack?: boolean }>(
   "setPlaylistAction",
   async ({ playlist, setFirstTrack = true }, { dispatch, getState }) => {
      dispatch(setPlaylist(playlist));
      const track = playlist.tracks[0];
      if (setFirstTrack) {
         dispatch(setNewAudio({ track: track, play: true }));
      }
      const state = getState() as RootState;
      setStateToLocalStorage(state);
   }
);

// Select track from playlist come before current track
export const selectBeforeTrack = createAsyncThunk(
   "selectBeforeTrack",
   async (payload, { getState, dispatch }) => {
      const state = getState() as RootState;
      const playerState = state.playlist;
      const currentIndex = playerState.currentTrackIndex;
      if (currentIndex === 0) return;
      const track = playerState.playlist.tracks[currentIndex - 1];
      dispatch(setNewAudio({ track: track, play: true }));
      dispatch(setSelectBefore(null));

      setStateToLocalStorage(state);
   }
);

// Select track from playlist come after current track
export const selectNextTrack = createAsyncThunk(
   "selectNextTrack",
   async (payload, { getState, dispatch }) => {
      const state = getState() as RootState;
      const playerState = state.playlist;
      const currentIndex = playerState.currentTrackIndex;
      if (currentIndex !== playerState.playlist.tracks.length - 1) {
         const track = playerState.playlist.tracks[currentIndex + 1];
         dispatch(setNewAudio({ track: track, play: track !== undefined }));
         dispatch(setSelectNext(null));
         dispatch(setAudioIsPlaying(track !== undefined));
      } else {
         const track = playerState.playlist.tracks[0];
         dispatch(setNewAudio({ track: track, play: false }));
         dispatch(setSelectTrack(track));
         dispatch(setAudioIsPlaying(false));
      }

      setStateToLocalStorage(state);
   }
);

// Select track from current or other playlist
export const changePlaylistAndTrackAction = createAsyncThunk<void, { playlist: PlaylistDetail, track: Track }>(
   "changeTrackAction",
   async ({ playlist, track }, { dispatch, getState }) => {
      dispatch(setPlaylist(playlist));
      dispatch(setNewAudio({ track: track, play: true }));
      dispatch(setSelectTrack(track));

      const state = getState() as RootState;
      setStateToLocalStorage(state);
   }
)

// Select last played playlist and track from local storage
export const loadStoredPlaylist = createAsyncThunk(
   "loadStoredPlaylist",
   async (payload, { dispatch, getState }) => {
      const lastPlayingInfoJSON = localStorage.getItem("lastPlayingInfo");
      // don't load if there is no last playing info
      if (!lastPlayingInfoJSON) return;
      const lastPlayingInfo = JSON.parse(lastPlayingInfoJSON) as lastPlayingInfoType;
      // don't load if the last playlist is dummy. The id of dummy playlists is 0
      if (lastPlayingInfo.lastPlaylistId === 0) return;
      const response = await getPlaylistDetail(lastPlayingInfo.lastPlaylistId);
      const playlist = response.data;
      if (lastPlayingInfo && playlist) {
         dispatch(setPlaylist(playlist));
         const storagedTrack = playlist.tracks[lastPlayingInfo.lastTrackIndex]
         dispatch(setSelectTrack(storagedTrack));
         dispatch(setNewAudio({ track: storagedTrack, play: false }));
      }
   }
);

// Like or unlike track
export const toggleLikeTrackAction = createAsyncThunk(
   "likeTrackAction",
   async (trackId: number, { dispatch, getState }) => {

      const state = getState() as RootState;
      const playlistState = state.playlist;
      const track = playlistState.playlist.tracks.find(
         (track) => track.id === trackId
      );
      if (!track) return;
      if (track.liked) {
         unlikeTrack(trackId).then((response) => {
            dispatch(setPlaylistTrackLike({ id: trackId, liked: false }));
            dispatch(setPlayerTrackLikedStatus(false))
         });
      } else {
         likeTrack(trackId).then((response) => {
            dispatch(setPlaylistTrackLike({ id: trackId, liked: true }));
            dispatch(setPlayerTrackLikedStatus(true))
         });
      }
   }
);
