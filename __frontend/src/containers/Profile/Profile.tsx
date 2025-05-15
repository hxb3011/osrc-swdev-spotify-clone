import * as React from 'react';
import { getProfile } from '../../api/authApi';
import VerticalArtist from '../../components/Artist/VerticalArtist';
import VerticalPlaylist from '../../components/Playlist/VerticalPlaylist';
import ProfilePhoto from '../../components/Profile/ProfilePhoto';
import { Playlist, PlaylistDetail, Profile as ProfileType, TracksType } from '../../types';
import ImageUploadModal from '../../components/Profile/ImageUploadModal';
import { useAppDispatch, useAppSelector } from '../../store/reduxhooks';
import { getLikedTracks } from '../../api/trackApi';
import likeImage from "../../assets/images/like.webp";
import { setPlaylistAction } from '../../store/slices/playlistSlice';

export interface ProfileProps {
}

export default function Profile(props: ProfileProps) {
  const [profile, setProfile] = React.useState<ProfileType>()
  const [profilePhoto, setProfilePhoto] = React.useState<string>('')
  const [likedTracksPlaylist, setLikedTracksPlaylist] = React.useState<Playlist>();
  const [open, setOpen] = React.useState(false)

  const dispatch = useAppDispatch()
  const authInfo = useAppSelector(state => state.auth.authInfo)

  // check if this is the user's profile to show edit profile image button
  const isThisUser = profile?.user_id === authInfo.user_id

  React.useEffect(() => {
    // set profile details and profile image
    getProfile().then(res => {
      let profile: ProfileType = res.data;
      setProfile(profile)
      setProfilePhoto(profile.image)
      const playlist: Playlist = {
        id: 0,
        title: "Bản nhạc yêu thích",
        image: likeImage,
        color: "purple",
        featured: false,
        hide: false,
        author: profile,
        updated: '',
        created: ''
      };
      setLikedTracksPlaylist(playlist);
    })
  }, [])

  // change profile image when user uploads a new image
  const changeProfilePhoto = (image: string) => {
    setProfilePhoto(image)
  }

  // play playlist
  const playPlaylistHandler = React.useCallback(() => {
    getLikedTracks().then((response) => {
      const tracks: TracksType = response.data;
      const playlist: PlaylistDetail = {
        id: 0,
        title: "Bản nhạc yêu thích",
        image: likeImage,
        color: "purple",
        featured: false,
        hide: false,
        tracks: tracks,
        liked: false,
      };
      dispatch(setPlaylistAction({ playlist }));
    });
  }, [dispatch, likedTracksPlaylist]);

  if (!profile) return null

  return (
    <div className='flex flex-col' style={{ gap: "32px", padding: "16px" }}>
      <ImageUploadModal changeProfilePhoto={changeProfilePhoto} open={open} onClose={() => setOpen(false)} />
      <div className='flex gap-10 mb-10'>
        <ProfilePhoto image={profilePhoto} editable={isThisUser} edit={() => setOpen(true)} />
        <div className='flex flex-col justify-end text-white '>
          <div style={{ paddingBottom: "8px" }}>Hồ sơ</div>
          <div className='mb-9 mt-2 text-8xl font-bold' style={{ paddingBottom: "48px" }}>{profile.last_name} {profile.first_name}</div>
          <div style={{ paddingBottom: "8px" }}>{profile.playlists.length} danh sách phát</div>
        </div>
      </div>

      <div>
        <div className='text-3xl text-white font-bold' style={{ paddingBottom: "16px" }}>Nghệ sĩ đã theo dõi</div>
        <div className='grid grid-cols-5' style={{ gap: "16px", paddingBottom: "8px" }}>
          {profile.followed_artists.map(artist => (
            <VerticalArtist artist={artist} key={artist.id} />
          ))}
        </div>
      </div>

      <div className='mt-5'>
        <div className='text-3xl text-white font-bold' style={{ paddingBottom: "16px" }}>Danh sách phát</div>
        <div className='grid grid-cols-5' style={{ gap: "16px", paddingBottom: "8px" }}>
          {likedTracksPlaylist && <VerticalPlaylist playlist={likedTracksPlaylist} playlistRoute='/liked-tracks/' playHandler={playPlaylistHandler} key={0} />}
          {profile.playlists.map(playlist => (
            <VerticalPlaylist playlist={playlist} key={playlist.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
