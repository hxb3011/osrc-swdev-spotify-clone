import * as React from "react";
import { PlaylistDetail, TracksType } from "../../types";
import { getLikedTracks } from "../../api/trackApi";
import { useAppDispatch } from "../../store/reduxhooks";
import likeImage from "../../assets/images/like.webp";
import Playlist from "../../containers/Playlist/Playlist";
import {
  getArtistName,
  getTracksDuration,
} from "../../shared/utils/playlist-utils";
import { setPlaylistAction } from "../../store/slices/playlistSlice";
import PlaylistCreateModal from "../../components/Playlist/PlaylistCreateModal";

export interface LikedTracksPageProps { }

export default function LikedTracksPage(props: LikedTracksPageProps) {
  const [likedTracksPlaylist, setLikedTracksPlaylist] = React.useState<PlaylistDetail>();
  const [open, setOpen] = React.useState(false);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    getLikedTracks().then((response) => {
      const tracks: TracksType = response.data;
      const playlist: PlaylistDetail = {
        id: 0,
        title: "Bản nhạc yêu thích",
        image: likeImage,
        color: "purple",
        featured: false,
        hide: false,
        tracks: tracks,
        liked: false,
      };
      setLikedTracksPlaylist(playlist);
    });
  }, []);

  // get artists and durations as readable string
  const [artists, durations] = React.useMemo(() => {
    if (!likedTracksPlaylist) return ["", ""];
    const tracks = likedTracksPlaylist.tracks;
    return [getArtistName(tracks), getTracksDuration(tracks)];
  }, [likedTracksPlaylist]);

  // play playlist
  const playPlaylistHandler = React.useCallback(() => {
    dispatch(setPlaylistAction({ playlist: likedTracksPlaylist! }));
  }, [dispatch, likedTracksPlaylist]);
  const createPlaylistHandler = React.useCallback(() => {
    setOpen(true)
  }, [open]);

  return (<>
    <PlaylistCreateModal open={open} onClose={() => setOpen(false)} />
    {likedTracksPlaylist && <Playlist
      image={likedTracksPlaylist.image}
      playlistType="Playlist"
      title={likedTracksPlaylist.title}
      artists={artists}
      durations={durations}
      playPlaylist={playPlaylistHandler}
      toggleLikePlaylist={createPlaylistHandler}
      hasLikeButton={false}
      isLikedPlaylist={true}
      tracks={likedTracksPlaylist.tracks}
      playlist={likedTracksPlaylist}
    />}
  </>);
}
