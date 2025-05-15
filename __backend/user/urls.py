from django.urls import path
from user.views import *

urlpatterns = [
    path('liked-playlists/', LikedPlaylistListAV.as_view(), name='liked-playlist-list'),
    path('like-playlist/<int:pk>/', like_playlist, name='like-playlist'),
    path('unlike-playlist/<int:pk>/', unlike_playlist, name='unlike-playlist'),
    path('liked-tracks/', LikedTrackListAV.as_view(), name='liked-track-list'),
    path('like-track/<int:pk>/', like_track, name='like-track'),
    path('unlike-track/<int:pk>/', unlike_track, name='unlike-track'),
    path('artists/', ArtistListAV.as_view(), name='artist-list'),
    path('artists/<int:pk>/', ArtistDetailAV.as_view(), name='artist-detail'),
    path('following-artists/', FollowingArtistListAV.as_view(), name='following-artist-list'),
    path('follow-artist/<int:pk>/', follow_artist, name='follow-artist'),
    path('unfollow-artist/<int:pk>/', unfollow_artist, name='unfollow-artist'),
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', ProfileDetailAV.as_view(), name='profile-detail'),
    path('profile-image-upload/', ProfileUploadAV.as_view(), name='profile-image-upload'),
]
