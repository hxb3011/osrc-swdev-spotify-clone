import * as React from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import { useAppDispatch, useAppSelector } from '../../store/reduxhooks';
import { setAudioIsPlaying, setVolume } from '../../store/slices/playerSlice';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { IconButton } from '@mui/material';

export interface VolumeControlProps {
}

export default function VolumeControl(props: VolumeControlProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerState = useAppSelector(state => state.player);
  const dispatch = useAppDispatch();

  const fullscreenMVHandler = React.useCallback(() => {
    // check if audio is exist and if audioSrc is exist
    const video = videoRef.current;
    if (!video || !playerState.videoSrc) return;
    video.src = playerState.videoSrc;
    video.load()
    video.play()

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { // Chrome, Safari, Opera
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
      video.msRequestFullscreen();
    }
    dispatch(setAudioIsPlaying(false))
  }, [playerState.trackId])

  const volumeChangeHandler = React.useCallback((e: Event, value: number | number[]) => {
    dispatch(setVolume(value as number / 100))
  }, [dispatch])

  React.useEffect(() => {
    // check if audio is exist and if audioSrc is exist
    const video = videoRef.current;
    if (!video) return;
    video.onended = () => {

    }

    function fullscreenChange(e: Event) {
      if (!video) return;
      const style = video.style
      console.log('fullscreenChange', style.display)
      if (style.display !== "none") {
        video.pause()
        style.display = 'none'
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
        }
      } else {
        style.display = 'block'
      }
    }
    video.addEventListener("fullscreenchange", fullscreenChange)
    return () => video.removeEventListener("fullscreenchange", fullscreenChange)
  }, [playerState.videoSrc, dispatch])

  return (<>
    <div className='flex items-center' style={{
      gap: "8px",
      margin: "8px",
      paddingRight: "32px"
    }}>
      <video ref={videoRef} controls={true} style={{ display: "none" }} />
      <IconButton aria-label="Tải xuống" size="large" onClick={fullscreenMVHandler}>
        <MusicVideoIcon fontSize="inherit" style={{ color: 'white' }} />
      </IconButton>
      <VolumeUpIcon style={{ color: 'white' }} />
      <Slider value={playerState.audioVolume * 100} onChange={volumeChangeHandler} aria-label="Âm lượng" valueLabelDisplay="off" size="small" />
    </div>
  </>);
}
