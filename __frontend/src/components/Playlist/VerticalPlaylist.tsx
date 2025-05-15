import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlaylistDetail } from '../../api/trackApi';
import { useAppDispatch } from '../../store/reduxhooks';
import { setPlaylistAction } from '../../store/slices/playlistSlice';
import { Playlist } from '../../types';
import PlayButton from '../UI/PlayButton';

export interface VerticalPlaylistProps {
  playlist: Playlist;
  playlistRoute?: string;
  playHandler?(e: React.MouseEvent): void;
}

export default function VerticalPlaylist(props: VerticalPlaylistProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // play playlist when play button is clicked and stop propagation to prevent navigate to playlist page
  const clickHandler = props.playHandler || React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    getPlaylistDetail(props.playlist.id).then(res => {
      dispatch(setPlaylistAction({ playlist: res.data }))
    })
  }, [dispatch, props.playlist.id])

  // navigate to clicked playlist page
  const playlistClickHandler = React.useCallback((e: React.MouseEvent) => {
    navigate(props.playlistRoute || `/playlists/${props.playlist.id}/`)
  }, [navigate, props.playlist.id])

  return (
    <div onClick={playlistClickHandler} className='rounded-lg p-4 bg-neutral-600/70 hover:bg-neutral-600/50 duration-300 flex flex-col gap-y-2 text-white cursor-pointer'>
      <div className='relative'>
        <img className='w-full h-56 rounded-lg object-cover' src={props.playlist.image} alt="" />
        <PlayButton className='absolute bottom-2 right-1' onClick={clickHandler} />
      </div>
      <div style={{ padding: "8px 16px 16px" }}>
        <div className='font-bold' style={{ fontSize: "larger" }}>{props.playlist.title}</div>
        <div>{props.playlist.author.last_name} {props.playlist.author.first_name}</div>
      </div>
    </div>
  );
}
