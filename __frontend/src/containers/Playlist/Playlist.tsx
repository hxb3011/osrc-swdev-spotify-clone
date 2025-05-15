import * as React from "react";
import PlayButton from "../../components/UI/PlayButton";
import LikeButton from "../../components/UI/LikeButton";
import { PlaylistDetail, Track, TracksType } from "../../types";

import { useAppDispatch } from "../../store/reduxhooks";
import { changePlaylistAndTrackAction } from "../../store/slices/playlistSlice";
import TrackList from "../../components/Track/TrackList";
import { IconButton } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

export interface PlaylistProps {
  image?: string;
  playlistType: "Playlist" | "Artist";
  title: string;
  artists?: string;
  durations: string;
  playPlaylist: (e?: React.MouseEvent) => void;
  toggleLikePlaylist?: (e?: React.MouseEvent) => void;
  hasLikeButton: boolean;
  isLikedPlaylist?: boolean;
  tracks: TracksType;
  playlist: PlaylistDetail;
}

export default function Playlist(props: PlaylistProps) {
  const dispatch = useAppDispatch();

  const playTrackHandler = React.useCallback(
    (track: Track) => {
      dispatch(
        changePlaylistAndTrackAction({ track: track, playlist: props.playlist }),
      );
    },
    [dispatch, props.playlist],
  );

  return (
    <div style={{ padding: "16px" }}>
      <div className="flex gap-5">
        <div>
          <img
            className="h-full w-60 object-cover shadow-2xl shadow-slate-400/80"
            src={props.image}
            alt={props.title}
          />
        </div>
        <div className="flex flex-col text-white justify-end">
          <div className="font-bold" style={{ paddingBottom: "8px" }}>
            {(props.playlistType === "Playlist" ? "Danh sách phát" : props.playlistType === "Artist" ? "Nghệ sĩ" : "").toUpperCase()}
          </div>
          <div className="text-8xl font-bold" style={{ paddingBottom: "48px" }}>{props.title}</div>
          {props.artists && <div>{props.artists}</div>}
          <div style={{ paddingBottom: "8px" }}>{props.durations}</div>
        </div>
      </div>
      <div style={{ marginTop: "48px" }}>
        <div className="flex align-baseline" style={{ gap: "16px" }}>
          <PlayButton onClick={props.playPlaylist} />
          {props.isLikedPlaylist ? (
            <IconButton aria-label="Tạo danh sách phát" size="large" onClick={props.toggleLikePlaylist}>
              <PlaylistAddIcon fontSize="inherit" styles={{ fontSize: 50, color: "white" }} />
            </IconButton>
          ) : props.hasLikeButton ? (
            <LikeButton
              styles={{ fontSize: 50, color: "white" }}
              onClick={props.toggleLikePlaylist}
              liked={props.playlist.liked}
            />
          ) : (
            <IconButton aria-label="Xoá danh sách phát" size="large" onClick={props.toggleLikePlaylist}>
              <PlaylistRemoveIcon fontSize="inherit" styles={{ fontSize: 50, color: "white" }} />
            </IconButton>
          )}
        </div>
        <div>
          <TrackList tracks={props.tracks} onChangeTrack={playTrackHandler} />
        </div>
      </div>
    </div>
  );
}
