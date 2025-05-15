import * as React from 'react';
import TrackList from '../../components/Track/TrackList';
import { useParams } from 'react-router-dom';
import { getGenreDetail } from '../../api/trackApi';
import { GenreDetail, PlaylistDetail, Track } from '../../types';
import { useAppDispatch } from '../../store/reduxhooks';
import { changePlaylistAndTrackAction } from '../../store/slices/playlistSlice';

export interface GenrePageProps {
}

export default function GenrePage(props: GenrePageProps) {
    const [genreDetail, setGenreDetail] = React.useState<GenreDetail>();
    const [genrePlaylist, setGenrePlaylist] = React.useState<PlaylistDetail>();

    const {genreId} = useParams<{genreId: string}>();

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (!genreId) return;
        getGenreDetail(genreId!).then((res) => {
            let genreDetail: GenreDetail = res.data
            // genreDetail.tracks.forEach(value => value.genres = [genreDetail.title])
            setGenreDetail(genreDetail);

            const newgenrePlaylist: PlaylistDetail = {
                id: 0,
                title: res.data.title,
                tracks: res.data.tracks,
                liked: false,
            }
            setGenrePlaylist(newgenrePlaylist)
        })
    }, [genreId])

    const playTrackHandler = React.useCallback((track: Track) => {
        dispatch(changePlaylistAndTrackAction({track: track, playlist: genrePlaylist!}))
    }, [dispatch, genrePlaylist])

    return (
        <div className='p-10' style={{ padding: "16px" }}>
            <div className='text-7xl text-white font-bold' style={{ padding: "20px 20px 60px" }}>{genreDetail?.title || ''}</div>
            {genreDetail?.tracks && <TrackList tracks={genreDetail.tracks} onChangeTrack={playTrackHandler}/>}
        </div>
    );
}
