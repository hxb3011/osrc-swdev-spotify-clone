import * as React from 'react';
import { getLikedPlaylists, getPlaylists } from '../../api/trackApi';
import HorizontalPlaylist from '../../components/Playlist/HorizontalPlaylist';
import HorizontalPlaylistSceleton from '../../components/Playlist/HorizontalPlaylistSceleton';
import VerticalPlaylist from '../../components/Playlist/VerticalPlaylist';
import VerticalPlaylistSceleton from '../../components/Playlist/VerticalPlaylistSceleton';
import { useAppSelector } from '../../store/reduxhooks';
import { PlaylistsType } from '../../types';

export interface HomeProps {

}

export default function Home(props: HomeProps) {
  const [likedPlaylists, setLikedPlaylists] = React.useState<PlaylistsType>();
  const [playlists, setPlaylists] = React.useState<PlaylistsType>([]);
  const authStatus = useAppSelector(state => state.auth.authStatus)

  // get liked playlists and get new playlists if user is logged in
  React.useEffect(() => {
    if (authStatus === 'notChecked') return;
    getLikedPlaylists().then(response => {
      setLikedPlaylists(response.data);
    })
    getPlaylists().then(response => {
      setPlaylists(response.data);
    })
  }, [authStatus]);

  return (
    <div style={{ display: "flex", flexFlow: "column nowrap", gap: "32px", padding: "16px" }}>
      <div>
        <div className='text-white font-bold' style={{ fontSize: "xx-large", marginBottom: "8px" }}>Danh sách phát yêu thích</div>
        <div className='grid grid-cols-2 lg:grid-cols-3' style={{ gap: "16px" }}> {
          likedPlaylists ? likedPlaylists.map(playlist => (
            <HorizontalPlaylist key={playlist.id} playlist={playlist} />
          )) : <>
            <HorizontalPlaylistSceleton />
            <HorizontalPlaylistSceleton />
            <HorizontalPlaylistSceleton />
          </>
        } </div>
      </div>
      <div>
      <div className='text-white font-bold' style={{ fontSize: "xx-large", marginBottom: "8px" }}>Danh sách phát mới</div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5' style={{ gap: "16px" }}>{
        playlists.length ? playlists.map(playlist => (
          <VerticalPlaylist key={playlist.id} playlist={playlist} />
        )) : <>
          <VerticalPlaylistSceleton />
          <VerticalPlaylistSceleton />
          <VerticalPlaylistSceleton />
          <VerticalPlaylistSceleton />
          <VerticalPlaylistSceleton />
          <VerticalPlaylistSceleton />
        </>
      }</div>
      </div> 
    </div>
  );
}
