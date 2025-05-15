import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistDetail, likePlaylist, unlikePlaylist } from '../../api/trackApi';
import { useAppDispatch, useAppSelector } from '../../store/reduxhooks';
import { setPlaylistAction } from '../../store/slices/playlistSlice';
import { PlaylistDetail } from '../../types';
import Playlist from '../../containers/Playlist/Playlist';
import { getTracksDuration, getArtistName } from '../../shared/utils/playlist-utils';
import PlaylistDeleteModal from '../../components/Playlist/PlaylistDeleteModal';

export interface PlaylistPageProps {
}

export default function PlaylistPage(props: PlaylistPageProps) {
    const [open, setOpen] = React.useState(false)
    const [playlistDetail, setPlaylistDetail] = React.useState<PlaylistDetail | null>(null)

    const { id } = useParams()

    const dispatch = useAppDispatch();

    const authInfo = useAppSelector(state => state.auth.authInfo)

    // check if this is the user's profile to show edit profile image button
    const isThisUser = playlistDetail?.author?.id === authInfo.id

    // get artists and durations as readable string
    const [artists, durations] = React.useMemo(() => {
        if (!playlistDetail) return ['', '']
        const tracks = playlistDetail.tracks;
        return [getArtistName(tracks), getTracksDuration(tracks)]
    }, [playlistDetail])

    // get playlist detail
    React.useEffect(() => {
        if (!id || id === "create") return;
        getPlaylistDetail(+id).then(response => {
            setPlaylistDetail(response.data);
        })
    }, [id])

    // play playlist
    const playPlaylistHandler = React.useCallback(() => {
        dispatch(setPlaylistAction({ playlist: playlistDetail! }))
    }, [dispatch, playlistDetail])

    // like playlist if not liked, unlike if liked
    const likePlaylistHandler = React.useCallback((e?: React.MouseEvent) => {
        if (!playlistDetail) return;
        if (playlistDetail.liked) {
            unlikePlaylist(playlistDetail.id).then(response => {
                setPlaylistDetail(prev => {
                    return { ...prev!, liked: false }
                })
            })
        } else {
            likePlaylist(playlistDetail.id).then(response => {
                setPlaylistDetail(prev => {
                    return { ...prev!, liked: true }
                })
            })
        }
    }, [playlistDetail])

    const deletePlaylist = React.useCallback((e?: React.MouseEvent) => {
        if (!playlistDetail) return;
        setOpen(true)
    }, [playlistDetail, open])

    return (<>
        {isThisUser ? (
            <PlaylistDeleteModal id={playlistDetail.id} title={playlistDetail.title} open={open} onClose={() => setOpen(false)} />
        ) : ''}
        {playlistDetail && <Playlist
            image={playlistDetail.image}
            playlistType="Playlist"
            title={playlistDetail.title}
            artists={artists}
            durations={durations}
            playPlaylist={playPlaylistHandler}
            toggleLikePlaylist={isThisUser ? deletePlaylist : likePlaylistHandler}
            hasLikeButton={!isThisUser}
            tracks={playlistDetail.tracks}
            playlist={playlistDetail}
        />}
    </>)
}
