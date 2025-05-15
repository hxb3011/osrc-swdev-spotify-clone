import * as React from 'react';
import VerticalPlaylist from '../../components/Playlist/VerticalPlaylist';
import { PlaylistDetail, Track, PlaylistsType } from '../../types';
import TrackList from '../../components/Track/TrackList';
import { useAppDispatch } from '../../store/reduxhooks';
import { changePlaylistAndTrackAction } from '../../store/slices/playlistSlice';

export interface SearchListProps {
    trackPlaylist: PlaylistDetail;
    playlists: PlaylistsType;
}

export default function SearchList(props: SearchListProps) {
    const dispatch = useAppDispatch()

    const changeTrackHandler = React.useCallback((track: Track) => {
        dispatch(changePlaylistAndTrackAction({ track: track, playlist: props.trackPlaylist }))
    }, [dispatch, props.trackPlaylist])

    return (<div className='flex flex-col' style={{ gap: "32px", padding: "16px" }}>
        <div>
            <div className='text-4xl text-white font-bold' style={{ paddingBottom: "16px" }}>Bản nhạc</div>
            <div className='mb-10'>
                <TrackList tracks={props.trackPlaylist.tracks} onChangeTrack={changeTrackHandler} />
            </div>
        </div>
        <div>
            <div className='text-4xl text-white font-bold' style={{ paddingBottom: "16px" }}>Danh sách phát</div>
            <div className='grid grid-cols-5 gap-5'>
                {props.playlists.map((playlist) => (
                    <VerticalPlaylist playlist={playlist} key={playlist.id} />
                ))}
            </div>
        </div>
    </div>);
}
