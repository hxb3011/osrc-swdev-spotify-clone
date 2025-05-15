import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArtistSummary, Track } from "../../types";

// player for playing track is managed from here

interface State {
   trackId: number;
   trackImage: string;
   trackTitle: string;
   trackArtists: ArtistSummary[];
   videoSrc: string;
   audioSrc: string;
   audioDuration: number;
   audioCurrentTime: number;
   audioVolume: number;
   audioIsPlaying: boolean;
   shouldPlay: boolean,
   trackLiked: boolean;
}

const initialState: State = {
   trackId: 0,
   trackImage: "",
   trackTitle: "",
   trackArtists: [],
   audioSrc: "",
   videoSrc: "",
   audioDuration: 0,
   audioCurrentTime: 0,
   audioVolume: 1,
   audioIsPlaying: false,
   shouldPlay: false,
   trackLiked: false,
};

export const playerSlice = createSlice({
   name: "player",
   initialState,
   reducers: {
      setNewAudio: (state, action: PayloadAction<{ track: Track; play: boolean; }>) => {
         state.audioSrc = action.payload.track.audio;
         state.videoSrc = action.payload.track.video;
         state.trackImage = action.payload.track.image;
         state.trackTitle = action.payload.track.title;
         state.trackArtists = action.payload.track.artists;
         state.trackLiked = action.payload.track.liked;
         state.trackId = action.payload.track.id;
         state.shouldPlay = action.payload.play;
      },

      setAudioIsPlaying: (state, action: PayloadAction<boolean>) => {
         state.audioIsPlaying = action.payload;
      },
      toggleAudioIsPlaying: (state, action) => {
         return {...state, audioIsPlaying: !state.audioIsPlaying}
      },
      // set audio volume
      setVolume(state, action: PayloadAction<number>) {
         state.audioVolume = action.payload;
      },
      setPlayerTrackLikedStatus(state, action) {
         state.trackLiked = action.payload;
      },
   },
});

export const {
   setNewAudio,
   toggleAudioIsPlaying,
   setAudioIsPlaying,
   setVolume,
   setPlayerTrackLikedStatus,
} = playerSlice.actions;
