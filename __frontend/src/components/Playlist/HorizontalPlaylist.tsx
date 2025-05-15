import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlaylistDetail } from '../../api/trackApi';
import { useAppDispatch } from '../../store/reduxhooks';
import { setPlaylistAction } from '../../store/slices/playlistSlice';
import { Playlist } from '../../types';
import PlayButton from '../UI/PlayButton';

export interface HorizontalPlaylistProps {
  playlist: Playlist;
}

export default function HorizontalPlaylist(props: HorizontalPlaylistProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  // play playlist when play button is clicked and stop propagation to prevent navigate to playlist page
  const clickHandler = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    getPlaylistDetail(props.playlist.id).then(res => {
      dispatch(setPlaylistAction({ playlist: res.data }))
    })
  }, [dispatch, props.playlist.id])

  // navigate to clicked playlist page
  const playlistClickHandler = React.useCallback(() => {
    navigate(`/playlists/${props.playlist.id}/`)
  }, [navigate, props.playlist.id])

  return (
    <div onClick={playlistClickHandler} className='h-24 flex bg-emerald-200/30 hover:bg-emerald-400/40 duration-500 cursor-pointer rounded-lg' style={{
      height: "96px",
      gap: "20px"
    }}>
      <div className='h-full'>
        <img width={96} className='h-full rounded-l-lg object-cover' src={props.playlist.image} alt="" />
      </div>
      <div className='grow h-full flex flex-wrap content-center text-white font-bold text-xl'>
        <div>{props.playlist.title}</div>
      </div>
      <div className='flex flex-wrap content-center'>
        <PlayButton onClick={clickHandler} />
      </div>
    </div>
  );
}
