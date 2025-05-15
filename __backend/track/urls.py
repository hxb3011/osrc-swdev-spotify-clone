from django.urls import path
from track.views import *

urlpatterns = [
    path('playlists/', PlaylistListAV.as_view(), name='playlist-list'),
    path('playlists/<int:pk>/', PlaylistDetailAV.as_view(), name='playlist-detail'),
    path('tracks/', TrackListAV.as_view(), name='track-list'),
    path('tracks/<int:pk>/', TrackDetailAV.as_view(), name='track-detail'),
    path('tracks/<int:pk>/audio/', TrackAudioAV.as_view(), name='track-audio'),
    path('tracks/<int:pk>/video/', TrackVideoAV.as_view(), name='track-video'),
    path('genres/', GenreListAV.as_view(), name='genre-list'),
    path('genres/<int:pk>/', GenreDetailAV.as_view(), name='genre-detail'),
    path('playlist-from-saved/', PlaylistCreateAV.as_view(), name='playlist-create'),
    path('playlist-to-del/<int:pk>/', PlaylistDestroyAV.as_view(), name='playlist-delete'),
]
