import * as React from 'react';
import { useAppDispatch } from '../../store/reduxhooks';
import { PlaylistDetail, TracksType } from '../../types';
import { getArtistDetail } from '../../api/trackApi';
import { useParams } from 'react-router-dom';
import { getTracksDuration } from '../../shared/utils/playlist-utils';
import { setPlaylistAction } from '../../store/slices/playlistSlice';
import Playlist from '../../containers/Playlist/Playlist';
import { followArtist, unfollowArtist } from '../../api/authApi';

export interface ArtistPageProps {
}

export default function ArtistPage(props: ArtistPageProps) {
    const [artistPlaylist, setArtistPlaylist] = React.useState<PlaylistDetail>();

    const dispatch = useAppDispatch();
    const { artistId } = useParams<{ artistId: string }>();

    React.useEffect(() => {
        // get liked tracks and create a dummy playlist
        getArtistDetail(artistId!).then(response => {
            const artist = response.data
            const tracks: TracksType = artist.tracks;
            const playlist: PlaylistDetail = {
                "id": artist.id,
                "title": artist.last_name + ' ' + artist.first_name,
                "image": artist.image,
                "color": 'purple',
                "featured": false,
                "hide": false,
                "tracks": tracks,
                // the like property is used to determine if the artist is followed or not.
                "liked": artist.is_following
            }
            setArtistPlaylist(playlist)
        })
    }, [artistId])

    // follow or unfollow an artist
    const toggleFollowHandler = React.useCallback(() => {
        if (artistPlaylist) {
            if (artistPlaylist.liked) {
                unfollowArtist(artistPlaylist.id).then(response => {
                    setArtistPlaylist(prev => {
                        return { ...prev!, liked: false }
                    })
                })
            } else {
                followArtist(artistPlaylist.id).then(response => {
                    setArtistPlaylist(prev => {
                        return { ...prev!, liked: true }
                    })
                })
            }
        }
    }, [artistPlaylist])

    // get artists and durations as readable string
    const durations = React.useMemo(() => {
        if (!artistPlaylist) return '';
        const tracks = artistPlaylist.tracks;
        return getTracksDuration(tracks)
    }, [artistPlaylist])

    // play playlist
    const playPlaylistHandler = React.useCallback(() => {
        dispatch(setPlaylistAction({ playlist: artistPlaylist! }))
    }, [dispatch, artistPlaylist])


    return artistPlaylist && <Playlist
        image={artistPlaylist.image}
        playlistType="Artist"
        title={artistPlaylist.title}
        durations={durations}
        playPlaylist={playPlaylistHandler}
        toggleLikePlaylist={toggleFollowHandler}
        hasLikeButton={true}
        tracks={artistPlaylist.tracks}
        playlist={artistPlaylist}
    />;
}
