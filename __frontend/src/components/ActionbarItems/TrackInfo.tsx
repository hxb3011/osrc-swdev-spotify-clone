import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/reduxhooks';
import { toggleLikeTrackAction } from '../../store/slices/playlistSlice';
import LikeButton from '../UI/LikeButton';
import { Link } from 'react-router-dom';
import profilePhoto from '../../assets/images/profile-photo.webp'
import IconButton from '@mui/material/IconButton';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import TrackDownloadModal from './TrackDownloadModal';

export interface TrackInfoProps {
}

export default function TrackInfo(props: TrackInfoProps) {
  const [open, setOpen] = React.useState(false)
  const playerState = useAppSelector((state) => state.player);

  const dispatch = useAppDispatch();
  const likeTrackHandler = React.useCallback(() => {
    dispatch(toggleLikeTrackAction(playerState.trackId))
  }, [dispatch, playerState.trackId])
  const downloadHandler = React.useCallback(() => {
    setOpen(true)
  }, [open, playerState.trackId])

  return (<>
    <TrackDownloadModal id={playerState.trackId} title={playerState.trackTitle} audioLink={playerState.audioSrc}
      videoLink={playerState.videoSrc} open={open} onClose={() => setOpen(false)} />
    <div className='flex gap-2 items-center text-white'>
      <div>
        <img className='h-16 w-16' src={playerState.trackImage || profilePhoto} alt="" />
      </div>
      <div className='flex flex-col justify-center'>
        <div>{playerState.trackTitle || "Track title"}</div>
        <div>
          {playerState.trackArtists && playerState.trackArtists.length > 0 && playerState.trackArtists.map((artist, index) => (
            <Link to={`/artists/${artist.id}`} key={artist.id}>
              <span className='text-sm hover:underline'>{artist.first_name} {artist.last_name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className='flex items-center'>
        <LikeButton styles={{ color: 'white' }} liked={playerState.trackLiked} onClick={likeTrackHandler} />
        <IconButton aria-label="Tải xuống" size="large" onClick={downloadHandler}>
          <ArrowCircleDownIcon fontSize="inherit" style={{ color: 'white' }} />
        </IconButton>
      </div>
    </div>
  </>);
}
