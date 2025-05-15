import { Slider } from "@mui/material";
import * as React from "react";
import PlayButton from "../UI/PlayButton";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import IconButton from "@mui/material/IconButton";
import { useAppDispatch, useAppSelector } from "../../store/reduxhooks";
import {
  setAudioIsPlaying,
  toggleAudioIsPlaying,
} from "../../store/slices/playerSlice";
import {
  selectBeforeTrack,
  selectNextTrack,
} from "../../store/slices/playlistSlice";

export interface PlayerProps { }

export default function Player(props: PlayerProps) {
  const [duration, setDuration] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [sliderValue, setSliderValue] = React.useState<number>(0);
  const [audioIsLoaded, setIsAudioLoaded] = React.useState<boolean>(false);

  function formatTime(s: number) {
    let m = Math.floor(s / 60);
    s = Math.floor(s % 60);
    let h = Math.floor(m / 60);
    m = Math.floor(m % 60);
    let r = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    if (h != 0) r = `${String(h).padStart(2, "0")}:${r}`;
    return r;
  }

  const audioRef = React.useRef<HTMLAudioElement>(null);

  const playerState = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  // change audio src when track is changed
  React.useEffect(() => {
    // check if audio is exist and if audioSrc is exist
    const audio = audioRef.current;
    if (!audio || !playerState.audioSrc) return;
    audio.src = playerState.audioSrc;
    audio.load();
    setIsAudioLoaded(true);
    audio.ontimeupdate = () => {
      const duration = audio.duration;
      if (!isNaN(duration as number)) setDuration(duration);
      const currentTime = audio.currentTime;
      if (!isNaN(currentTime as number)) setCurrentTime(currentTime);
      const progress = (currentTime / duration) * 100;
      setSliderValue(progress);
    };
    audio.onended = () => {
      dispatch(selectNextTrack());
    };
    // play audio if shouldPlay is true
    if (!playerState.shouldPlay) return;
    audio.play();
    dispatch(setAudioIsPlaying(true));
  }, [playerState.audioSrc, playerState.shouldPlay, dispatch]);

  // change audio volume when volume is changed
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playerState.audioSrc) return;
    audio.volume = playerState.audioVolume;
  }, [playerState.audioVolume, playerState.audioSrc]);

  // play or pause audio when play button is clicked
  React.useEffect(() => {
    const audio = audioRef.current;
    // check if audio is exist and if audio is loaded
    if (!audio || !audioIsLoaded) return;
    if (playerState.audioIsPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    const duration = audio.duration;
    if (!isNaN(duration as number)) setDuration(duration);
    const currentTime = audio.currentTime;
    if (!isNaN(currentTime as number)) setCurrentTime(currentTime);
    const progress = (currentTime / duration) * 100;
    setSliderValue(progress);
  }, [playerState.audioIsPlaying, audioIsLoaded]);

  // play or pause audio when space key is pressed
  const playHandler = React.useCallback(() => {
    dispatch(toggleAudioIsPlaying(null));
  }, [dispatch]);

  // play previous track when left arrow key is pressed
  const beforeHandler = React.useCallback(() => {
    dispatch(selectBeforeTrack());
  }, [dispatch]);

  // play next track when right arrow key is pressed
  const nextHandler = React.useCallback(() => {
    dispatch(selectNextTrack());
  }, [dispatch]);

  // change audio current time when slider is changed
  const playerSliderHandler = React.useCallback(
    (e: Event, value: number | number[]) => {
      if (isNaN(value as number)) return;
      setSliderValue(value as number);
      const duration = audioRef.current!.duration;
      if (!isNaN(duration as number)) setDuration(duration);
      const currentTime = ((value as number) * duration) / 100;
      if (!isNaN(currentTime as number)) setCurrentTime(currentTime);
      audioRef.current!.currentTime = currentTime;
    },
    [],
  );

  // play or pause audio when space key is pressed and change audio current time when left or right arrow key is pressed
  React.useEffect(() => {
    const keyPressPlayerControl = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        playHandler();
      } else if (e.code === "ArrowLeft") {
        audioRef.current!.currentTime -= 5;
      } else if (e.code === "ArrowRight") {
        audioRef.current!.currentTime += 5;
      }
    };
    document.addEventListener("keydown", keyPressPlayerControl);
    // remove event listener when component is unmounted
    return () => {
      document.removeEventListener("keydown", keyPressPlayerControl);
    };
  }, [dispatch, playHandler]);

  return (
    <div className="w-full">
      <audio ref={audioRef} src="" className="none"></audio>
      <div className="flex justify-center">
        <IconButton
          aria-label="delete"
          size="large"
          style={{ fontSize: 40, color: "white" }}
          onClick={beforeHandler}
        >
          <FastRewindIcon fontSize="inherit" />
        </IconButton>
        <PlayButton
          color="text-white"
          onClick={playHandler}
          isPlaying={playerState.audioIsPlaying}
        />
        <IconButton
          aria-label="delete"
          size="large"
          style={{ fontSize: 40, color: "white" }}
          onClick={nextHandler}
        >
          <FastForwardIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div className="flex text-white" style={{ gap: "16px" }}>
        <div>{formatTime(currentTime)}</div>
        <Slider
          size="small"
          value={sliderValue || 0}
          aria-label="Small"
          valueLabelDisplay="off"
          onChange={playerSliderHandler}
        />
        <div>{formatTime(duration)}</div>
      </div>
    </div>
  );
}
