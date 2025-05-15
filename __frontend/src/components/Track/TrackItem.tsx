import * as React from 'react';
import LikeButton from '../UI/LikeButton';
import PlayButton from '../UI/PlayButton';
import { Track } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/reduxhooks';
import classNames from 'classnames';
import { likeTrack, unlikeTrack } from '../../api/trackApi';
import { Link } from 'react-router-dom';
import { setPlayerTrackLikedStatus, toggleAudioIsPlaying } from '../../store/slices/playerSlice';

export interface TrackItemProps {
    index: number,
    track: Track,
    onPlay: (e?: React.MouseEvent) => void,
}

export default function TrackItem(props: TrackItemProps) {
    const [liked, setLiked] = React.useState<boolean>(props.track.liked);
    const [currentlyPlaying, setCurrentlyPlaying] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const playerState = useAppSelector(state => state.player)
    const isThisTrackPlaying = playerState.trackId === props.track.id

    // calculate the duration of the track in minutes and seconds.
    const duration = React.useMemo(() => {
        const duration = props.track.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, [props.track.duration])


    // like or unlike a track.
    const likeTrackHandler = React.useCallback(() => {
        if (liked) {
            unlikeTrack(props.track.id)
                .then(() => {
                    setLiked(false)
                    // if this track is playing, update the like status of the track in action bar.
                    if (isThisTrackPlaying)
                        dispatch(setPlayerTrackLikedStatus(false))
                })
        } else {
            likeTrack(props.track.id)
                .then(() => {
                    setLiked(true)
                    // if this track is playing, update the like status of the track in action bar.
                    if (isThisTrackPlaying)
                        dispatch(setPlayerTrackLikedStatus(true))
                })
        }
    }, [props.track.id, dispatch, isThisTrackPlaying, liked])

    // play or pause a track if this track is playing.
    const playTrackHandler = React.useCallback(() => {
        if (isThisTrackPlaying) {
            dispatch(toggleAudioIsPlaying(null))
        } else {
            props.onPlay()
        }
    }, [isThisTrackPlaying, props, dispatch])

    // update the like and play status of the track if they changed by action bar.
    React.useEffect(() => {
        if (isThisTrackPlaying) {
            setLiked(playerState.trackLiked)
            setCurrentlyPlaying(playerState.audioIsPlaying)
        } else {
            setCurrentlyPlaying(false)
        }
    }, [playerState.trackLiked, playerState.audioIsPlaying, isThisTrackPlaying])

    return (
        <div
            className={classNames(
                'grid grid-cols-12 text-white items-center duration-100 hover:bg-emerald-200/20',
                { 'bg-emerald-200/20': currentlyPlaying },
            )} style={{ padding: "4px" }}
        >
            <div className='col-span-1 text-xl font-bold flex justify-center'>{props.index}</div>
            <div className='col-span-5 flex flex-wrap items-center gap-x-3 grid-cols-12'>
                <img className='col-span-5 w-14 h-14' src={props.track.image} alt="" />
                <div>
                    <div className='text-lg font-bold'>{props.track.title}</div>
                    <div className='text-sm'>
                        {props.track.artists && props.track.artists.map((artist) => (
                            <Link to={`/artists/${artist.id}`} key={artist.id}>
                                <span className='text-sm hover:underline'>{artist.last_name} {artist.first_name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className='col-span-3 flex justify-center'>{props.track.genres.join(', ')}</div>
            <div className='col-span-1 flex justify-center'><LikeButton liked={liked} styles={{ color: 'white' }} onClick={likeTrackHandler} /></div>
            <div className='col-span-1 flex justify-center' style={{ textAlign: "center" }}>{duration}</div>
            <div className='col-span-1 flex justify-center'><PlayButton color='text-white' onClick={playTrackHandler} isPlaying={currentlyPlaying} /></div>
        </div>
    );
}
