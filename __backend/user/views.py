from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.response import Response
from rest_framework import status, parsers
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
    UpdateAPIView
)
from .serializers import (
    RegisterSerializer,
    ProfileInfoSerializer,
    ArtistSerializer,
    ArtistDetailSerializer,
    ProfileSerializer
)
from track.serializers import (
    PlayListSerializer, TrackSerializerForPlaylistDetail
)
from track.models import (
    Playlist, Track
)
from .models import Artist, Profile
from .permissions import ProfilePermission


class ProfileDetailAV(RetrieveAPIView):
    def get_object(self):
        return self.request.user.profile
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
class ProfileUploadAV(UpdateAPIView):
    def get_object(self):
        return self.request.user.profile
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, ProfilePermission]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser] 

class LikedPlaylistListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.profile.liked_playlists.all()
    serializer_class = PlayListSerializer
    permission_classes = [IsAuthenticated]
    
class LikedTrackListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.profile.liked_tracks.all()
    serializer_class = TrackSerializerForPlaylistDetail
    permission_classes = [IsAuthenticated]
    
class ArtistListAV(ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    
class ArtistDetailAV(RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
class FollowingArtistListAV(ListAPIView):
    def get_queryset(self):
        return self.request.user.profile.followed_artists.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_artist(request, pk):
    artist = get_object_or_404(Artist, pk=pk)
    request.user.profile.followed_artists.add(artist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_artist(request, pk):
    artist = get_object_or_404(Artist, pk=pk)
    request.user.profile.followed_artists.remove(artist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_track(request, pk):
    track = get_object_or_404(Track, pk=pk)
    request.user.profile.liked_tracks.add(track)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlike_track(request, pk):
    track = get_object_or_404(Track, pk=pk)
    request.user.profile.liked_tracks.remove(track)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_playlist(request, pk):
    playlist = get_object_or_404(Playlist, pk=pk)
    request.user.profile.liked_playlists.add(playlist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlike_playlist(request, pk):
    playlist = get_object_or_404(Playlist, pk=pk)
    request.user.profile.liked_playlists.remove(playlist)
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
# @throttle_classes([AnonRateThrottle, UserRateThrottle])
def register_view(request):
    print('register', request.data)
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
# @throttle_classes([AnonRateThrottle, UserRateThrottle])
def login_view(request):
    user_info = request.data.get('user_info')
    password = request.data.get('password')
    if '@' in user_info:
        user = User.objects.filter(email=user_info).first()
    else:
        user = User.objects.filter(username=user_info).first()
    
    if user and user.check_password(password):
        serializer = ProfileInfoSerializer(instance=user.profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(data={'message': 'User info or password is incorrect!'}, status=status.HTTP_400_BAD_REQUEST)